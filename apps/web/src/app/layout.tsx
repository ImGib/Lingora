import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import './globals.css';
import { InteractiveBackground } from '@/components/common/interactive-background';

export const metadata: Metadata = {
  title: 'Lingora — Soft Study Companion',
  description: 'A calm English learning companion for a steady journey from foundations toward IELTS Academic and study-abroad readiness.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className="relative min-h-screen">
        <ClerkProvider>
          <InteractiveBackground />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
