import { getPricingPlans } from "../sanity.io";
import PricingClient from "./PricingClient";

// export const revalidate = 3600; // uncomment once plans stabilize

export default async function Pricing() {
  const plans = await getPricingPlans();
  return <PricingClient plans={plans} />;
}
