"use client";

import { useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { type Service, urlFor } from "../sanity.io";
import { useMounted } from "../hook/useMounted";

export default function ServicesClient({ services }: { services: Service[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const mounted = useMounted();
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const getIcon = (service: Service) => {
    if (!mounted) return service.iconDark ?? service.iconLight;
    return isDark
      ? (service.iconDark ?? service.iconLight)
      : (service.iconLight ?? service.iconDark);
  };

  if (services.length === 0) {
    return (
      <section id="services-section" className="services-section">
        <h2 className="text-center">What do I provide</h2>
        <p className="text-center">No services available at the moment.</p>
      </section>
    );
  }

  return (
    <section id="services-section" className="services-section">
      <h2 className="text-center">What do I provide</h2>
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
      </ul>
    </section>
  );
}
