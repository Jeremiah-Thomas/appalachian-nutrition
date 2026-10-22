import { prisma } from '@/lib/prisma';
import { INITIAL_MENU_ITEMS } from '@/lib/seed-data';
import PublicStorefront from '@/components/PublicStorefront';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let items: any[] = INITIAL_MENU_ITEMS;
  let settings = {
    onlineOrderingEnabled: false,
    phone: '(423) 555-0199',
    address: '851 W Elk Ave, Elizabethton, TN 37643',
    hours: 'Mon–Fri: 6:30 AM – 5:00 PM | Sat: 8:00 AM – 3:00 PM | Sun: Closed',
    announcement: 'Stop by 851 W Elk Ave for your daily Loaded Tea, Protein Shake, or Dirty Alani!',
  };

  try {
    const count = await prisma.menuItem.count();
    if (count === 0) {
      await prisma.menuItem.createMany({ data: INITIAL_MENU_ITEMS });
    }
    const dbItems = await prisma.menuItem.findMany({
      orderBy: [{ featured: 'desc' }, { name: 'asc' }],
    });
    if (dbItems.length > 0) items = dbItems;

    const dbSettings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
    if (dbSettings) settings = dbSettings;
  } catch {
    // Gracefully fallback to initial seed items if DB is not yet migrated
  }

  return <PublicStorefront initialItems={items} settings={settings} />;
}
