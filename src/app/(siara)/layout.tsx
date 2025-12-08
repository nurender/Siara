import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import Script from 'next/script';

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata = {
  title: 'Siara Events | Luxury Event Management',
  description: 'Crafting extraordinary moments and unforgettable celebrations. Premium event management for weddings, corporate galas, and destination events worldwide.',
  keywords: 'luxury events, wedding planner, corporate events, event management, destination weddings',
};

export default function SiaraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${cormorantGaramond.variable} ${dmSans.variable} antialiased bg-white`}>
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-C6XYB6WSXV"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-C6XYB6WSXV');
        `}
      </Script>
      {children}
    </div>
  );
}

