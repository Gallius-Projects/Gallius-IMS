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
    const name = searchParams.get('name') || '';
    const abbreviation = searchParams.get('abbreviation') || '';

    // Build Prisma query filters
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { abbreviation: { contains: search } },
      ];
    }
    if (name) {
      whereClause.name = name;
    }
    if (abbreviation) {
      whereClause.abbreviation = abbreviation;
    }

    const locations = await prisma.locations.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(locations);
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

    return NextResponse.json(newLocation, { status: 201 });
  } catch (error: any) {
    console.error('Create location error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create location' },
      { status: 500 }
    );
  }
}
