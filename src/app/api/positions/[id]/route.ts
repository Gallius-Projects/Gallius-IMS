import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET: Retrieve a single position
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
    const positionId = parseInt(id);
    if (isNaN(positionId)) {
      return NextResponse.json({ error: 'Invalid office ID' }, { status: 400 });
    }

    const position = await prisma.positions.findUnique({
      where: { id: positionId },
      include: {
        department: true,
      },
    });

    if (!position) {
      return NextResponse.json(
        { error: 'Position not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(position);
  } catch (error: { message: string } | unknown) {
    console.error('Fetch single position error:', error);
    return NextResponse.json(
      {
        error:
          (error as { message: string }).message ||
          'Failed to fetch position details',
      },
      { status: 500 }
    );
  }
}

// PUT: Update an position
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
    const positionId = parseInt(id);
    if (isNaN(positionId)) {
      return NextResponse.json(
        { error: 'Invalid position ID' },
        { status: 400 }
      );
    }

    const body = await req.json();

    const normalizedBody = {
      ...body,
      departmentId: Number(body.departmentId),
    };

    if (!normalizedBody?.name) {
      return NextResponse.json(
        { error: 'Position name is required' },
        { status: 400 }
      );
    }

    const position = await prisma.positions.findUnique({
      where: { id: positionId },
    });

    if (!position) {
      return NextResponse.json(
        { error: 'Position not found' },
        { status: 404 }
      );
    }

    const changes = [];

    for (const key of Object.keys(
      normalizedBody
    ) as (keyof typeof position)[]) {
      if (normalizedBody[key] !== position[key]) {
        changes.push({
          field: key,
          oldValue: position[key],
          newValue: normalizedBody[key],
        });
      }
    }

    if (changes.length === 0) {
      return NextResponse.json(position);
    }

    const updatedPosition = await prisma.positions.update({
      where: { id: positionId },
      data: {
        name: normalizedBody.name,
        department: {
          connect: {
            id: normalizedBody.departmentId,
          },
        },
      },
    });

    const activity = changes
      .map(
        ({ field, oldValue, newValue }) =>
          `${field} changed from "${oldValue}" to "${newValue}"`
      )
      .join(', ');

    await prisma.accountLogs.create({
      data: {
        activity,
        updatedPosition: {
          connect: { id: positionId },
        },
        involvedUser: {
          connect: { uuid: user.userId },
        },
      },
    });

    return NextResponse.json({ updatedPosition, changes });
  } catch (error: { message: string } | unknown) {
    console.error('Update position error:', error);
    return NextResponse.json(
      {
        error:
          (error as { message: string }).message || 'Failed to update position',
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete an position
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
    const positionId = parseInt(id);
    if (isNaN(positionId)) {
      return NextResponse.json(
        { error: 'Invalid position ID' },
        { status: 400 }
      );
    }

    await prisma.positions.delete({
      where: { id: positionId },
    });

    return NextResponse.json({
      success: true,
      message: 'Position deleted successfully',
    });
  } catch (error: { message: string } | unknown) {
    console.error('Delete position error:', error);
    return NextResponse.json(
      {
        error:
          (error as { message: string }).message || 'Failed to delete position',
      },
      { status: 500 }
    );
  }
}
