import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET: Retrieve positions
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
      whereClause.OR = [{ name: { contains: search } }];
    }

    const positions = await prisma.positions.findMany({
      where: whereClause,
      include: {
        department: true,
        accountLogs: {
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

    const positionsWithLatestLog = positions.map((position) => {
      const latestLog = position?.accountLogs[0];

      return {
        ...position,
        createdAt: latestLog?.createdAt,
        updatedAt: latestLog?.updatedAt,
        updatedBy: latestLog?.involvedUser?.employee
          ? latestLog?.involvedUser?.employee.firstName +
            ' ' +
            latestLog?.involvedUser?.employee.lastName
          : '--',
      };
    });

    return NextResponse.json(positionsWithLatestLog);
  } catch (error: any) {
    console.error('Fetch position error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch positions' },
      { status: 500 }
    );
  }
}

// POST: Add new position
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
    const { name, departmentId } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Position name is required' },
        { status: 400 }
      );
    }

    if (!departmentId) {
      return NextResponse.json(
        { error: 'Department ID is required' },
        { status: 400 }
      );
    }

    const newPosition = await prisma.positions.create({
      data: {
        name,
        department: {
          connect: { id: departmentId },
        },
      },
    });

    await prisma.accountLogs.create({
      data: {
        activity: `Position "${name}" created`,
        updatedPosition: {
          connect: { id: newPosition.id },
        },
        involvedUser: {
          connect: { uuid: user.userId },
        },
      },
    });

    return NextResponse.json(newPosition, { status: 201 });
  } catch (error: any) {
    console.error('Create position error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create position' },
      { status: 500 }
    );
  }
}
