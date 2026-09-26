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
    const name = searchParams.get('name') || '';
    const path = searchParams.get('path') || '';
    const icon = searchParams.get('icon') || '';
    const access = searchParams.get('access') || '';
    const createdAt = searchParams.get('createdAt') || '';
    const updatedAt = searchParams.get('updatedAt') || '';

    // Build Prisma query filters
    const whereClause: any = {};

    if (name) {
      whereClause.name = name;
    }

    if (path) {
      whereClause.path = path;
    }

    if (icon) {
      whereClause.icon = icon;
    }

    if (access) {
      whereClause.access = access;
    }

    if (updatedAt) {
      whereClause.updatedAt = updatedAt;
    }

    if (createdAt) {
      whereClause.createdAt = createdAt;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { path: { contains: search } },
        { icon: { contains: search } },
        { access: { contains: search } },
        { createdAt: { contains: search } },
        { updatedAt: { contains: search } },
      ];
    }

    const sidebarLinks = await prisma.sidebarLinks.findMany({
      where: whereClause,
      include: {
        sidebarLinkRoles: { include: { role: true } },
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
      orderBy: { updatedAt: 'desc' },
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
        updatedByUser: {
          connect: { uuid: user?.userId },
        },
        sidebarLinkRoles: {
          create: access.map((roleId: any) => ({
            roleId,
          })),
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
