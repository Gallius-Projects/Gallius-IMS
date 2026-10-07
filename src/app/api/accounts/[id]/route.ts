import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser, hashPassword } from '@/lib/auth';

// GET: Retrieve a single account
export async function GET(
  req: Request,
  { params }: { params: Promise<{ accountId: string }> }
) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { accountId } = await params;

    console.log({ accountId });

    const account = await prisma.accounts.findUnique({
      where: { uuid: accountId },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    return NextResponse.json(account);
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
  { params }: { params: Promise<{ accountId: string }> }
) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { accountId } = await params;

    const body = await req.json();
    const { username, password, roleId, employeeId, status } = body;

    if (!username) {
      return NextResponse.json(
        { error: 'Account name is required' },
        { status: 400 }
      );
    }

    const updatedAccount = await prisma.accounts.update({
      where: { id: accountId },
      data: {
        username,
        passwordHash: hashPassword(password),
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
    const accountId = parseInt(id);
    if (isNaN(accountId)) {
      return NextResponse.json(
        { error: 'Invalid account ID' },
        { status: 400 }
      );
    }

    await prisma.accounts.delete({
      where: { id: accountId },
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
