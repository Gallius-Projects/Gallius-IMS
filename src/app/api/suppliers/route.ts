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
    const name = searchParams.get('name') || '';
    const email = searchParams.get('email') || '';
    const address = searchParams.get('address') || '';
    const contactPerson = searchParams.get('contactPerson') || '';
    const contactNumber = searchParams.get('contactNumber') || '';
    const createdAt = searchParams.get('createdAt') || '';
    const updatedAt = searchParams.get('updatedAt') || '';

    // Build Prisma query filters
    const whereClause: any = {};

    if (name) {
      whereClause.name = name;
    }

    if (email) {
      whereClause.email = email;
    }

    if (address) {
      whereClause.address = address;
    }

    if (contactPerson) {
      whereClause.contactPerson = contactPerson;
    }

    if (contactNumber) {
      whereClause.contactNumber = contactNumber;
    }

    if (createdAt) {
      whereClause.createdAt = createdAt;
    }

    if (updatedAt) {
      whereClause.updatedAt = updatedAt;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { address: { contains: search } },
        { contactPerson: { contains: search } },
        { contactNumber: { contains: search } },
        { createdAt: { contains: search } },
        { updatedAt: { contains: search } },
      ];
    }

    const suppliers = await prisma.suppliers.findMany({
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
          orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
          take: 1,
        },
      },
    });

    return NextResponse.json(suppliers);
  } catch (error: any) {
    console.error('Fetch suppliers error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch suppliers' },
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
    const { name, email, address, contactPerson, contactNumber } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Supplier name is required' },
        { status: 400 }
      );
    }

    const newSupplier = await prisma.suppliers.create({
      data: {
        name,
        email,
        address,
        contactPerson,
        contactNumber,
      },
    });

    await prisma.adminLogs.create({
      data: {
        activity: `Supplier "${name}" created`,
        updatedSupplier: {
          connect: { id: newSupplier.id },
        },
        involvedUser: {
          connect: { uuid: user.userId },
        },
      },
    });

    return NextResponse.json(newSupplier, { status: 201 });
  } catch (error: any) {
    console.error('Create supplier error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create supplier' },
      { status: 500 }
    );
  }
}
