import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET: Retrieve a single department
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
    const departmentId = parseInt(id);
    if (isNaN(departmentId)) {
      return NextResponse.json(
        { error: 'Invalid department ID' },
        { status: 400 }
      );
    }

    const department = await prisma.departments.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(department);
  } catch (error: any) {
    console.error('Fetch single department error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch department' },
      { status: 500 }
    );
  }
}

// PUT: Update a department
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
    const departmentId = parseInt(id);
    if (isNaN(departmentId)) {
      return NextResponse.json(
        { error: 'Invalid department ID' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, updatedBy } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Department name is required' },
        { status: 400 }
      );
    }

    const updatedDepartment = await prisma.departments.update({
      where: { id: departmentId },
      data: {
        name,
        updatedBy: {
          connect: { uuid: updatedBy },
        },
      },
    });

    return NextResponse.json(updatedDepartment);
  } catch (error: any) {
    console.error('Update department error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update department' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a department
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
    const departmentId = parseInt(id);
    if (isNaN(departmentId)) {
      return NextResponse.json(
        { error: 'Invalid department ID' },
        { status: 400 }
      );
    }

    await prisma.departments.delete({
      where: { id: departmentId },
    });

    return NextResponse.json({
      success: true,
      message: 'Department deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete department error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete department' },
      { status: 500 }
    );
  }
}
