import Image from "next/image";
import { getSiteSettings, urlFor } from "../sanity.io";

function parseHeadline(text: string) {
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
}

// export const revalidate = 3600; // optional: match the Home page's caching

export default async function HeroAndAbout() {
  const siteSettings = await getSiteSettings();
  const { heroHeadline, heroImage, email, about } = siteSettings ?? {};

  return (
    <>
      {/* HERO */}
      <section id="hero-section">
        <h1 className="text-center">
          {heroHeadline ? parseHeadline(heroHeadline) : null}
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
          {about?.heading ? parseHeadline(about.heading) : null}
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
