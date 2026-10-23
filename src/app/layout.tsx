import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'FinTrack', description: 'Keuangan UMKM sederhana' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
