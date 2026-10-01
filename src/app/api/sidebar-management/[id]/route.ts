import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET: Retrieve a single sidebar link
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
    const itemId = parseInt(id);
    if (isNaN(itemId)) {
      return NextResponse.json(
        { error: 'Invalid sidebar link ID' },
        { status: 400 }
      );
    }

    const sidebarLink = await prisma.sidebarLinks.findUnique({
      where: { id: itemId },
      include: {
        updatedByUser: {
          select: {
            employee: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!sidebarLink) {
      return NextResponse.json(
        { error: 'Sidebar link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(sidebarLink);
  } catch (error: any) {
    console.error('Fetch single sidebar link error:', error?.message);
    return NextResponse.json(
      { error: 'Failed to fetch sidebar link details' },
      { status: 500 }
    );
  }
}

// PUT: Update a sidebar link
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

    const itemId = parseInt(id, 10);

    if (isNaN(itemId)) {
      return NextResponse.json(
        { error: 'Invalid sidebar link ID' },
        { status: 400 }
      );
    }

    const body = await req.json();

    const { name, path, icon, access } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Sidebar link name is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(access)) {
      return NextResponse.json(
        { error: 'Access must be an array of role IDs' },
        { status: 400 }
      );
    }

    const updatedSidebarLink = await prisma.$transaction(async (tx) => {
      // 1. Update the sidebar link itself
      const sidebarLink = await tx.sidebarLinks.update({
        where: {
          id: itemId,
        },
        data: {
          name,
          path,
          icon,
          updatedBy: user.userId,
        },
      });

      // 2. Remove existing role assignments
      await tx.sidebarLinkRoles.deleteMany({
        where: {
          sidebarLinkId: itemId,
        },
      });

      // 3. Add the new role assignments
      if (access.length > 0) {
        await tx.sidebarLinkRoles.createMany({
          data: access.map((roleId: number) => ({
            sidebarLinkId: itemId,
            roleId,
          })),
        });
      }

      return sidebarLink;
    });

    return NextResponse.json(updatedSidebarLink);
  } catch (error: any) {
    console.error('Update sidebar link error:', error);

    return NextResponse.json(
      {
        error: 'Failed to update sidebar link',
        details: error?.message,
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete a sidebar link
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
    const itemId = parseInt(id);
    if (isNaN(itemId)) {
      return NextResponse.json(
        { error: 'Invalid sidebar link ID' },
        { status: 400 }
      );
    }

    await prisma.sidebarLinks.delete({
      where: { id: itemId },
    });

    return NextResponse.json({
      success: true,
      message: 'Sidebar link deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete sidebar link error:', error?.message);
    return NextResponse.json(
      { error: 'Failed to delete sidebar link' },
      { status: 500 }
    );
  }
}
