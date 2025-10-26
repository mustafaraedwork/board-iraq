// src/app/layout.tsx - محدث مع Facebook Pixel + خط Cairo العربي
import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import FacebookPixelProvider from "@/components/FacebookPixelProvider";

// خط Cairo العربي الاحترافي
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Board Iraq - البطاقات الذكية",
  description: "منصة البطاقات الذكية الرائدة في العراق - انشئ بطاقتك الذكية واعرض معلوماتك بطريقة احترافية",
  keywords: "بطاقات ذكية, NFC, العراق, بطاقة رقمية, معلومات شخصية",
  authors: [{ name: "Board Iraq" }],
  openGraph: {
    title: "Board Iraq - البطاقات الذكية",
    description: "منصة البطاقات الذكية الرائدة في العراق",
    url: "https://boardiraq.vercel.app",
    siteName: "Board Iraq",
    locale: "ar_IQ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Board Iraq - البطاقات الذكية",
    description: "منصة البطاقات الذكية الرائدة في العراق",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Facebook Pixel Base Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
            `,
          }}
        />
        
        {/* متغيرات البيئة للـ Client */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.NEXT_PUBLIC_FACEBOOK_PIXEL_ID = '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '724361316370707'}';
            `,
          }}
        />
      </head>
      <body
        className={`${cairo.variable} antialiased`}
        style={{ fontFamily: 'var(--font-cairo), system-ui, -apple-system, sans-serif' }}
      >
        <FacebookPixelProvider>
          {children}
        </FacebookPixelProvider>
        
        {/* Facebook Pixel نسخة احتياطية */}
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '724361316370707'}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}