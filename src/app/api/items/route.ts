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
      orderBy: { updatedAt: 'desc' },
      include: {
        category: true,
        brand: true,
        location: true,
        office: true,
        supplier: true,
        assignedEmp: true,
        updatedBy: {
          include: {
            employee: { select: { firstName: true, lastName: true } },
          },
        },
        deployedBy: {
          include: {
            employee: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });

    return NextResponse.json(items);
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
      description,
      hostname,
      remarks,
      brandId,
      assignedTo,
      categoryId,
      locationId,
      officeId,
      supplierId,
      deploymentDate,
      status,
      updatedBy,
    } = body;

    // console.log(body);

    if (!name) {
      return NextResponse.json(
        { error: 'Item name is required' },
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
        deploymentDate: new Date(deploymentDate) || null,
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
        assignedEmp: {
          connect: { id: parseInt(assignedTo) },
        },
        updatedBy: {
          connect: { uuid: updatedBy },
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
