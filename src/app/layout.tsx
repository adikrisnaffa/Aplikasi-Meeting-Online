import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'MeetUpGo',
  description: 'Online meeting application with screen sharing, recording, and real-time communication.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
       <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <div className="absolute top-4 right-4 z-50">
              <ThemeToggle />
            </div>
            <main className="flex-1">{children}</main>
            <footer className="py-4 text-center text-sm text-muted-foreground">
              (C) Tukang Ngetest {currentYear}
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
        </body>
    </html>
  );
}
