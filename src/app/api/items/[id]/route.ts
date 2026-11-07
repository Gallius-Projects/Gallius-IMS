import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET: Retrieve a single inventory item
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
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 });
    }

    const item = await prisma.inventoryItems.findUnique({
      where: { id: itemId },
      include: {
        brand: true,
        category: true,
        location: true,
        office: true,
        supplier: true,
        assignedEmp: {
          include: {
            department: true,
          },
        },
        inventoryLogs: {
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
        deployedBy: { select: { firstName: true, lastName: true } },
      },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error: any) {
    console.error('Fetch single item error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch item details' },
      { status: 500 }
    );
  }
}

// PUT: Update an inventory item
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

    const {
      name,
      oldAssetTag,
      newAssetTag,
      serialNumber,
      hostname,
      isNew,
      status,
      categoryId,
      brandId,
      locationId,
      officeId,
      supplierId,
      deployedById,
      assignedTo,
      description,
      remarks,
    } = body;

    const normalizedBody = {
      ...body,
      brandId: Number(body.brandId),
      assignedTo: Number(body.assignedTo),
      categoryId: Number(body.categoryId),
      locationId: Number(body.locationId),
      officeId: Number(body.officeId),
      supplierId: Number(body.supplierId),
      deployedBy: Number(body.deployedBy),
    };

    if (!name) {
      return NextResponse.json(
        { error: 'Item name is required' },
        { status: 400 }
      );
    }

    const item = await prisma.inventoryItems.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const changes = [];

    for (const key of Object.keys(normalizedBody)) {
      if (normalizedBody[key] !== item[key]) {
        changes.push({
          field: key,
          oldValue: item[key],
          newValue: normalizedBody[key],
        });
      }
    }

    if (changes.length === 0) {
      return NextResponse.json(item);
    }

    const updatedItem = await prisma.inventoryItems.update({
      where: { id: itemId },
      data: {
        name,
        oldAssetTag: oldAssetTag || '',
        newAssetTag: newAssetTag || '',
        serialNumber: serialNumber || '',
        description: description || '',
        hostname: hostname || '',
        remarks: remarks || '',
        status: status || 'SPARE',
        isNew: isNew ? isNew : false,
        brand: {
          connect: { id: parseInt(brandId) },
        },
        category: {
          connect: { id: parseInt(categoryId) },
        },
        location: {
          connect: { id: parseInt(locationId) },
        },
        office: {
          connect: { id: parseInt(officeId) },
        },
        supplier: {
          connect: { id: parseInt(supplierId) },
        },
        assignedEmp: assignedTo
          ? { connect: { id: parseInt(assignedTo) } }
          : { disconnect: true },
        deployedBy: deployedById
          ? { connect: { id: parseInt(deployedById) } }
          : { disconnect: true },
        // ...(assignedTo
        //   ? { assignedEmp: { connect: { id: parseInt(assignedTo) } } }
        //   : { assignedEmp: null }),
        // ...(deployedBy
        //   ? { deployedBy: { connect: { id: parseInt(deployedBy) } } }
        //   : { deployedBy: null }),
        // brandId: parseInt(brandId),
        // categoryId: parseInt(categoryId),
        // locationId: parseInt(locationId),
        // officeId: parseInt(officeId),
        // supplierId: parseInt(supplierId),
        // assignedTo: parseInt(assignedTo) || null,
        // deployedBy: parseInt(deployedBy) || null,
      },
    });

    const activity = changes
      .map(
        ({ field, oldValue, newValue }) =>
          `${field} changed from "${oldValue}" to "${newValue}"`
      )
      .join(', ');

    await prisma.inventoryLogs.create({
      data: {
        activity,
        updatedItem: {
          connect: { id: itemId },
        },
        involvedUser: {
          connect: { uuid: user.userId },
        },
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error: any) {
    console.error('Update item error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update inventory item' },
      { status: 500 }
    );
  }
}

// DELETE: Delete an inventory item
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
    const itemId = parseInt(id);
    if (isNaN(itemId)) {
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 });
    }

    await prisma.inventoryItems.delete({
      where: { id: itemId },
    });

    return NextResponse.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete item error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete inventory item' },
      { status: 500 }
    );
  }
}
