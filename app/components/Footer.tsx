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
import { useMounted } from "../hook/useMounted";
import Image from "next/image";
export default function Footer() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const mounted = useMounted();
  const { resolvedTheme } = useTheme();

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

  const isDark = resolvedTheme === "dark";
  const theme = mounted ? (isDark ? "dark" : "light") : "dark";

  return (
    <footer id="contact">
      <h2 className="text-center">contact</h2>
      <a href={`mailto:${siteSettings?.email || ""}`}>click to email me</a>
      <div className="social-links">
        {socialLinks.map((link, index) => (
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
                width={30}
                height={30}
                src={urlFor(link[`${theme}Icon`]).url()}
                alt={link.altText || link.platform}
                className="social-icon"
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
