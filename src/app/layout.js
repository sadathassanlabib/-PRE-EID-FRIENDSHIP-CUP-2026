import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navber";
import Footer from "./components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Football Cup - Ultimate Tournament Hub",
  description: "Follow the biggest football tournament with live scores, team standings, player stats, and match schedules.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="container mx-auto max-w-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
