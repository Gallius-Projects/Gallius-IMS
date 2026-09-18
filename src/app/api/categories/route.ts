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
    const quantity = searchParams.get('quantity') || '';

    // Build Prisma query filters
    const whereClause: any = {};

    if (name) {
      whereClause.name = name;
    }

    if (quantity) {
      whereClause.quantity = parseInt(quantity);
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { quantity: { contains: search } },
      ];
    }

    const categories = await prisma.categories.findMany({
      where: whereClause,
      include: {
        updatedBy: {
          select: {
            employee: {
              select: { firstName: true, lastName: true },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('Fetch categories error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch categories' },
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
    const { name, quantity } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const newCategory = await prisma.categories.create({
      data: {
        name,
        quantity: parseInt(quantity),
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}
