"use client";

import { useState } from "react";
import { type PricingPlan } from "../sanity.io";

const CURRENCY_SYMBOLS: { [key: string]: string } = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  TND: "DT ",
};

function formatPrice(plan: PricingPlan) {
  const symbol = CURRENCY_SYMBOLS[plan.currency] || plan.currency;
  return `${plan.price} ${symbol}`;
}

export default function PricingClient({ plans }: { plans: PricingPlan[] }) {
  const [currentPricingIndex, setCurrentPricingIndex] = useState(0);

  if (plans.length === 0) {
    return (
      <section id="pricing-section">
        <h2 className="text-center">pricing</h2>
        <p className="text-center">
          Pricing plans are on the way — check back soon.
        </p>
      </section>
    );
  }

  return (
    <section id="pricing-section">
      <h2 className="text-center">pricing</h2>
      <p className="text-center">
        Special Offer – Limited until the 1st of each month! 🎉 Book your
        website project before the 1st and enjoy -20% off on any pack.
        Don&apos;t miss the chance to launch your modern, responsive site at the
        best price!
      </p>

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

      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <div
            key={plan._id}
            className={`pricing-card ${
              currentPricingIndex === index ? "current" : ""
            } ${plan.highlighted ? "highlighted-plan" : ""}`}
          >
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

            <ul>
              {plan.features.map((feature, i) => (
                <li key={`${plan._id}-${i}`}>
                  {feature} {i < plan.features.length - 1 && <hr />}
                </li>
              ))}
            </ul>

            <a
              className="pill get-started"
              href="mailto:ibtihel.bensalah@outlook.fr"
            >
              Get Started
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
