import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    let settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
    if (!settings) {
      settings = await prisma.storeSettings.create({ data: { id: 'default' } });
    }
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({
      id: 'default',
      onlineOrderingEnabled: false,
      phone: '(423) 555-0199',
      address: '851 W Elk Ave, Elizabethton, TN 37643',
      hours: 'Mon–Fri: 6:30 AM – 5:00 PM | Sat: 8:00 AM – 3:00 PM | Sun: Closed',
      announcement: 'Stop by 851 W Elk Ave for your daily Loaded Tea, Protein Shake, or Dirty Alani!',
    });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const updated = await prisma.storeSettings.upsert({
    where: { id: 'default' },
    update: {
      onlineOrderingEnabled: Boolean(body.onlineOrderingEnabled),
      phone: body.phone,
      address: body.address,
      hours: body.hours,
      announcement: body.announcement,
    },
    create: {
      id: 'default',
      onlineOrderingEnabled: Boolean(body.onlineOrderingEnabled),
      phone: body.phone || '(423) 555-0199',
      address: body.address || '851 W Elk Ave, Elizabethton, TN 37643',
      hours: body.hours || 'Mon–Fri: 6:30 AM – 5:00 PM | Sat: 8:00 AM – 3:00 PM | Sun: Closed',
      announcement: body.announcement || '',
    },
  });

  revalidatePath('/');
  return NextResponse.json(updated);
}
