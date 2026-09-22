import type { Metadata } from "next";
import { Domine, Dynalight } from "next/font/google";
import "./globals.css";
import { Providers } from "./components/Providers";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getHeaderData, getSiteSettings, getSocialLinks } from "./sanity.io";

// Configure Domine (Supports multiple weights)
const domine = Domine({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-domine",
  display: "swap",
});

// Configure Dynalight (Only comes in weight 400)
const dynalight = Dynalight({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dynalight",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ibtihel Ben Salah | Frontend Developer & React Developer in Tunisia",
  description:
    "Ibtihel Ben Salah is a frontend developer in Tunisia specializing in React, Next.js, JavaScript, TypeScript, and responsive web design. I build fast, modern, accessible websites and web applications for businesses and startups.",
  keywords: [
    "Frontend Developer Tunisia",
    "React Developer Tunisia",
    "Next.js Developer Tunisia",
    "Web Developer Tunisia",
    "React Developer",
    "Frontend Engineer",
    "Next.js",
    "React",
    "JavaScript",
    "TypeScript",
    "Responsive Web Design",
    "Web Development",
    "Website Development",
  ],
  authors: [{ name: "Ibtihel Ben Salah" }],
  creator: "Ibtihel Ben Salah",
  metadataBase: new URL("https://ibtihelbensalah-dev.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ibtihel Ben Salah | Frontend Developer & React Developer",
    description:
      "Frontend developer specializing in React, Next.js, JavaScript, and modern responsive web development.",
    url: "https://ibtihelbensalah-dev.vercel.app",
    siteName: "Ibtihel Ben Salah",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ibtihel Ben Salah | Frontend Developer",
    description:
      "React and Next.js frontend developer building modern, responsive, and accessible websites.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [headerData, siteSettings, socialLinks] = await Promise.all([
    getHeaderData(),
    getSiteSettings(),
    getSocialLinks(),
  ]);
  return (
    <html
      lang="en"
      className={`${domine.variable} ${dynalight.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Header headerData={headerData} />
          {children}
          <Footer siteSettings={siteSettings} socialLinks={socialLinks} />
        </Providers>
      </body>
    </html>
  );
}
