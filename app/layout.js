import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata = {
  title: "ICARUS | Cosplay Wing Configurator",
  description:
    "ICARUS is a professional 3D wing configurator for cosplayers. Create custom wing skeleton presets, pose your builds, and prepare your wing building kit for 3D printing.",
  appleWebApp: {
    title: "Icarus",
    statusBarStyle: "default",
    capable: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PQ2JLKHD00"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-PQ2JLKHD00');
          `}
        </Script>
        <meta
          name="google-site-verification"
          content="i1CkgyIggwuJctqNUkEBghEpkKwMqCHsXg1p92O5-v4"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ToastContainer position="bottom-right" theme="colored" />
      </body>
    </html>
  );
}
