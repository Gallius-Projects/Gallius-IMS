import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET: Retrieve a single role
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
    const roleId = parseInt(id);
    if (isNaN(roleId)) {
      return NextResponse.json({ error: 'Invalid role ID' }, { status: 400 });
    }

    const item = await prisma.roles.findUnique({
      where: { id: roleId },
      include: {
        accountLogs: {
          include: {
            involvedUser: {
              include: {
                employee: { select: { firstName: true, lastName: true } },
              },
            },
          },
          orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
          take: 1,
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: 'role not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error: any) {
    console.error('Fetch single role error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch role details' },
      { status: 500 }
    );
  }
}

// PUT: Update an role
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
    const roleId = parseInt(id);
    if (isNaN(roleId)) {
      return NextResponse.json({ error: 'Invalid role ID' }, { status: 400 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'role name is required' },
        { status: 400 }
      );
    }

    const role = await prisma.roles.findUnique({
      where: { id: roleId },
    });

    const changes = [];

    if (name !== role?.name) {
      changes.push({
        field: 'name',
        oldValue: role?.name,
        newValue: name,
      });
    }

    if (changes.length === 0) {
      return NextResponse.json({ message: 'No changes to update', changes });
    }

    const updatedRole = await prisma.roles.update({
      where: { id: roleId },
      data: {
        name,
      },
    });

    await prisma.accountLogs.create({
      data: {
        activity: `Updated role from ${role?.name} to ${name}`,
        updatedRole: {
          connect: { id: roleId },
        },
        involvedUser: {
          connect: { uuid: user.userId },
        },
      },
    });

    return NextResponse.json({ updatedRole, changes });
  } catch (error: any) {
    console.error('Update role error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update role' },
      { status: 500 }
    );
  }
}

// DELETE: Delete an role
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
    const roleId = parseInt(id);
    if (isNaN(roleId)) {
      return NextResponse.json({ error: 'Invalid role ID' }, { status: 400 });
    }

    await prisma.roles.delete({
      where: { id: roleId },
    });

    return NextResponse.json({
      success: true,
      message: 'Role deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete role error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete Role' },
      { status: 500 }
    );
  }
}
