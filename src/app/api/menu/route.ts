import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { INITIAL_MENU_ITEMS } from '@/lib/seed-data';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    let count = await prisma.menuItem.count();
    if (count === 0) {
      await prisma.menuItem.createMany({ data: INITIAL_MENU_ITEMS });
    }
    const items = await prisma.menuItem.findMany({
      orderBy: [{ featured: 'desc' }, { name: 'asc' }],
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(INITIAL_MENU_ITEMS);
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const created = await prisma.menuItem.create({
    data: {
      name: body.name,
      category: body.category,
      ingredients: body.ingredients,
      description: body.description || '',
      featured: Boolean(body.featured),
      inStock: body.inStock !== undefined ? Boolean(body.inStock) : true,
      price: parseFloat(body.price) || 6.5,
      sizes: body.sizes || '24oz, 32oz',
      customizationAddons: body.customizationAddons || '',
      orderableOnline: body.orderableOnline !== undefined ? Boolean(body.orderableOnline) : true,
    },
  });

  revalidatePath('/');
  return NextResponse.json(created, { status: 201 });
}
