import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET: Retrieve inventory items
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
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';

    // Build Prisma query filters
    const whereClause: any = {};

    if (category) {
      whereClause.categoryId = parseInt(category);
    }

    if (status) {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { serialNumber: { contains: search } },
        { hostname: { contains: search } },
        { description: { contains: search } },
        { remarks: { contains: search } },
      ];
    }

    const items = await prisma.inventoryItems.findMany({
      where: whereClause,
      // orderBy: { inventoryLogs: { updatedAt: 'desc' } },
      include: {
        category: true,
        brand: true,
        location: true,
        office: true,
        supplier: true,
        assignedEmp: true,
        inventoryLogs: {
          include: {
            involvedUser: {
              include: {
                employee: { select: { firstName: true, lastName: true } },
              },
            },
          },
          orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
          take: 1,
        },
        deployedBy: { select: { firstName: true, lastName: true } },
      },
    });

    const itemsWithLatestLog = items.map((item) => {
      const latestLog = item?.inventoryLogs[0];

      return {
        ...item,
        createdAt: latestLog?.createdAt,
        updatedAt: latestLog?.updatedAt,
        updatedBy: latestLog?.involvedUser?.employee
          ? latestLog?.involvedUser?.employee.firstName +
            ' ' +
            latestLog?.involvedUser?.employee.lastName
          : '--',
      };
    });

    return NextResponse.json(itemsWithLatestLog);
  } catch (error: any) {
    console.error('Fetch items error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch inventory items' },
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
    const {
      name,
      oldAssetTag,
      newAssetTag,
      serialNumber,
      hostname,
      status,
      categoryId,
      brandId,
      locationId,
      officeId,
      supplierId,
      deployedBy,
      datePurchased,
      dateDeployed,
      invoiceNo,
      assetCondition,
      isNew,
      assignedTo,
      description,
      remarks,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Item name is required' },
        { status: 400 }
      );
    }

    const duplicateHostname = await prisma.inventoryItems.findFirst({
      where: { hostname: hostname || '' },
    });

    if (duplicateHostname) {
      return NextResponse.json(
        { error: 'Hostname already exists' },
        { status: 400 }
      );
    }

    const newItem = await prisma.inventoryItems.create({
      data: {
        name,
        oldAssetTag: oldAssetTag || '',
        newAssetTag: newAssetTag || '',
        serialNumber: serialNumber || '',
        description: description || '',
        hostname: hostname || '',
        remarks: remarks || '',
        status: status || 'SPARE',
        datePurchased: datePurchased || null,
        dateDeployed: dateDeployed || null,
        invoiceNo: invoiceNo || '',
        assetCondition: assetCondition || '',
        isNew: isNew || true,
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
        ...(assignedTo
          ? { assignedEmp: { connect: { id: parseInt(assignedTo) } } }
          : {}),
        ...(deployedBy
          ? { deployedBy: { connect: { id: parseInt(deployedBy) } } }
          : {}),
      },
    });

    await prisma.inventoryLogs.create({
      data: {
        activity: `Item ${name} created`,
        updatedItem: { connect: { id: newItem?.id } },
        involvedUser: {
          connect: { uuid: user.userId },
        },
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    console.error('Create item error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create inventory item' },
      { status: 500 }
    );
  }
}
