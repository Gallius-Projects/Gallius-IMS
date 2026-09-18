import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET: Retrieve a single supplier
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
    const itemId = parseInt(id);
    if (isNaN(itemId)) {
      return NextResponse.json(
        { error: 'Invalid supplier ID' },
        { status: 400 }
      );
    }

    const supplier = await prisma.suppliers.findUnique({
      where: { id: itemId },
      include: {
        updatedBy: {
          select: {
            employee: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!supplier) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(supplier);
  } catch (error: any) {
    console.error('Fetch single supplier error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch supplier details' },
      { status: 500 }
    );
  }
}

// PUT: Update a supplier
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
      return NextResponse.json(
        { error: 'Invalid supplier ID' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, contactPerson, contactNumber, email, address, updatedBy } =
      body;

    if (!name) {
      return NextResponse.json(
        { error: 'Supplier name is required' },
        { status: 400 }
      );
    }

    const updatedSupplier = await prisma.suppliers.update({
      where: { id: itemId },
      data: {
        name,
        contactPerson,
        contactNumber,
        email,
        address,
        updatedBy: {
          connect: {
            uuid: updatedBy,
          },
        },
      },
    });

    return NextResponse.json(updatedSupplier);
  } catch (error: any) {
    console.error('Update supplier error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update supplier' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a supplier
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
    const supplierId = parseInt(id);
    if (isNaN(supplierId)) {
      return NextResponse.json(
        { error: 'Invalid supplier ID' },
        { status: 400 }
      );
    }

    await prisma.suppliers.delete({
      where: { id: supplierId },
    });

    return NextResponse.json({
      success: true,
      message: 'Supplier deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete supplier error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete supplier' },
      { status: 500 }
    );
  }
}
