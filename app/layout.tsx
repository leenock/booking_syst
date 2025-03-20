import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";

import Footer from "./components/landingpage/Footer";
import ChatWindow from "./components/ui/chat/ChatWindow";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const poppins = Poppins({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: "Vicarage Resorts - Luxury Accommodations",
  description:
    "Experience luxury and comfort at Grand Royal Hotel. Book your stay today.",
  icons: {
    icon: "/booking_logo_icon_169472.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`${inter.className} font-poppins`}
        suppressHydrationWarning
      >
        <div className="flex flex-col min-h-screen bg-gray-900">
          
          <main className="flex-grow">{children}</main>
          <Footer />
          <ChatWindow />
        </div>
      </body>
    </html>
  );
}
