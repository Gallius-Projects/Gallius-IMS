import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET: Retrieve a single brand
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
    const brandId = parseInt(id);
    if (isNaN(brandId)) {
      return NextResponse.json({ error: 'Invalid brand ID' }, { status: 400 });
    }

    const brand = await prisma.brands.findUnique({
      where: { id: brandId },
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

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    return NextResponse.json(brand);
  } catch (error: any) {
    console.error('Fetch single brand error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch brand' },
      { status: 500 }
    );
  }
}

// PUT: Update a department
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
    const brandId = parseInt(id);
    if (isNaN(brandId)) {
      return NextResponse.json({ error: 'Invalid brand ID' }, { status: 400 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Brand name is required' },
        { status: 400 }
      );
    }

    const brand = await prisma.brands.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const changes = [];

    if (name !== brand.name) {
      changes.push({
        field: 'name',
        oldValue: brand.name,
        newValue: name,
      });
    }

    if (changes.length === 0) {
      return NextResponse.json({
        message: 'No changes to update',
        changes,
      });
    }

    const updatedBrand = await prisma.brands.update({
      where: { id: brandId },
      data: {
        name,
      },
    });

    await prisma.adminLogs.create({
      data: {
        activity: `Brand ${brand.name} updated to ${name}`,
        updatedBrand: {
          connect: { id: updatedBrand.id },
        },
        involvedUser: {
          connect: { uuid: user.userId },
        },
      },
    });

    return NextResponse.json({ updatedBrand, changes });
  } catch (error: any) {
    console.error('Update brand error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update brand' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a brand
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
    const brandId = parseInt(id);
    if (isNaN(brandId)) {
      return NextResponse.json({ error: 'Invalid brand ID' }, { status: 400 });
    }

    await prisma.brands.delete({
      where: { id: brandId },
    });

    return NextResponse.json({
      success: true,
      message: 'Brand deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete brand error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete brand' },
      { status: 500 }
    );
  }
}
