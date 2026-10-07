import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET: Retrieve sidebar links
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
        { name: { contains: search } },
        { path: { contains: search } },
        { icon: { contains: search } },
      ];
    }

    const sidebarLinks = await prisma.sidebarLinks.findMany({
      where: whereClause,
      include: {
        sidebarLinkRoles: { include: { role: true } },
        adminLogs: {
          include: {
            involvedUser: {
              include: {
                employee: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
          orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
          take: 1,
        },
      },
    });

    return NextResponse.json(sidebarLinks);
  } catch (error: any) {
    console.error('Fetch sidebar links error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sidebar links' },
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
    const { name, path, icon, access } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Sidebar link name is required' },
        { status: 400 }
      );
    }

    const newSidebarLink = await prisma.sidebarLinks.create({
      data: {
        name,
        path,
        icon,
        sidebarLinkRoles: {
          create: access.map((roleId: any) => ({
            roleId,
          })),
        },
      },
    });

    await prisma.adminLogs.create({
      data: {
        activity: `Sidebar link "${name}" created`,
        updatedSidebarLink: {
          connect: { id: newSidebarLink.id },
        },
        involvedUser: {
          connect: { uuid: user.userId },
        },
      },
    });

    return NextResponse.json(newSidebarLink, { status: 201 });
  } catch (error: any) {
    console.error('Create sidebar link error:', error?.message);
    return NextResponse.json(
      { error: 'Failed to create sidebar link' },
      { status: 500 }
    );
  }
}
