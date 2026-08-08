import { Inter, Poppins } from 'next/font/google';
import ServerStatusWidget from '@/components/ServerStatusWidget';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({ 
  weight: ['600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata = {
  title: 'SERA MC - Official Minecraft Server Landing Page',
  description: 'Selamat datang di SERA MC! Server Survival Multiplayer (SMP) modern dengan ekonomi pasar, sistem ras karakter, dan komunitas solid.',
  icons: {
    icon: '/LOGO.png',
    shortcut: '/LOGO.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`scroll-smooth ${inter.variable} ${poppins.variable}`}>
      <head />
      <body className={`${inter.className} bg-[#0b1121] text-gray-100 antialiased overflow-x-hidden`}>
        <ServerStatusWidget />

        {children}
      </body>
    </html>
  );
}
