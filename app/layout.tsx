import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zeta's Secret Base",
  description: "Welcome to Zeta's Secret Base.",
  icons: {
    icon: [{ url: '/favicon.ico' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
