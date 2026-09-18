import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET: Retrieve brands
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

    const brands = await prisma.brands.findMany({
      where: whereClause,
      include: {
        updatedBy: {
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
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(brands);
  } catch (error: any) {
    console.error('Fetch brand error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch brand' },
      { status: 500 }
    );
  }
}

// POST: Add new brands
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
        { error: 'Brand name is required' },
        { status: 400 }
      );
    }

    const newBrand = await prisma.brands.create({
      data: {
        name,
      },
    });

    return NextResponse.json(newBrand, { status: 201 });
  } catch (error: any) {
    console.error('Create brand error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create brand' },
      { status: 500 }
    );
  }
}
