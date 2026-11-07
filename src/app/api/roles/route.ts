import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET: Retrieve roles
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

    const whereClause: {
      role?: string;
      OR?: { role: { contains: string } }[];
    } = {};

    if (search) {
      whereClause.OR = [{ role: { contains: search } }];
    }

    const roles = await prisma.roles.findMany({
      where: whereClause,
      include: {
        accounts: {
          include: {
            employee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        accountLogs: {
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

    return NextResponse.json(roles);
  } catch (error: { message: string } | unknown) {
    console.error('Fetch offices error:', error);
    return NextResponse.json(
      {
        error:
          (error as { message: string }).message || 'Failed to fetch offices',
      },
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
      role,
      allowGradingSystem,
      allowInventorySystemAccess,
      allowInventorySystemAdd,
      allowInventorySystemEdit,
      allowInventorySystemDelete,
      allowInventorySystemVoid,
      allowInventorySystemViewAuditTrail,
      allowRequestForPurchaseAccess,
      allowRequestForPurchaseAdd,
      allowRequestForPurchaseEdit,
      allowRequestForPurchaseCancel,
      allowRequestForPurchasePost,
      allowRequestForPurchaseSendEmail,
      allowFixedAssetAccess,
      allowFixedAssetAdd,
      allowFixedAssetEdit,
      allowFixedAssetCancel,
      allowFixedAssetPost,
      allowFixedAssetSendEmail,
      allowUMAccess,
      allowUMAdd,
      allowUMEdit,
      allowLibrariesAccess,
      allowLibrariesAdd,
      allowLibrariesEdit,
      allowLibrariesDelete,
    } = body;

    if (!role) {
      return NextResponse.json(
        { error: 'Role name is required' },
        { status: 400 }
      );
    }

    const newRole = await prisma.roles.create({
      data: {
        role,
        allowGradingSystem,
        allowInventorySystemAccess,
        allowInventorySystemAdd,
        allowInventorySystemEdit,
        allowInventorySystemDelete,
        allowInventorySystemVoid,
        allowInventorySystemViewAuditTrail,
        allowRequestForPurchaseAccess,
        allowRequestForPurchaseAdd,
        allowRequestForPurchaseEdit,
        allowRequestForPurchaseCancel,
        allowRequestForPurchasePost,
        allowRequestForPurchaseSendEmail,
        allowFixedAssetAccess,
        allowFixedAssetAdd,
        allowFixedAssetEdit,
        allowFixedAssetCancel,
        allowFixedAssetPost,
        allowFixedAssetSendEmail,
        allowUMAccess,
        allowUMAdd,
        allowUMEdit,
        allowLibrariesAccess,
        allowLibrariesAdd,
        allowLibrariesEdit,
        allowLibrariesDelete,
      },
    });

    await prisma.accountLogs.create({
      data: {
        activity: `Role "${role}" created`,
        updatedRole: {
          connect: { id: newRole.id },
        },
        involvedUser: {
          connect: { uuid: user.userId },
        },
      },
    });

    return NextResponse.json(newRole, { status: 201 });
  } catch (error: { message: string } | unknown) {
    console.error('Create role error:', error);
    return NextResponse.json(
      {
        error:
          (error as { message: string }).message || 'Failed to create role',
      },
      { status: 500 }
    );
  }
}
