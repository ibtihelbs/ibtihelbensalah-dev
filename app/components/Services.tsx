"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { getServices, type Service, urlFor } from "../sanity.io";

export default function Services() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  // Avoid hydration mismatch for theme-dependent icons
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        const data = await getServices();
        const sortedServices = [...data].sort(
          (a, b) => (a.order || 0) - (b.order || 0),
        );
        setServices(sortedServices);
      } catch (err) {
        setError("Failed to load services");
        console.error("Error loading services:", err);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  const isDark = resolvedTheme === "dark";

  // Pick the right icon based on theme (falls back to the other if missing)
  const getIcon = (service: Service) => {
    if (!mounted) return service.iconDark ?? service.iconLight;
    return isDark
      ? (service.iconDark ?? service.iconLight)
      : (service.iconLight ?? service.iconDark);
  };

  const renderSection = (content: React.ReactNode) => (
    <section id="services-section" className="services-section">
      <h2 className="text-center">What do I provide</h2>
      {content}
    </section>
  );

  if (loading) {
    return renderSection(<p className="text-center">Loading services...</p>);
  }

  if (error) {
    return renderSection(<p className="text-center error">{error}</p>);
  }

  if (services.length === 0) {
    return renderSection(
      <p className="text-center">No services available at the moment.</p>,
    );
  }

  return renderSection(
    <ul className="services-list">
      {services.map((service, index) => {
        const icon = getIcon(service);

        return (
          <li
            key={service._id}
            className={`service-item ${
              hoveredIndex === index ? "hovered" : ""
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="service-content">
              {/* Icon Container */}
              <div className="service-icon">
                {icon && (
                  <Image
                    src={urlFor(icon).width(48).height(48).url()}
                    alt={service.iconDescription || service.title}
                    width={48}
                    height={48}
                    className="icon-image"
                  />
                )}
              </div>

              {/* Text Content */}
              <div className="service-text">
                {hoveredIndex === index ? (
                  <div className="service-description">
                    {service.description}
                  </div>
                ) : (
                  <div className="service-title">{service.title}</div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>,
  );
}
