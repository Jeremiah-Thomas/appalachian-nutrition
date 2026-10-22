import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { INITIAL_MENU_ITEMS } from '@/lib/seed-data';
import AdminDashboardClient from '@/components/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/admin');
  }

  let count = await prisma.menuItem.count();
  if (count === 0) {
    await prisma.menuItem.createMany({ data: INITIAL_MENU_ITEMS });
  }

  const items = await prisma.menuItem.findMany({
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  });

  let settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
  if (!settings) {
    settings = await prisma.storeSettings.create({ data: { id: 'default' } });
  }

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <AdminDashboardClient
      initialItems={items}
      initialSettings={settings}
      initialUsers={users}
      currentUser={session.user}
    />
  );
}
