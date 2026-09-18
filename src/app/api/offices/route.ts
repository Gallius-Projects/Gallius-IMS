import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET: Retrieve offices
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
    const createdAt = searchParams.get('createdAt') || '';
    const updatedAt = searchParams.get('updatedAt') || '';

    // Build Prisma query filters
    const whereClause: any = {};

    if (name) {
      whereClause.name = name;
    }

    if (createdAt) {
      whereClause.createdAt = createdAt;
    }

    if (updatedAt) {
      whereClause.updatedAt = updatedAt;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        {
          updatedBy: {
            employee: {
              OR: [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
              ],
            },
          },
        },
        { createdAt: { contains: search } },
        { updatedAt: { contains: search } },
      ];
    }

    const offices = await prisma.offices.findMany({
      where: whereClause,
      include: {
        updatedBy: {
          select: { employee: { select: { firstName: true, lastName: true } } },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(offices);
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
        { error: 'Office name is required' },
        { status: 400 }
      );
    }

    const newOffice = await prisma.offices.create({
      data: {
        name,
        updatedBy: {
          connect: { uuid: user?.userId },
        },
      },
    });

    return NextResponse.json(newOffice, { status: 201 });
  } catch (error: any) {
    console.error('Create office error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create office' },
      { status: 500 }
    );
  }
}
