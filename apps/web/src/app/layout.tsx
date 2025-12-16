import { Suspense } from 'react';
import './global.css';
import { Crimson_Text, Playfair_Display } from 'next/font/google';
import Providers from './providers';

export const metadata = {
  title: 'Yellow pages',
  description: 'Find the best businesses in your area',
};

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const crimsonText = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-crimson',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`font-serif ${playfairDisplay.variable} ${crimsonText.variable}`}
      >
        <Providers>
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(139,69,19,0.08) 1px, transparent 0),
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(160,82,45,0.02) 2px, rgba(160,82,45,0.02) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(160,82,45,0.02) 2px, rgba(160,82,45,0.02) 4px)
          `,
              backgroundSize: '8px 8px, 32px 32px, 32px 32px',
            }}
          />
          <Suspense>{children}</Suspense>
          <footer className="bg-gradient-to-r from-[#8b4513] to-[#a0522d] text-[#faf9f6] border-t-4 border-[#d4af37] shadow-2xl mt-12">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse"></div>
                    <div
                      className="w-3 h-3 border border-[#d4af37] rounded-full animate-spin"
                      style={{ animationDuration: '8s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse"
                      style={{ animationDelay: '1s' }}
                    ></div>
                  </div>
                </div>

                <h3 className="vintage-heading text-xl mb-2 mt-4">
                  Business Directory
                </h3>
                <p className="vintage-body text-sm opacity-90">
                  Connecting communities since 1955 • Your trusted local
                  business guide
                </p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
