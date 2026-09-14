"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getSiteSettings, urlFor } from "../sanity.io";

interface SiteSettings {
  heroHeadline: string;
  heroImage?: any;
  email?: string;
  about?: {
    heading?: string;
    description?: string;
    image?: any;
    features?: Array<{ text: string }>;
  };
}

export default function HeroAndAbout() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSiteSettings();
        setSiteSettings(data);
      } catch (error) {
        console.error("Error fetching site settings:", error);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const parseHeadline = (text: string) => {
    if (!text) return null;

    const parts = text.split(/(\*[^*]+\*)/);

    return parts.map((part, index) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        const styledText = part.slice(1, -1);
        return (
          <span key={index} className="cursive">
            {styledText}
          </span>
        );
      }
      return part || null;
    });
  };

  if (loading) return <div>Loading...</div>;

  const { heroHeadline, heroImage, email, about } = siteSettings ?? {};

  return (
    <>
      {/* HERO */}
      <section id="hero-section">
        <h1 className="text-center">
          {heroHeadline ? parseHeadline(heroHeadline) : "Loading..."}
        </h1>

        <a className="pill cta" href={`mailto:${email ?? ""}`}>
          let&apos;s talk
        </a>

        {heroImage && (
          <Image
            src={urlFor(heroImage).width(800).height(600).format("webp").url()}
            alt="Agency hero illustration"
            width={800}
            height={600}
            priority
          />
        )}
      </section>

      {/* ABOUT */}
      <section id="about-section">
        <h2 className="text-center">
          {about?.heading ? parseHeadline(about.heading) : "Loading..."}
        </h2>

        <h3 className="text-center">
          {about?.features && about.features.length > 0 ? (
            about.features.map((feature, index, arr) => (
              <span key={feature.text}>
                {feature.text}
                {index < arr.length - 1 ? " · " : ""}
              </span>
            ))
          ) : (
            <>high performance · responsive · SEO friendly</>
          )}
        </h3>

        {about?.description && (
          <p className="text-center">{about.description}</p>
        )}

        {about?.image && (
          <Image
            src={urlFor(about.image).width(600).height(400).url()}
            alt="About section illustration"
            width={600}
            height={400}
          />
        )}
      </section>
    </>
  );
}
