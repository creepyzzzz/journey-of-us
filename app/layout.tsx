import './globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins, Dancing_Script, Kalam, Indie_Flower, Pacifico } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'arial']
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  fallback: ['system-ui', 'arial']
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dancing-script',
  display: 'swap',
});

const kalam = Kalam({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-kalam',
  display: 'swap',
});

const indieFlower = Indie_Flower({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-indie-flower',
  display: 'swap',
});

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-pacifico',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Journey of Us - Romantic Couple Bonding Game',
  description: 'Create beautiful romantic journeys to deepen your connection',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} ${dancingScript.variable} ${kalam.variable} ${indieFlower.variable} ${pacifico.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}