// components/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { getHeaderData, urlFor } from "../sanity.io";
import type { HeaderData, NavigationItem } from "../sanity.io";
import Image from "next/image";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  // Prevent hydration mismatch for theme-dependent UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch header data from Sanity
  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const data = await getHeaderData();
        setHeaderData(data);
      } catch (error) {
        console.error("Error fetching header data:", error);
      }
    };

    fetchHeaderData();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isDark = resolvedTheme === "dark";

  const getIconUrl = (icon: any): string => {
    if (!icon?.asset?._id) return "";
    return urlFor(icon).url();
  };

  const handleNavClick = (): void => {
    setMenuOpen(false);
  };

  const isActivePath = (path: string): boolean => {
    return pathname === path;
  };

  const renderNavigationItem = (
    item: NavigationItem,
    index: number,
  ): React.ReactNode => {
    const linkContent = (
      <>
        {item.icon && (
          <Image
            src={getIconUrl(item.icon)}
            alt={item.icon.alt || `${item.label} icon`}
            className="nav-icon"
            height={20}
            width={20}
          />
        )}
        <span>{item.label}</span>
      </>
    );

    switch (item.type) {
      case "page": {
        const href = item.isExternal ? item.externalUrl : item.pageRoute;

        if (item.isExternal) {
          return (
            <li key={index}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleNavClick}
                className="nav-link-with-icon"
              >
                {linkContent}
              </a>
            </li>
          );
        }

        return (
          <li key={index}>
            <Link
              href={href || "/"}
              onClick={handleNavClick}
              className={`nav-link-with-icon ${
                isActivePath(item.pageRoute || "/") ? "active" : ""
              }`}
            >
              {linkContent}
            </Link>
          </li>
        );
      }

      case "section":
        return (
          <li key={index}>
            <a
              href={`#${item.sectionId}`}
              onClick={handleNavClick}
              className={`nav-link-with-icon ${
                pathname === "/" ? "" : "disabled-link"
              }`}
            >
              {linkContent}
            </a>
          </li>
        );

      case "homeSection":
        if (pathname === "/") {
          return (
            <li key={index}>
              <a
                href={`#${item.sectionId}`}
                onClick={handleNavClick}
                className="nav-link-with-icon"
              >
                {linkContent}
              </a>
            </li>
          );
        } else {
          return (
            <li key={index}>
              <Link
                href={`/#${item.sectionId}`}
                onClick={handleNavClick}
                className={`nav-link-with-icon ${
                  isActivePath("/") ? "active" : ""
                }`}
              >
                {linkContent}
              </Link>
            </li>
          );
        }

      default:
        return null;
    }
  };

  if (!headerData) {
    return <header>Loading...</header>;
  }

  const { name, logo, navigationItems, themeToggle, icons } = headerData;

  // Sort navigation items by order
  const sortedNavItems =
    navigationItems
      ?.filter((item) => item.isActive)
      .sort((a, b) => (a.order || 0) - (b.order || 0)) || [];

  // Get menu icon based on theme + open state
  const getMenuIcon = () => {
    if (menuOpen) {
      return isDark
        ? icons?.mobileMenuCloseIconDark || icons?.mobileMenuCloseIcon
        : icons?.mobileMenuCloseIcon || icons?.mobileMenuCloseIconDark;
    } else {
      return isDark
        ? icons?.mobileMenuIconDark || icons?.mobileMenuIcon
        : icons?.mobileMenuIcon || icons?.mobileMenuIconDark;
    }
  };

  const getMenuIconAlt = (): string => {
    if (menuOpen) {
      return isDark
        ? icons?.mobileMenuCloseIconDark?.alt ||
            icons?.mobileMenuCloseIcon?.alt ||
            "Close menu"
        : icons?.mobileMenuCloseIcon?.alt ||
            icons?.mobileMenuCloseIconDark?.alt ||
            "Close menu";
    } else {
      return isDark
        ? icons?.mobileMenuIconDark?.alt ||
            icons?.mobileMenuIcon?.alt ||
            "Open menu"
        : icons?.mobileMenuIcon?.alt ||
            icons?.mobileMenuIconDark?.alt ||
            "Open menu";
    }
  };

  // Get theme icon based on current theme
  const themeIcon = isDark
    ? icons?.themeIcons?.lightThemeIcon
    : icons?.themeIcons?.darkThemeIcon;

  const themeIconAlt = isDark
    ? icons?.themeIcons?.lightThemeIcon?.alt || "Switch to light mode"
    : icons?.themeIcons?.darkThemeIcon?.alt || "Switch to dark mode";

  return (
    <header>
      <h4 className="cursive">
        <Link href="/" onClick={handleNavClick} className="logo-link">
          {logo ? (
            <Image
              src={getIconUrl(logo)}
              alt={logo.alt || name}
              className="logo-image"
              height={24}
              width={24}
            />
          ) : (
            name
          )}
        </Link>
      </h4>

      <nav>
        <button
          className="menu-toggle"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Image
            src={getIconUrl(getMenuIcon())}
            alt={getMenuIconAlt()}
            width={24}
            height={24}
          />
        </button>

        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          {sortedNavItems.map((item, index) =>
            renderNavigationItem(item, index),
          )}
        </ul>

        {themeToggle && mounted && (
          <button
            className="theme-switcher"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={themeIconAlt}
          >
            <Image
              src={getIconUrl(themeIcon)}
              alt={themeIconAlt}
              height={24}
              width={24}
            />
          </button>
        )}
      </nav>
    </header>
  );
}
