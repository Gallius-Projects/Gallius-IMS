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

    // Build Prisma query filters
    const whereClause: {
      name?: string;
      OR?: (
        | {
            name: { contains: string };
          }
        | {
            abbreviation: { contains: string };
          }
      )[];
    } = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { abbreviation: { contains: search } },
      ];
    }

    const categories = await prisma.categories.findMany({
      where: whereClause,
      include: {
        adminLogs: {
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

    const categoriesWithLatestLog = categories.map((category) => {
      const latestLog = category?.adminLogs[0];

      return {
        ...category,
        updatedAt: latestLog?.updatedAt,
        updatedBy: latestLog?.involvedUser?.employee
          ? latestLog?.involvedUser?.employee?.firstName +
            ' ' +
            latestLog?.involvedUser?.employee?.lastName
          : '--',
      };
    });

    return NextResponse.json(categoriesWithLatestLog);
  } catch (error: { message: string } | unknown) {
    console.error('Fetch categories error:', error);
    return NextResponse.json(
      {
        error:
          (error as { message: string }).message ||
          'Failed to fetch categories',
      },
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

    await prisma.adminLogs.create({
      data: {
        activity: `Category ${name} created`,
        updatedCategory: {
          connect: { id: newCategory.id },
        },
        involvedUser: {
          connect: { uuid: user.userId },
        },
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: { message: string } | unknown) {
    console.error('Create category error:', error);
    return NextResponse.json(
      {
        error:
          (error as { message: string }).message || 'Failed to create category',
      },
      { status: 500 }
    );
  }
}
