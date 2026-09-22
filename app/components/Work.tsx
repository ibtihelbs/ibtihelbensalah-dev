import { getProjects } from "../sanity.io";
import WorkClient from "./WorkClient";

// Server Component: fetches data at request/build time on the server.
// This means the HTML sent to the browser (and to search engines, and
// to a client opening your portfolio link for the first time) already
// contains the project list — no "Loading projects..." flash, no
// client-side fetch waterfall, and it's crawlable for SEO.
//
// If you want fresh data without a full rebuild, add:
//   export const revalidate = 3600; // re-fetch at most once an hour
// Or for always-fresh data on every request:
//   export const dynamic = "force-dynamic";
export default async function Work() {
  const projects = await getProjects();

  return <WorkClient projects={projects ?? []} />;
}
