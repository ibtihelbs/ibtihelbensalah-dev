import type { Metadata } from "next";
import HeroAndAbout from "./components/Hero";
import Services from "./components/Services";
import Work from "./components/Work";
import Pricing from "./components/Pricing";
import { getSiteSettings } from "./sanity.io";

// Re-fetch Sanity content at most once an hour instead of on every
// single visit. Lower this if you edit content often, or switch to
// on-demand revalidation via a Sanity webhook later if you want
// changes to go live the instant you publish.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: settings?.title,
    description: settings?.description,
    openGraph: {
      title: settings?.title,
      description: settings?.description,
    },
  };
}

export default function Home() {
  return (
    <>
      <HeroAndAbout />
      <Services />
      <Work />
      <Pricing />
    </>
  );
}
