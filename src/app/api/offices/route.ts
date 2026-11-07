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

    // Build Prisma query filters
    const whereClause: {
      name?: string;
      OR?: { name: { contains: string } }[];
    } = {};

    if (name) {
      whereClause.name = name;
    }

    if (search) {
      whereClause.OR = [{ name: { contains: search } }];
    }

    const offices = await prisma.offices.findMany({
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

    const officesWithLatestLog = offices.map((office) => {
      const latestLog = office?.adminLogs[0];

      return {
        ...office,
        updatedAt: latestLog?.updatedAt,
        updatedBy: latestLog?.involvedUser?.employee
          ? latestLog?.involvedUser?.employee.firstName +
            ' ' +
            latestLog?.involvedUser?.employee.lastName
          : '--',
      };
    });

    return NextResponse.json(officesWithLatestLog);
  } catch (error: { message: string } | unknown) {
    console.error('Fetch offices error:', error);
    return NextResponse.json(
      {
        error:
          (error as { message: string }).message || 'Failed to fetch offices',
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
      },
    });

    await prisma.adminLogs.create({
      data: {
        activity: `Office "${name}" created`,
        updatedOffice: {
          connect: { id: newOffice.id },
        },
        involvedUser: {
          connect: { uuid: user.userId },
        },
      },
    });

    return NextResponse.json(newOffice, { status: 201 });
  } catch (error: { message: string } | unknown) {
    console.error('Create office error:', error);
    return NextResponse.json(
      {
        error:
          (error as { message: string }).message || 'Failed to create office',
      },
      { status: 500 }
    );
  }
}
