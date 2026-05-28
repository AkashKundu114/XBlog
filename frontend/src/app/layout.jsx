import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider, QueryProvider, SessionProvider } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata = {
  title: { default: 'DevBlog', template: '%s | DevBlog' },
  description: 'A premium blog platform for developers and designers.',
  keywords: ['blog', 'technology', 'development', 'design'],
  openGraph: { type: 'website', locale: 'en_US', title: 'DevBlog', description: 'A premium blog platform.' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrains.variable}`}>
      <body>
        <SessionProvider>
          <QueryProvider>
            <ThemeProvider>
              {children}
              <Toaster />
            </ThemeProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
