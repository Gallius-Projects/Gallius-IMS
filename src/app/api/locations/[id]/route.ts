import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET: Retrieve a single location
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const locationId = parseInt(id);
    if (isNaN(locationId)) {
      return NextResponse.json(
        { error: 'Invalid location ID' },
        { status: 400 }
      );
    }

    const item = await prisma.locations.findUnique({
      where: { id: locationId },
    });

    if (!item) {
      return NextResponse.json(
        { error: 'location not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error: any) {
    console.error('Fetch single location error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch location details' },
      { status: 500 }
    );
  }
}

// PUT: Update an location
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const itemId = parseInt(id);
    if (isNaN(itemId)) {
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 });
    }

    const body = await req.json();
    const { name, abbreviation } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'location name is required' },
        { status: 400 }
      );
    }

    const updatedItem = await prisma.locations.update({
      where: { id: itemId },
      data: {
        name,
        abbreviation: abbreviation || '',
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error: any) {
    console.error('Update location error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update location' },
      { status: 500 }
    );
  }
}

// DELETE: Delete an location
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const locationId = parseInt(id);
    if (isNaN(locationId)) {
      return NextResponse.json(
        { error: 'Invalid location ID' },
        { status: 400 }
      );
    }

    await prisma.locations.delete({
      where: { id: locationId },
    });

    return NextResponse.json({
      success: true,
      message: 'location deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete location error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete location' },
      { status: 500 }
    );
  }
}
