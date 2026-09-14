"use client";
import { useState, useEffect } from "react";
import { getPricingPlans, type PricingPlan } from "../sanity.io";

export default function Pricing() {
  const [currentPricingIndex, setCurrentPricingIndex] = useState(0);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPricingPlans() {
      const data = await getPricingPlans();
      setPlans(data);
      setLoading(false);
    }
    loadPricingPlans();
  }, []);

  // Format currency display
  const formatPrice = (plan: PricingPlan) => {
    const currencySymbols: { [key: string]: string } = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      TND: "DT ",
    };

    const symbol = currencySymbols[plan.currency] || plan.currency;
    return `${plan.price} ${symbol}`;
  };

  if (loading) {
    return (
      <section id="pricing-section">
        <h2 className="text-center">pricing</h2>
        <p className="text-center">Loading pricing plans...</p>
      </section>
    );
  }

  return (
    <section id="pricing-section">
      <h2 className="text-center">pricing</h2>
      <p className="text-center">
        Special Offer – Limited until the 1st of each month! 🎉 Book your
        website project before the 1st and enjoy -20% off on any pack. Don't
        miss the chance to launch your modern, responsive site at the best
        price!
      </p>

      {/* Mobile pricing selector */}
      <div className="mobile-pricing text-center">
        {plans.map((plan, index) => (
          <button
            key={plan._id}
            className={`pill ${
              currentPricingIndex === index ? "current-offer" : ""
            } ${plan.highlighted ? "highlighted" : ""}`}
            onClick={() => setCurrentPricingIndex(index)}
          >
            {plan.name}
            {plan.highlighted && " ⭐"}
          </button>
        ))}
      </div>

      {/* Pricing grid */}
      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <div
            key={plan._id}
            className={`pricing-card ${
              currentPricingIndex === index ? "current" : ""
            } ${plan.highlighted ? "highlighted-plan" : ""}`}
          >
            {/* Plan header */}
            <div className="plan-header">
              <h3>
                {plan.name}
                {plan.highlighted && (
                  <span className="popular-badge">Most Popular</span>
                )}
              </h3>
              <h4>starting from {formatPrice(plan)} </h4>
              <p>{plan.deliveryTime && plan.deliveryTime}</p>
            </div>

            <hr />

            {/* Features list */}
            <ul>
              {plan.features.map((feature, i) => (
                <li key={Math.random()}>
                  {feature} {i < plan.features.length - 1 && <hr />}
                </li>
              ))}
            </ul>

            {/* CTA Button */}

            <a
              className="pill get-started"
              href="mailto:&#105;&#98;&#116;&#105;&#104;&#101;&#108;&#46;&#98;&#101;&#110;&#115;&#97;&#108;&#97;&#104;&#64;&#111;&#117;&#116;&#108;&#111;&#111;&#107;&#46;&#102;&#114;"
            >
              Get Started
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
