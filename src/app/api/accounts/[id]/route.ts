import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET: Retrieve a single employee
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const employeeId = parseInt(id);
    if (isNaN(employeeId)) {
      return NextResponse.json(
        { error: 'Invalid employee ID' },
        { status: 400 }
      );
    }

    const employee = await prisma.employees.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error: any) {
    console.error('Fetch single employee error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch employee' },
      { status: 500 }
    );
  }
}

// PUT: Update an employee
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const employeeId = parseInt(id);
    if (isNaN(employeeId)) {
      return NextResponse.json(
        { error: 'Invalid employee ID' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      firstName,
      lastName,
      middleName,
      suffix,
      officeId,
      tenantId,
      departmentId,
      positionId,
      status,
    } = body;

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'Employee name is required' },
        { status: 400 }
      );
    }

    const updatedEmployee = await prisma.employees.update({
      where: { id: employeeId },
      data: {
        firstName,
        lastName,
        middleName,
        suffix,
        office: {
          connect: { id: officeId },
        },
        department: {
          connect: { id: departmentId },
        },
        position: {
          connect: { id: positionId },
        },
        status,
      },
    });

    return NextResponse.json(updatedEmployee);
  } catch (error: any) {
    console.error('Update employee error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update employee' },
      { status: 500 }
    );
  }
}

// DELETE: Delete an employee
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const employeeId = parseInt(id);
    if (isNaN(employeeId)) {
      return NextResponse.json(
        { error: 'Invalid employee ID' },
        { status: 400 }
      );
    }

    await prisma.employees.delete({
      where: { id: employeeId },
    });

    return NextResponse.json({
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete employee error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete employee' },
      { status: 500 }
    );
  }
}
