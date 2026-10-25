import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET: Retrieve locations
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
        { abbreviation: { contains: search } },
      ];
    }

    const locations = await prisma.locations.findMany({
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
          orderBy: { updatedAt: 'desc' },
          take: 1,
        },
      },
    });

    const locationsWithLatestLog = locations.map((location) => {
      const latestLog = location?.adminLogs[0];

      return {
        ...location,
        updatedAt: latestLog?.updatedAt,
        updatedBy: latestLog?.involvedUser?.employee
          ? latestLog?.involvedUser?.employee.firstName +
            ' ' +
            latestLog?.involvedUser?.employee.lastName
          : '--',
      };
    });

    return NextResponse.json(locationsWithLatestLog);
  } catch (error: any) {
    console.error('Fetch locations error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}

// POST: Add new location
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
    const { name, abbreviation } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Location name is required' },
        { status: 400 }
      );
    }

    const newLocation = await prisma.locations.create({
      data: {
        name,
        abbreviation,
      },
    });

    await prisma.adminLogs.create({
      data: {
        activity: `Location "${name}" created`,
        updatedLocation: {
          connect: { id: newLocation.id },
        },
        involvedUser: {
          connect: { uuid: user.userId },
        },
      },
    });

    return NextResponse.json(newLocation, { status: 201 });
  } catch (error: any) {
    console.error('Create location error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create location' },
      { status: 500 }
    );
  }
}
