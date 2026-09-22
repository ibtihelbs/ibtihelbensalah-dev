import { getServices } from "../sanity.io";
import ServicesClient from "./ServiceClient";

// export const revalidate = 3600; // optional: match the Home page's caching

export default async function Services() {
  const data = await getServices();
  const sortedServices = [...data].sort(
    (a, b) => (a.order || 0) - (b.order || 0),
  );

  return <ServicesClient services={sortedServices} />;
}
