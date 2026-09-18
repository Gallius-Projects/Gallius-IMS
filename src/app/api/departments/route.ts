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
    const name = searchParams.get('name') || '';

    // Build Prisma query filters
    const whereClause: any = {};

    if (name) {
      whereClause.name = name;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { quantity: { contains: search } },
      ];
    }

    const departments = await prisma.departments.findMany({
      where: whereClause,
      include: {
        updatedBy: {
          select: { employee: { select: { firstName: true, lastName: true } } },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(departments);
  } catch (error: any) {
    console.error('Fetch departments error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch departments' },
      { status: 500 }
    );
  }
}

// POST: Add new department
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
    const { name, updatedBy } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Department name is required' },
        { status: 400 }
      );
    }

    const newDepartment = await prisma.departments.create({
      data: {
        name,
        updatedByUUID: updatedBy,
      },
    });

    return NextResponse.json(newDepartment, { status: 201 });
  } catch (error: any) {
    console.error('Create department error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create department' },
      { status: 500 }
    );
  }
}
