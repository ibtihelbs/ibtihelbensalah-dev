"use client";

import { useState, useEffect } from "react";
import { getProjects, type Project, urlFor } from "../sanity.io";
import Image from "next/image";

export default function Work() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
        if (data && data.length > 0) {
          setSelectedProject(data[0]);
        }
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  if (loading) {
    return (
      <section id="work-section">
        <h2 className="text-center">Recent Work</h2>
        <p className="text-center">Loading projects...</p>
      </section>
    );
  }

  // Optionally derive tags from projects
  const allTechs = Array.from(
    new Set(projects?.flatMap((p) => p.technologies ?? []) ?? []),
  ).slice(0, 5);

  return (
    <section id="work-section">
      <h2 className="text-center">recent work</h2>

      {/* Technologies tags */}
      <div className="tags-big text-center">
        {allTechs.length > 0 ? (
          allTechs.map((tech) => <span key={tech}>{tech}</span>)
        ) : (
          <>
            <span>react</span>
            <span>tailwind</span>
            <span>framer motion</span>
            <span>next.js</span>
            <span>ecommerce</span>
          </>
        )}
      </div>

      <div className="work-grid">
        {/* Project Preview */}
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
              className="project-thumbnail"
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

          {/* Technologies */}
          <div className="tags">
            {selectedProject?.technologies?.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </div>

        {/* Projects List */}
        <ul className="projects-list">
          {projects?.map((project) => (
            <li
              key={project._id}
              onClick={() => setSelectedProject(project)}
              className={selectedProject?._id === project._id ? "active" : ""}
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
          ))}
        </ul>
      </div>
    </section>
  );
}
