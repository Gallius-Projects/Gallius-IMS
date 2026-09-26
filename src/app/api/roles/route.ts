import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET: Retrieve roles
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

    // Build Prisma query filters
    const whereClause: any = {};

    if (name) {
      whereClause.name = name;
    }

    if (search) {
      whereClause.OR = [{ name: { contains: search } }];
    }

    const roles = await prisma.roles.findMany({
      where: whereClause,
    });

    return NextResponse.json(roles);
  } catch (error: any) {
    console.error('Fetch offices error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch offices' },
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
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Role name is required' },
        { status: 400 }
      );
    }

    const newRole = await prisma.roles.create({
      data: {
        name,
        updatedBy: {
          connect: { uuid: user?.userId },
        },
      },
    });

    return NextResponse.json(newRole, { status: 201 });
  } catch (error: any) {
    console.error('Create role error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create role' },
      { status: 500 }
    );
  }
}
