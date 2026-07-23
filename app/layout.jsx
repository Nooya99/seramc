import { Inter, Poppins } from 'next/font/google';
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
      <body className={`${inter.className} bg-[#0b1121] text-gray-100 antialiased overflow-x-hidden`}>
        {/* FIXED BACKGROUND */}
        <div className="fixed top-0 left-0 w-full h-screen -z-10 overflow-hidden bg-[#0b1121]">
          <div 
            className="absolute w-full h-full bg-cover bg-center opacity-70" 
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(11, 17, 33, 0.4), rgba(11, 17, 33, 0.95)), url('/background.png')`
            }}
          />
        </div>

        {/* AMBIENT CRYSTAL GLOWS */}
        <div className="crystal-orb bg-cyan-500/20 w-[400px] h-[400px] top-[-10%] left-[-10%]" />
        <div className="crystal-orb bg-blue-600/15 w-[500px] h-[500px] bottom-[10%] right-[-10%]" style={{ animationDelay: '2s', animationDuration: '8s' }} />
        <div className="crystal-orb bg-purple-500/15 w-[300px] h-[300px] top-[40%] left-[40%]" style={{ animationDelay: '1s', animationDuration: '7s' }} />

        {/* BLINKING CRYSTAL STARS */}
        <div className="sparkle w-3 h-3 top-[15%] left-[25%]" style={{ animationDelay: '0.5s' }} />
        <div className="sparkle w-2 h-2 top-[30%] right-[20%]" style={{ animationDelay: '1.2s', animationDuration: '3s' }} />
        <div className="sparkle w-4 h-4 bottom-[25%] left-[15%]" style={{ animationDelay: '2.5s', animationDuration: '5s' }} />
        <div className="sparkle w-2 h-2 top-[60%] right-[10%]" style={{ animationDelay: '0.8s', animationDuration: '3.5s' }} />
        <div className="sparkle w-3 h-3 bottom-[10%] left-[60%]" style={{ animationDelay: '1.8s', animationDuration: '4.5s' }} />

        {children}
      </body>
    </html>
  );
}
