import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET: Retrieve a single office
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
    const officeId = parseInt(id);
    if (isNaN(officeId)) {
      return NextResponse.json({ error: 'Invalid office ID' }, { status: 400 });
    }

    const item = await prisma.offices.findUnique({
      where: { id: officeId },
    });

    if (!item) {
      return NextResponse.json({ error: 'office not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error: any) {
    console.error('Fetch single office error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch office details' },
      { status: 500 }
    );
  }
}

// PUT: Update an office
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
    const officeId = parseInt(id);
    if (isNaN(officeId)) {
      return NextResponse.json({ error: 'Invalid office ID' }, { status: 400 });
    }

    const body = await req.json();
    const { name, abbreviation, updatedBy } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'office name is required' },
        { status: 400 }
      );
    }

    const updatedItem = await prisma.offices.update({
      where: { id: officeId },
      data: {
        name,
        abbreviation: abbreviation || '',
        updatedByUUID: updatedBy,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error: any) {
    console.error('Update office error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update office' },
      { status: 500 }
    );
  }
}

// DELETE: Delete an office
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
    const officeId = parseInt(id);
    if (isNaN(officeId)) {
      return NextResponse.json({ error: 'Invalid office ID' }, { status: 400 });
    }

    await prisma.offices.delete({
      where: { id: officeId },
    });

    return NextResponse.json({
      success: true,
      message: 'office deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete office error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete office' },
      { status: 500 }
    );
  }
}
