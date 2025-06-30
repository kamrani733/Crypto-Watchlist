import type { Metadata } from "next";
import TanstackQueryProvider from "@/src/components/tanstack-query-provider";
import "./globals.css";
import { Toaster } from "sonner";
import { Lato } from "next/font/google";
import { ThemeProvider } from "@/src/components/theme";

export const metadata: Metadata = {
  title: "Coala",
  description: "Learn languages",
  icons: { icon: "/favicon.ico" },
};

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={lato.className}>
        <TanstackQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </TanstackQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
