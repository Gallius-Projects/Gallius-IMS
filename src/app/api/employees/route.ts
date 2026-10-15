import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET: Retrieve employees
export async function GET(req: Request) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    // Build Prisma query filters
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { middleName: { contains: search } },
        { suffix: { contains: search } },
        { accounts: { username: { contains: search } } },
        { involvedUser: { employee: { firstName: { contains: search } } } },
        { involvedUser: { employee: { lastName: { contains: search } } } },
        { involvedUser: { employee: { middleName: { contains: search } } } },
        { involvedUser: { employee: { suffix: { contains: search } } } },
      ];
    }

    const employees = await prisma.employees.findMany({
      where: whereClause,
      include: {
        position: true,
        department: true,
        accounts: true,
        accountLogs: {
          include: {
            involvedUser: {
              include: {
                employee: { select: { firstName: true, lastName: true } },
              },
            },
          },
          orderBy: [{ updatedAt: 'desc' }],
          take: 1,
        },
      },
    });

    const employeesWithLatestLog = employees.map((employee) => {
      const latestLog = employee?.accountLogs[0];

      return {
        ...employee,
        accountStatus: employee?.accounts?.status,
        createdAt: latestLog?.createdAt,
        updatedAt: latestLog?.updatedAt,
        updatedBy: latestLog?.involvedUser?.employee
          ? latestLog?.involvedUser?.employee.firstName +
            ' ' +
            latestLog?.involvedUser?.employee.lastName
          : '--',
      };
    });

    return NextResponse.json(employeesWithLatestLog);
  } catch (error: any) {
    console.error('Fetch employees error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

// POST: Add new inventory item
export async function POST(req: Request) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      firstName,
      lastName,
      middleName,
      employeeId,
      officeId,
      departmentId,
      positionId,
    } = body;

    if (
      !firstName ||
      !lastName ||
      !middleName ||
      !employeeId ||
      !officeId ||
      !departmentId ||
      !positionId
    ) {
      return NextResponse.json(
        { error: 'All employee fields are required' },
        { status: 400 }
      );
    }

    const newEmployee = await prisma.employees.create({
      data: {
        firstName,
        lastName,
        middleName,
        employeeId,
        office: { connect: { id: parseInt(officeId) } },
        department: { connect: { id: parseInt(departmentId) } },
        position: { connect: { id: parseInt(positionId) } },
      },
    });

    await prisma.accountLogs.create({
      data: {
        activity: `Employee ${firstName} ${lastName} ${middleName} created`,
        updatedEmployee: {
          connect: { id: newEmployee.id },
        },
        involvedUser: {
          connect: { uuid: user.userId },
        },
      },
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error: any) {
    console.error('Create employee error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create employee' },
      { status: 500 }
    );
  }
}
