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
      include: {
        positions: true,
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

    if (!department) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(department);
  } catch (error: { message: string } | unknown) {
    console.error('Fetch single department error:', error);
    return NextResponse.json(
      {
        error:
          (error as { message: string }).message ||
          'Failed to fetch department',
      },
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
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Department name is required' },
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

    const changes = [];

    if (name !== department.name) {
      changes.push({
        field: 'name',
        oldValue: department.name,
        newValue: name,
      });
    }

    if (changes.length === 0) {
      return NextResponse.json({
        message: 'No changes to update',
        changes,
      });
    }

    const updatedDepartment = await prisma.departments.update({
      where: { id: departmentId },
      data: {
        name,
      },
    });

    await prisma.accountLogs.create({
      data: {
        activity: `Department ${name} updated`,
        updatedDepartment: {
          connect: { id: updatedDepartment.id },
        },
        involvedUser: {
          connect: { uuid: user.userId },
        },
      },
    });

    return NextResponse.json(updatedDepartment);
  } catch (error: { message: string } | unknown) {
    console.error('Update department error:', error);
    return NextResponse.json(
      {
        error:
          (error as { message: string }).message ||
          'Failed to update department',
      },
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
  } catch (error: { message: string } | unknown) {
    console.error('Delete department error:', error);
    return NextResponse.json(
      {
        error:
          (error as { message: string }).message ||
          'Failed to delete department',
      },
      { status: 500 }
    );
  }
}
