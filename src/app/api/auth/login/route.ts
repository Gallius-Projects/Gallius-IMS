import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { comparePassword, generateToken, hashPassword } from '@/lib/auth';

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
    let sidebarLinksCount = 0;

    try {
      usersCount = await prisma.accounts.count();
      categoriesCount = await prisma.categories.count();
      brandsCount = await prisma.brands.count();
      locationsCount = await prisma.locations.count();
      suppliersCount = await prisma.suppliers.count();
      officesCount = await prisma.offices.count();
      sidebarLinksCount = await prisma.sidebarLinks.count();
    } catch (dbError: unknown) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json(
        {
          error:
            'Database connection failed. Please ensure your MySQL instance is running and configured correctly in .env.',
        },
        { status: 500 }
      );
    }

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
        for (const officeData of offices) {
          const office = await prisma.offices.create({
            data: officeData,
          });

          await prisma.adminLogs.create({
            data: {
              activity: `Office "${office.name}" created`,
              updatedOffice: {
                connect: {
                  id: office.id,
                },
              },
            },
          });
        }
      } catch (error) {
        console.error('Office seeding failed:', error);
      }
    }

    // Auto-seed a default user if there are none (user-friendly development workflow)
    if (usersCount === 0) {
      const departmentsCount = await prisma.departments.count();
      const positionsCount = await prisma.positions.count();
      const rolesCount = await prisma.roles.count();

      if (departmentsCount === 0) {
        const departments = [
          {
            name: 'Information Technology',
            abbreviation: 'IT',
          },
          {
            name: 'Finance',
            abbreviation: 'FN',
          },
          {
            name: 'Human Resources',
            abbreviation: 'HR',
          },
          {
            name: 'Admin',
            abbreviation: 'AD',
          },
          {
            name: 'Sportsbooks',
            abbreviation: 'SB',
          },
          {
            name: 'Sales',
            abbreviation: 'SD',
          },
          {
            name: 'Customer Support',
            abbreviation: 'CS',
          },
          {
            name: 'Data Analytics',
            abbreviation: 'CP',
          },
          {
            name: 'Product Development',
            abbreviation: 'PD',
          },
          {
            name: 'Risk',
            abbreviation: 'SB',
          },
          {
            name: 'DCV',
            abbreviation: 'SB',
          },
          {
            name: 'ADO',
            abbreviation: 'CB',
          },
          {
            name: 'Quality Assurance',
            abbreviation: 'QA',
          },
          {
            name: 'Prematch',
            abbreviation: 'SB',
          },
          {
            name: 'Runningball',
            abbreviation: 'SB',
          },
          {
            name: 'eSports',
            abbreviation: 'ST',
          },
          {
            name: 'Integrations',
            abbreviation: 'IN',
          },
          {
            name: 'Other Sports',
            abbreviation: 'OS',
          },
        ];

        try {
          for (const departmentData of departments) {
            const department = await prisma.departments.create({
              data: departmentData,
            });

            await prisma.accountLogs.create({
              data: {
                activity: `Department "${department.name}" created`,
                updatedDepartment: {
                  connect: {
                    id: department.id,
                  },
                },
              },
            });
          }
        } catch (error: unknown) {
          console.error('Department creation failed:', error);
        }
      }

      if (positionsCount === 0) {
        const positions = [
          {
            name: 'IT Specialist',
            departmentId: 1,
          },
          {
            name: 'Senior IT Specialist',
            departmentId: 1,
          },
          {
            name: 'IT Manager',
            departmentId: 1,
          },
          {
            name: 'IT Supervisor',
            departmentId: 1,
          },
          {
            name: 'IT Assistant Team Leader',
            departmentId: 1,
          },
          {
            name: 'IT Assistant Supervisor',
            departmentId: 1,
          },
          {
            name: 'Infrastructure Engineer',
            departmentId: 1,
          },
          {
            name: 'Senior Supervisor',
            departmentId: 1,
          },
          {
            name: 'Sports Trader',
            departmentId: 1,
          },
          {
            name: 'Senior Quality Assurance Specialist',
            departmentId: 1,
          },
          {
            name: 'Team Leader',
            departmentId: 1,
          },
          {
            name: 'Product Support',
            departmentId: 1,
          },
          {
            name: 'Assistant Manager',
            departmentId: 1,
          },
          {
            name: 'Sportsbook Team Leader',
            departmentId: 1,
          },
          {
            name: 'Senior Sales Manager',
            departmentId: 1,
          },
          {
            name: 'Product Development Analyst',
            departmentId: 1,
          },
          {
            name: 'Admin Specialist',
            departmentId: 1,
          },
          {
            name: 'Human Resource Supervisor',
            departmentId: 1,
          },
          {
            name: 'Data Analyst',
            departmentId: 1,
          },
          {
            name: 'Senior Data Analyst',
            departmentId: 1,
          },
          {
            name: 'Data Analytics Team Leader',
            departmentId: 1,
          },
          {
            name: 'Senior Product Development Analyst',
            departmentId: 1,
          },
        ];

        try {
          for (const positionData of positions) {
            const position = await prisma.positions.create({
              data: positionData,
            });

            await prisma.accountLogs.create({
              data: {
                activity: `Position "${position.name}" created`,
                updatedPosition: {
                  connect: {
                    id: position.id,
                  },
                },
              },
            });
          }
        } catch (error: unknown) {
          console.error('Position creation failed:', error);
        }
      }

      if (rolesCount === 0) {
        const roles = [
          {
            role: 'superadmin',
            allowGradingSystem: true,
            allowInventorySystemAccess: true,
            allowInventorySystemAdd: true,
            allowInventorySystemEdit: true,
            allowInventorySystemDelete: true,
            allowInventorySystemVoid: true,
            allowInventorySystemViewAuditTrail: true,
            allowRequestForPurchaseAccess: true,
            allowRequestForPurchaseAdd: true,
            allowRequestForPurchaseEdit: true,
            allowRequestForPurchaseCancel: true,
            allowRequestForPurchasePost: true,
            allowRequestForPurchaseSendEmail: true,
            allowFixedAssetAccess: true,
            allowFixedAssetAdd: true,
            allowFixedAssetEdit: true,
            allowFixedAssetCancel: true,
            allowFixedAssetPost: true,
            allowFixedAssetSendEmail: true,
            allowUMAccess: true,
            allowUMAdd: true,
            allowUMEdit: true,
            allowLibrariesAccess: true,
            allowLibrariesAdd: true,
            allowLibrariesEdit: true,
            allowLibrariesDelete: true,
          },
          {
            role: 'admin',
            allowGradingSystem: true,
            allowInventorySystemAccess: true,
            allowInventorySystemAdd: true,
            allowInventorySystemEdit: true,
            allowInventorySystemDelete: false,
            allowInventorySystemVoid: false,
            allowInventorySystemViewAuditTrail: true,
            allowRequestForPurchaseAccess: true,
            allowRequestForPurchaseAdd: true,
            allowRequestForPurchaseEdit: true,
            allowRequestForPurchaseCancel: false,
            allowRequestForPurchasePost: false,
            allowRequestForPurchaseSendEmail: false,
            allowFixedAssetAccess: true,
            allowFixedAssetAdd: true,
            allowFixedAssetEdit: true,
            allowFixedAssetCancel: false,
            allowFixedAssetPost: false,
            allowFixedAssetSendEmail: false,
            allowUMAccess: false,
            allowUMAdd: false,
            allowUMEdit: false,
            allowLibrariesAccess: true,
            allowLibrariesAdd: true,
            allowLibrariesEdit: true,
            allowLibrariesDelete: false,
          },
          {
            role: 'user',
            allowGradingSystem: false,
            allowInventorySystemAccess: true,
            allowInventorySystemAdd: false,
            allowInventorySystemEdit: false,
            allowInventorySystemDelete: false,
            allowInventorySystemVoid: false,
            allowInventorySystemViewAuditTrail: false,
            allowRequestForPurchaseAccess: false,
            allowRequestForPurchaseAdd: false,
            allowRequestForPurchaseEdit: false,
            allowRequestForPurchaseCancel: false,
            allowRequestForPurchasePost: false,
            allowRequestForPurchaseSendEmail: false,
            allowFixedAssetAccess: false,
            allowFixedAssetAdd: false,
            allowFixedAssetEdit: false,
            allowFixedAssetCancel: false,
            allowFixedAssetPost: false,
            allowFixedAssetSendEmail: false,
            allowUMAccess: false,
            allowUMAdd: false,
            allowUMEdit: false,
            allowLibrariesAccess: false,
            allowLibrariesAdd: false,
            allowLibrariesEdit: false,
            allowLibrariesDelete: false,
          },
        ];

        try {
          for (const roleData of roles) {
            const role = await prisma.roles.create({
              data: roleData,
            });

            await prisma.accountLogs.create({
              data: {
                activity: `Role "${role.role}" created`,
                updatedRole: {
                  connect: {
                    id: role.id,
                  },
                },
              },
            });
          }
        } catch (error: unknown) {
          console.error('Role creation failed:', error);
        }
      }

      try {
        const employee = await prisma.employees.create({
          data: {
            firstName: 'Matthew',
            lastName: 'Romero',
            middleName: 'Espejo',
            employeeId: '12003',
            departmentId: 1,
            positionId: 1,
            officeId: 1,
          },
        });

        const account = await prisma.accounts.create({
          data: {
            employeeId: employee.id,
            username: 'matthew.romero',
            passwordHash: hashPassword('admin123'),
            roleId: 1,
          },
        });

        await prisma.accountLogs.create({
          data: {
            activity: `Employee "${employee.firstName} ${employee.lastName}" created`,
            updatedEmployee: {
              connect: {
                id: employee.id,
              },
            },
          },
        });

        await prisma.accountLogs.create({
          data: {
            activity: `Account "${account.username}" created`,
            updatedAccount: {
              connect: {
                uuid: account.uuid,
              },
            },
          },
        });
      } catch (error: unknown) {
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
          abbreviation: 'L',
          quantity: 0,
        },
        {
          name: 'System Unit',
          abbreviation: 'PC',
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
          name: 'Processor',
          abbreviation: 'PRC',
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
        {
          name: 'RAM',
          abbreviation: 'RAM',
          quantity: 0,
        },
        {
          name: 'SSD',
          abbreviation: 'SSD',
          quantity: 0,
        },
        {
          name: 'HDD',
          abbreviation: 'HDD',
          quantity: 0,
        },
        {
          name: 'Video Card',
          abbreviation: 'VC',
          quantity: 0,
        },
        {
          name: 'USB Flash Drive',
          abbreviation: 'USB',
          quantity: 0,
        },
      ];

      try {
        for (const categoryData of categories) {
          const category = await prisma.categories.create({
            data: categoryData,
          });

          await prisma.adminLogs.create({
            data: {
              activity: `Category "${category.name}" created`,
              updatedCategory: {
                connect: {
                  id: category.id,
                },
              },
            },
          });
        }
      } catch (error: unknown) {
        console.error('Category creation failed:', error);
      }
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

      try {
        for (const brandData of brands) {
          const brand = await prisma.brands.create({
            data: brandData,
          });

          await prisma.adminLogs.create({
            data: {
              activity: `Brand "${brand.name}" created`,
              updatedBrand: {
                connect: {
                  id: brand.id,
                },
              },
            },
          });
        }
      } catch (error: unknown) {
        console.error('Brand creation failed:', error);
      }
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

      try {
        for (const supplierData of suppliers) {
          const supplier = await prisma.suppliers.create({
            data: supplierData,
          });

          await prisma.adminLogs.create({
            data: {
              activity: `Supplier "${supplier.name}" created`,
              updatedSupplier: {
                connect: {
                  id: supplier.id,
                },
              },
            },
          });
        }
      } catch (error: unknown) {
        console.error('Supplier creation failed:', error);
      }
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
          name: 'PEZA',
          abbreviation: 'PEZ',
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

      try {
        for (const locationData of locations) {
          const location = await prisma.locations.create({
            data: locationData,
          });

          await prisma.adminLogs.create({
            data: {
              activity: `Location "${location.name}" created`,
              updatedLocation: {
                connect: {
                  id: location.id,
                },
              },
            },
          });
        }
      } catch (error: unknown) {
        console.error('Location creation failed:', error);
      }
    }

    const user = await prisma.accounts.findUnique({
      where: { username },
      include: { role: true },
    });

    if (!user || !comparePassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // if (sidebarLinksCount === 0) {
    //   const directories = [
    //     {
    //       name: 'Dashboard',
    //       path: '/',
    //       icon: 'Home',
    //       category: 'home',
    //       access: [3, 2, 1],
    //     },
    //     {
    //       name: 'Inventory',
    //       path: '/inventory/items',
    //       icon: 'MonitorCog',
    //       category: 'inventory',
    //       access: [2, 1],
    //     },
    //     {
    //       name: 'Employees',
    //       path: '/admin/employees',
    //       icon: 'IdCard',
    //       category: 'user-management',
    //       access: [2, 1],
    //     },
    //     {
    //       name: 'Departments',
    //       path: '/admin/departments',
    //       icon: 'Building2',
    //       category: 'libraries',
    //       access: [2, 1],
    //     },
    //     {
    //       name: 'Categories',
    //       path: '/admin/categories',
    //       icon: 'Tags',
    //       category: 'libraries',
    //       access: [2, 1],
    //     },
    //     {
    //       name: 'Brands',
    //       path: '/admin/brands',
    //       icon: 'Award',
    //       category: 'libraries',
    //       access: [2, 1],
    //     },
    //     {
    //       name: 'Locations',
    //       path: '/admin/locations',
    //       icon: 'MapPin',
    //       category: 'libraries',
    //       access: [2, 1],
    //     },
    //     {
    //       name: 'Offices',
    //       path: '/admin/offices',
    //       icon: 'Building',
    //       category: 'libraries',
    //       access: [2, 1],
    //     },
    //     {
    //       name: 'Suppliers',
    //       path: '/admin/suppliers',
    //       icon: 'Truck',
    //       category: 'libraries',
    //       access: [2, 1],
    //     },
    //     {
    //       name: 'Roles',
    //       path: '/admin/roles',
    //       icon: 'Cog',
    //       category: 'user-management',
    //       access: [1],
    //     },
    //     {
    //       name: 'Departments',
    //       path: '/admin/departments',
    //       icon: 'Building2',
    //       category: 'user-management',
    //       access: [1],
    //     },
    //     {
    //       name: 'Positions',
    //       path: '/admin/positions',
    //       icon: 'UserRoundCog',
    //       category: 'user-management',
    //       access: [1],
    //     },
    //     {
    //       name: 'Sidebar Links',
    //       path: '/admin/sidebar-management',
    //       icon: 'LucidePanelLeft',
    //       category: 'setting',
    //       access: [1],
    //     },
    //   ];

    //   try {
    //     for (const directoryData of directories) {
    //       const sidebarLink = await Promise.all(
    //         directories.map((directory) =>
    //           prisma.sidebarLinks.create({
    //             data: {
    //               name: directory.name,
    //               path: directory.path,
    //               icon: directory.icon,
    //               category: directory.category,
    //               sidebarLinkRoles: {
    //                 create: directory.access.map((roleId) => ({
    //                   roleId,
    //                 })),
    //               },
    //             },
    //           })
    //         )
    //       );

    //       await prisma.adminLogs.create({
    //         data: {
    //           activity: `Sidebar Link "${sidebarLink.name}" created`,
    //           updatedSidebarLink: {
    //             connect: {
    //               id: sidebarLink.id,
    //             },
    //           },
    //         },
    //       });
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }

    if (!user.status) {
      return NextResponse.json(
        {
          error:
            'Your account has been deactivated. Please contact the administrator.',
        },
        { status: 403 }
      );
    }

    const token = generateToken({ userId: user.uuid, username: user.username });

    return NextResponse.json({
      token,
      user: {
        id: user.uuid,
        username: user.username,
        role: user?.role?.role,
      },
    });
  } catch (error: { message: string } | unknown) {
    console.error('Login route error:', error);
    return NextResponse.json(
      {
        error:
          (error as { message: string }).message ||
          'An unexpected error occurred during login.',
      },
      { status: 500 }
    );
  }
}
