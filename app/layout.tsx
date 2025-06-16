import type React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundaryWrapper } from '@/components/error-boundary-wrapper';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Concursos Study App',
  description: 'Plataforma de estudos para concursos públicos',
  generator: 'v0.dev',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundaryWrapper>{children}</ErrorBoundaryWrapper>
        <Toaster />
      </body>
    </html>
  );
}
