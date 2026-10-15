import { hashPassword, getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET: Retrieve accounts
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

    // Build Prisma query filters
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { username: { contains: search } },
        { role: { role: { contains: search } } },
      ];
    }

    const accounts = await prisma.accounts.findMany({
      where: whereClause,
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            middleName: true,
            employeeId: true,
          },
        },
        role: true,
      },
    });

    // Filter out the passwordHash from the response
    accounts.forEach((account) => {
      delete (account as any).passwordHash;
    });

    return NextResponse.json(accounts);
  } catch (error: any) {
    console.error('Fetch employees error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch employees' },
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
    const { username, password, roleId, status, employeeId } = body;

    if (!username || !password || !roleId || !status || !employeeId) {
      return NextResponse.json(
        { error: 'All account fields are required' },
        { status: 400 }
      );
    }

    const newAccount = await prisma.accounts.create({
      data: {
        username,
        passwordHash: hashPassword(password),
        role: { connect: { id: parseInt(roleId) } },
        status,
        employee: { connect: { id: parseInt(employeeId) } },
      },
    });

    return NextResponse.json(newAccount, { status: 201 });
  } catch (error: any) {
    console.error('Create employee error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create employee' },
      { status: 500 }
    );
  }
}
