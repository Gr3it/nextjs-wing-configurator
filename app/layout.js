import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Icarus | Wing Configurator",
  description:
    "Icarus is a high-performance 3D wing configurator. Design, customize, and build your own custom wing set with professional precision and real-time previews.",
  appleWebApp: {
    title: "Icarus",
    statusBarStyle: "default",
    capable: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ToastContainer position="bottom-right" theme="colored" />
      </body>
    </html>
  );
}
