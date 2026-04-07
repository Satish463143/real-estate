import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/components/common/ReduxProvider/ReduxProvider";
import LayoutWrapper from "@/components/common/LayoutWrapper/LayoutWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReduxProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
