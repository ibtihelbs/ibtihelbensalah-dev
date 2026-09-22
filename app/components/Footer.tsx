"use client";

import { useTheme } from "next-themes";
import { urlFor, type SiteSettings, type SocialLink } from "../sanity.io";
import { useMounted } from "../hook/useMounted";
import Image from "next/image";

export default function Footer({
  siteSettings,
  socialLinks,
}: {
  siteSettings: SiteSettings | null;
  socialLinks: SocialLink[];
}) {
  const mounted = useMounted();
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";
  // Default to "dark" before mount to match server-rendered markup and
  // avoid a hydration mismatch flash, same behavior as before.
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
