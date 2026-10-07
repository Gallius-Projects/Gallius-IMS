import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET: Retrieve accounts
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
        { username: { contains: search } },
        { role: { role: { contains: search } } },
      ];
    }

    const accounts = await prisma.accounts.findMany({
      where: whereClause,
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            middleName: true,
            employeeId: true,
          },
        },
        role: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Filter out the passwordHash from the response
    accounts.forEach((account) => {
      delete (account as any).passwordHash;
    });

    return NextResponse.json(accounts);
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
      departmentId,
      positionId,
    } = body;

    if (
      !firstName ||
      !lastName ||
      !middleName ||
      !employeeId ||
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
        departmentId: parseInt(departmentId),
        positionId: parseInt(positionId),
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
