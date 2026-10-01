import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

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
    const officeId = searchParams.get('officeId') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const locationId = searchParams.get('locationId') || '';

    if (!officeId || !categoryId || !locationId) {
      return NextResponse.json(
        { error: 'Invalid office, category, or location id' },
        { status: 400 }
      );
    }

    const lastRelatedItem = await prisma.inventoryItems.findFirst({
      where: {
        categoryId: parseInt(categoryId),
        officeId: parseInt(officeId),
        locationId: parseInt(locationId),
      },
      orderBy: { updatedAt: 'desc' },
    });

    const office = await prisma.offices.findUnique({
      where: { id: parseInt(officeId) },
    });

    const category = await prisma.categories.findUnique({
      where: { id: parseInt(categoryId) },
    });

    const location = await prisma.locations.findUnique({
      where: { id: parseInt(locationId) },
    });

    const slicedYear = new Date().getFullYear().toString().slice(-2);
    const officeCode = office?.abbreviation || '--';
    const locationCode = location?.abbreviation || '--';
    const categoryCode = category?.abbreviation || '--';

    let nextItemNumber = '0001';

    if (lastRelatedItem) {
      const lastAssetTag = lastRelatedItem?.newAssetTag || '0000';

      const lastFour = lastAssetTag.slice(-4);

      const nextNum = parseInt(lastFour) + 1;
      nextItemNumber = String(nextNum).padStart(4, '0');
    }

    let generatedAssetTag;
    if (location?.name === 'PEZA') {
      generatedAssetTag = `${officeCode}-OA-${locationCode}${slicedYear}-${categoryCode}${nextItemNumber}`;
    } else {
      generatedAssetTag = `${officeCode}-${locationCode}${slicedYear}-${categoryCode}${nextItemNumber}`;
    }

    return NextResponse.json(generatedAssetTag);
  } catch (error: any) {
    console.error('Error generating Asset Tag:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate asset tag' },
      { status: 500 }
    );
  }
}
