"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { type Project, urlFor } from "../sanity.io";

const FALLBACK_TECHS = [
  "react",
  "tailwind",
  "framer motion",
  "next.js",
  "ecommerce",
];

export default function WorkClient({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(
    projects[0] ?? null,
  );

  // useMemo avoids recomputing this set on every re-render (e.g. every
  // time selectedProject changes) since it only depends on `projects`,
  // which doesn't change after the server hands it off.
  const allTechs = useMemo(() => {
    const techs = Array.from(
      new Set(projects.flatMap((p) => p.technologies ?? [])),
    ).slice(0, 5);
    return techs.length > 0 ? techs : FALLBACK_TECHS;
  }, [projects]);

  if (projects.length === 0) {
    return (
      <section id="work-section">
        <h2 className="text-center">recent work</h2>
        <p className="text-center">
          Projects are on the way — check back soon.
        </p>
      </section>
    );
  }

  return (
    <section id="work-section">
      <h2 className="text-center">recent work</h2>

      <div className="tags-big text-center">
        {allTechs.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>

      <div className="work-grid">
        <div id="project-preview">
          {selectedProject?.thumbnail && (
            <Image
              src={urlFor(selectedProject.thumbnail)
                .width(600)
                .height(400)
                .url()}
              alt={`${selectedProject.title} preview`}
              width={600}
              height={400}
              sizes="(max-width: 768px) 100vw, 600px"
              className="project-thumbnail"
              priority
            />
          )}

          <div className="space-between">
            <h3>{selectedProject?.title}</h3>
            <div className="project-links">
              {selectedProject?.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Live Demo"
                >
                  View live →
                </a>
              )}
            </div>
          </div>

          <p>{selectedProject?.description}</p>

          <div className="tags">
            {selectedProject?.technologies?.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </div>

        <ul className="projects-list">
          {projects.map((project) => {
            const isActive = selectedProject?._id === project._id;
            return (
              <li
                key={project._id}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                onClick={() => setSelectedProject(project)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedProject(project);
                  }
                }}
                className={isActive ? "active" : ""}
              >
                <h4>{project.title}</h4>
                <div className="tags">
                  {project.technologies?.slice(0, 3).map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                  {project.technologies && project.technologies.length > 3 && (
                    <span>+{project.technologies.length - 3}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
