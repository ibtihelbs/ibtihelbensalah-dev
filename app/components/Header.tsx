"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import { urlFor } from "../sanity.io";
import type { HeaderData, NavigationItem } from "../sanity.io";
import { useMounted } from "../hook/useMounted";

export default function Header({
  headerData,
}: {
  headerData: HeaderData | null;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  const isDark = resolvedTheme === "dark";

  const getIconUrl = (icon: any): string => {
    if (!icon?.asset?._id) return "";
    return urlFor(icon).url();
  };

  const handleNavClick = (): void => {
    setMenuOpen(false);
  };

  const isActivePath = (path: string): boolean => pathname === path;

  const renderNavigationItem = (
    item: NavigationItem,
    index: number,
  ): React.ReactNode => {
    const linkContent = (
      <>
        {item.icon && (
          <Image
            width={30}
            height={30}
            src={getIconUrl(item.icon)}
            alt={item.icon.alt || `${item.label} icon`}
            className="nav-icon"
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
        }
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

      default:
        return null;
    }
  };

  // headerData now arrives already-loaded from the server, so this only
  // guards against a genuinely missing Sanity document, not a fetch delay.
  if (!headerData) {
    return <header>Header content unavailable</header>;
  }

  const { name, logo, navigationItems, themeToggle, icons } = headerData;

  const sortedNavItems =
    navigationItems
      ?.filter((item) => item.isActive)
      .sort((a, b) => (a.order || 0) - (b.order || 0)) || [];

  const getMenuIcon = () => {
    if (menuOpen) {
      return isDark
        ? icons?.mobileMenuCloseIconDark || icons?.mobileMenuCloseIcon
        : icons?.mobileMenuCloseIcon || icons?.mobileMenuCloseIconDark;
    }
    return isDark
      ? icons?.mobileMenuIconDark || icons?.mobileMenuIcon
      : icons?.mobileMenuIcon || icons?.mobileMenuIconDark;
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
    }
    return isDark
      ? icons?.mobileMenuIconDark?.alt ||
          icons?.mobileMenuIcon?.alt ||
          "Open menu"
      : icons?.mobileMenuIcon?.alt ||
          icons?.mobileMenuIconDark?.alt ||
          "Open menu";
  };

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
              width={30}
              height={30}
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
            height={30}
            width={30}
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
              height={30}
              width={30}
            />
          </button>
        )}
      </nav>
    </header>
  );
}
