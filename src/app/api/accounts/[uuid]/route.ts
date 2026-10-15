import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser, hashPassword } from '@/lib/auth';

// GET: Retrieve a single account
export async function GET(
  req: Request,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { uuid } = await params;

    const account = await prisma.accounts.findUnique({
      where: { uuid },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    const { passwordHash, ...accountData } = account;

    return NextResponse.json(accountData);
  } catch (error: any) {
    console.error('Fetch single account error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch account' },
      { status: 500 }
    );
  }
}

// PUT: Update an account
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { uuid } = await params;

    const body = await req.json();
    const { username, password, roleId, employeeId, status } = body;

    if (!username) {
      return NextResponse.json(
        { error: 'Account name is required' },
        { status: 400 }
      );
    }

    const updatedAccount = await prisma.accounts.update({
      where: { uuid },
      data: {
        username,
        ...(password ? { passwordHash: hashPassword(password) } : {}),
        role: {
          connect: { id: roleId },
        },
        employee: {
          connect: { id: employeeId },
        },
        status,
      },
    });

    return NextResponse.json(updatedAccount);
  } catch (error: any) {
    console.error('Update account error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update account' },
      { status: 500 }
    );
  }
}

// DELETE: Delete an account
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { uuid } = await params;
    if (isNaN(uuid)) {
      return NextResponse.json(
        { error: 'Invalid account ID' },
        { status: 400 }
      );
    }

    await prisma.accounts.delete({
      where: { uuid },
    });

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete account' },
      { status: 500 }
    );
  }
}
