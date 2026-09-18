import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { comparePassword, generateToken, hashPassword } from '@/lib/auth';
import { Computer } from 'lucide-react';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Ensure database connectivity
    let usersCount = 0;
    let categoriesCount = 0;
    let brandsCount = 0;
    let locationsCount = 0;
    let suppliersCount = 0;
    let officesCount = 0;

    try {
      usersCount = await prisma.accounts.count();
      categoriesCount = await prisma.categories.count();
      brandsCount = await prisma.brands.count();
      locationsCount = await prisma.locations.count();
      suppliersCount = await prisma.suppliers.count();
      officesCount = await prisma.offices.count();
    } catch (dbError: any) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json(
        {
          error:
            'Database connection failed. Please ensure your MySQL instance is running and configured correctly in .env.',
        },
        { status: 500 }
      );
    }

    let office;

    if (officesCount === 0) {
      const offices = [
        {
          name: 'Gallius Shared Services, OPC',
          abbreviation: 'GS',
        },
        {
          name: 'Inplaymatrix',
          abbreviation: 'IM',
        },
        {
          name: 'Vantage Solutions',
          abbreviation: 'VS',
        },
        {
          name: 'Cloversense Technologies Inc.',
          abbreviation: 'CTI',
        },
        {
          name: 'Statsonic',
          abbreviation: 'ST',
        },
        {
          name: 'KZING',
          abbreviation: 'KZ',
        },
      ];

      try {
        office = await prisma.offices.createMany({
          data: offices,
        });
      } catch (error: any) {
        console.error('Office creation failed:', error);
      }
    } else {
      try {
        office = await prisma.offices.findFirst();
      } catch (error: any) {
        console.error('Office finding failed:', error);
      }
    }

    // Auto-seed a default user if there are none (user-friendly development workflow)
    if (usersCount === 0) {
      const departmentsCount = await prisma.departments.count();
      const positionsCount = await prisma.positions.count();
      const rolesCount = await prisma.userRoles.count();

      let department;

      if (departmentsCount === 0) {
        try {
          department = await prisma.departments.create({
            data: {
              name: 'IT',
            },
          });
        } catch (error: any) {
          console.error('Department creation failed:', error);
        }
      } else {
        try {
          department = await prisma.departments.findFirst();
        } catch (error: any) {
          console.error('Department finding failed:', error);
        }
      }

      let position;

      if (positionsCount === 0) {
        try {
          position = await prisma.positions.create({
            data: {
              name: 'Technical Support Operations',
              departmentId: department ? department.id : 1,
            },
          });
        } catch (error: any) {
          console.error('Position creation failed:', error);
        }
      } else {
        try {
          position = await prisma.positions.findFirst();
        } catch (error: any) {
          console.error('Position finding failed:', error);
        }
      }

      let role;

      if (rolesCount === 0) {
        try {
          role = await prisma.userRoles.create({
            data: {
              role: 'admin',
            },
          });
        } catch (error: any) {
          console.error('Role creation failed:', error);
        }
      } else {
        try {
          role = await prisma.userRoles.findFirst();
        } catch (error: any) {
          console.error('Role finding failed:', error);
        }
      }

      try {
        const employee = await prisma.employees.create({
          data: {
            firstName: 'Matthew',
            lastName: 'Romero',
            middleName: 'Espejo',
            employeeId: '12003',
            departmentId: department ? department.id : 1,
            positionId: position ? position.id : 1,
            officeId: office ? office.id : 1,
          },
        });

        await prisma.accounts.create({
          data: {
            employeeId: employee.id,
            username: 'matthew.romero',
            passwordHash: hashPassword('admin123'),
            roleId: role ? role.id : 1,
          },
        });
      } catch (error: any) {
        console.error('User creation failed:', error);
      }
    }

    if (categoriesCount === 0) {
      const categories = [
        {
          name: 'Monitor',
          abbreviation: 'MON',
          quantity: 0,
        },
        {
          name: 'Laptop',
          abbreviation: 'LAP',
          quantity: 0,
        },
        {
          name: 'System Unit',
          abbreviation: 'SU',
          quantity: 0,
        },
        {
          name: 'UPS',
          abbreviation: 'UPS',
          quantity: 0,
        },
        {
          name: 'Switch',
          abbreviation: 'SW',
          quantity: 0,
        },
        {
          name: 'Router',
          abbreviation: 'RO',
          quantity: 0,
        },
        {
          name: 'Printer',
          abbreviation: 'PR',
          quantity: 0,
        },
        {
          name: 'Mouse',
          abbreviation: 'MSE',
          quantity: 0,
        },
        {
          name: 'Keyboard',
          abbreviation: 'KB',
          quantity: 0,
        },
        {
          name: 'Headset',
          abbreviation: 'HTD',
          quantity: 0,
        },
        {
          name: 'Webcam',
          abbreviation: 'WCM',
          quantity: 0,
        },
        {
          name: 'Mobile',
          abbreviation: 'MBL',
          quantity: 0,
        },
        {
          name: 'Tablet',
          abbreviation: 'TBL',
          quantity: 0,
        },
        {
          name: 'Charger',
          abbreviation: 'CHR',
          quantity: 0,
        },
      ];

      await prisma.categories.createMany({
        data: categories,
      });
    }

    if (brandsCount === 0) {
      const brands = [
        {
          name: 'Acer',
        },
        {
          name: 'Lenovo',
        },
        {
          name: 'Dell',
        },
        {
          name: 'HP',
        },
        {
          name: 'Rakk',
        },
        {
          name: 'Viewtech',
        },
      ];

      await prisma.brands.createMany({
        data: brands,
      });
    }

    if (suppliersCount === 0) {
      const suppliers = [
        {
          name: 'Columbia Technologies Inc',
          contactPerson: 'Princess Mae V. Sta Brigida',
          email: 'pvicente@cti-phil.com',
          contactNumber: '09433499387',
        },
        {
          name: 'AREN Computer Services',
          contactPerson: 'Mary Rose Bade',
          email: 'carol_aren@yahoo.com',
          contactNumber: '09457605544',
        },
        {
          name: 'Microphase',
          contactPerson: 'Annaliza Sapin',
          email: 'apsapin@microphase.net',
          contactNumber: '09556011952',
        },
        {
          name: 'PCWorx',
          contactPerson: 'Celestino Quina III',
          email: 'cquina@pcworx.ph',
          contactNumber: '09959359647',
        },
        {
          name: 'Technotrend',
          contactPerson: 'Emily Oropilla',
          email: 'emily_technotrend@yahoo.com',
          contactNumber: '09565677357',
        },
        {
          name: 'AG Infotech',
          contactPerson: 'Jill Ray Maaño',
          email: 'jmaano@ag-it.com.ph',
          contactNumber: '09062648058',
        },
        {
          name: 'PTSI',
          contactPerson: 'John Lesley Martinez',
          email: 'johnlesley@ptsiphil.com',
          contactNumber: '09175715531',
        },
        {
          name: 'Accent Micro Technologies, Inc (AMTI)',
          contactPerson: 'KM Cailing',
          email: 'marjorie.cailing@amti.com.ph',
          contactNumber: '09214611914',
        },
        {
          name: 'Keysys Inc',
          contactPerson: 'Nehemias Maria Cruz',
          email: 'nehemiasmaria.cruz@keysysincorporated.com',
          contactNumber: '09944791930',
        },
        {
          name: 'Magnum Computerware',
          contactPerson: 'Keith Viray',
          email: 'kgviray@magnumcomputerware.com',
          contactNumber: '09757318426',
        },
        {
          name: '3tech',
          contactPerson: 'Regie Canindo',
          email: 'regie.canindo@3tech.com.ph',
          contactNumber: '09175430687',
        },
        {
          name: 'Micro Image International',
          contactPerson: 'Metch Tenio',
          email: 'qtenio@microimageph.com',
        },
        {
          name: 'PrimeTech21 Computer Trading',
        },
        {
          name: 'Zenshin Systems',
        },
        {
          name: 'UAS',
        },
        {
          name: 'PC Gilmore',
        },
        {
          name: 'ELJ Computer Trading',
        },
        {
          name: 'Total Quality Machine',
        },
        {
          name: 'Lenovo (Thailand) Limited',
        },
        {
          name: 'Dynaquest',
        },
        {
          name: 'Techshack Computer Store',
        },
        {
          name: 'Northlink Office Systems Corporation',
        },
        {
          name: 'Best Denki',
        },
        {
          name: 'UOB SINGAPORE',
        },
        {
          name: 'Takacom Cellular SDN BHD',
        },
        {
          name: 'FCC Retail SDN BHD',
        },
        {
          name: 'Cellblitz Mobile Inc.',
        },
        {
          name: 'Thunder Match Technology',
        },
        {
          name: 'Lenovo Malaysia Official Website',
        },
        {
          name: 'IT GARAGE',
        },
        {
          name: 'Vali Computers',
        },
        {
          name: 'ETPI',
        },
        {
          name: 'DRJ TECHNOLOGIES TRADING CORP.',
        },
        {
          name: 'NOTEBOOK PLAZA',
        },
        {
          name: 'OCBC',
        },
        {
          name: 'PCExpress',
        },
        {
          name: 'TechZone',
        },
        {
          name: 'Nathan Computer ( INDONESIA )',
        },
      ];

      await prisma.suppliers.createMany({
        data: suppliers,
      });
    }

    if (locationsCount === 0) {
      const locations = [
        {
          name: 'Robinson Summit Center',
          abbreviation: 'RSC',
        },
        {
          name: 'One Ayala',
          abbreviation: 'OA',
        },
        {
          name: 'KZing',
          abbreviation: 'KZ',
        },
        {
          name: 'WFH',
          abbreviation: 'WFH',
        },
        {
          name: 'Baguio',
          abbreviation: 'BAG',
        },
        {
          name: 'Thailand',
          abbreviation: 'TH',
        },
        {
          name: 'M1',
          abbreviation: 'M1',
        },
        {
          name: 'Malaysia',
          abbreviation: 'MY',
        },
        {
          name: 'TitanPlay',
          abbreviation: 'TP',
        },
        {
          name: 'Cambodia',
          abbreviation: 'CM',
        },
        {
          name: 'Bulgaria',
          abbreviation: 'BG',
        },
        {
          name: 'Taiwan',
          abbreviation: 'TW',
        },
        {
          name: 'Singapore',
          abbreviation: 'SG',
        },
        {
          name: 'Colombo Sri Langka',
          abbreviation: 'SLK',
        },
        {
          name: 'Indonesia',
          abbreviation: 'ID',
        },
      ];

      await prisma.locations.createMany({
        data: locations,
      });
    }

    const user = await prisma.accounts.findUnique({
      where: { username },
    });

    if (!user || !comparePassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const token = generateToken({ userId: user.uuid, username: user.username });

    return NextResponse.json({
      token,
      user: {
        id: user.uuid,
        username: user.username,
      },
    });
  } catch (error: any) {
    console.error('Login route error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred during login.' },
      { status: 500 }
    );
  }
}
