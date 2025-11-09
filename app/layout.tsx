import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { LocaleProvider } from "./contexts/LocaleProvider";
import AppLayout from "./components/AppLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zeta's Secret Base",
  description: "Welcome to Zeta's Secret Base.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ minHeight: '100vh', minWidth: '100%' }}>
        <ThemeProvider>
          <LocaleProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
