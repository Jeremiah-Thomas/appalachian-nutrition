import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Appalachian Nutrition | Loaded Teas, Shakes & Dirty Sodas in Elizabethton, TN',
  description: 'Loaded Teas, Specialty Teas, Iced Coffee, Protein Shakes, Dirty Sodas, and Dirty Alanis at 851 W Elk Ave, Elizabethton, TN.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#fdf8ff] dark:bg-[#12071f] text-purple-950 dark:text-slate-100 font-sans antialiased selection:bg-pink-500 selection:text-white transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
