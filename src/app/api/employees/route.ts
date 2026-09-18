import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET: Retrieve inventory items
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
    const firstName = searchParams.get('firstName') || '';
    const lastName = searchParams.get('lastName') || '';
    const middleName = searchParams.get('middleName') || '';
    const employeeId = searchParams.get('employeeId') || '';
    const departmentId = searchParams.get('departmentId') || '';
    const positionId = searchParams.get('positionId') || '';

    // Build Prisma query filters
    const whereClause: any = {};

    if (firstName) {
      whereClause.firstName = firstName;
    }

    if (lastName) {
      whereClause.lastName = lastName;
    }

    if (middleName) {
      whereClause.middleName = middleName;
    }

    if (employeeId) {
      whereClause.employeeId = parseInt(employeeId);
    }

    if (departmentId) {
      whereClause.departmentId = parseInt(departmentId);
    }

    if (positionId) {
      whereClause.positionId = parseInt(positionId);
    }

    if (search) {
      whereClause.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { middleName: { contains: search } },
        { employeeId: { contains: search } },
        { departmentId: { contains: search } },
        { positionId: { contains: search } },
      ];
    }

    const employees = await prisma.employees.findMany({
      where: whereClause,
      include: {
        position: {
          select: {
            name: true,
          },
        },
        department: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(employees);
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
