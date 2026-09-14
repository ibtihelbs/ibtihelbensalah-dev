// components/Footer.tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  getSocialLinks,
  getSiteSettings,
  urlFor,
  type SiteSettings,
  type SocialLink,
} from "../sanity.io";
import Image from "next/image";

export default function Footer() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  // Prevent hydration mismatch for theme-dependent UI
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsData, socialData] = await Promise.all([
          getSiteSettings(),
          getSocialLinks(),
        ]);

        setSiteSettings(settingsData);
        setSocialLinks(socialData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return null;

  // Fall back to "dark" during SSR / before mount so images have a stable src
  const isDark = resolvedTheme === "dark";
  const theme = mounted ? (isDark ? "dark" : "light") : "dark";

  return (
    <footer id="contact">
      <h2 className="text-center">contact</h2>
      <a
        href={`mailto:${
          siteSettings?.email ||
          "&#105;&#98;&#116;&#105;&#104;&#101;&#108;&#46;&#98;&#101;&#110;&#115;&#97;&#108;&#97;&#104;&#64;&#111;&#117;&#116;&#108;&#111;&#111;&#107;&#46;&#102;&#114;"
        }`}
      >
        click to email me
      </a>
      <div className="social-links">
        {socialLinks.map((link: SocialLink, index: number) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label={link.altText || link.platform}
          >
            {link[`${theme}Icon`] ? (
              <Image
                src={urlFor(link[`${theme}Icon`]).url()}
                alt={link.altText || link.platform}
                className="social-icon"
                height={24}
                width={24}
              />
            ) : (
              <span>{link.platform}</span>
            )}
          </a>
        ))}
      </div>
    </footer>
  );
}
