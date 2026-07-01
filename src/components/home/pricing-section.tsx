"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  PRICING_PLANS,
  COMPARISON_TABLE,
  type BillingPeriod,
  getPlanPrice,
  getPlanCheckoutLink,
} from "@/lib/constants/pricing";
import styles from "./pricing-section.module.css";

function CheckIcon() {
  return (
    <Image
      src="/images/webflow/Vector-20.svg"
      alt=""
      aria-hidden="true"
      width={16}
      height={16}
      className={styles["icon"]}
    />
  );
}

function CrossIcon() {
  return (
    <Image
      src="/images/webflow/Mask-group.svg"
      alt=""
      aria-hidden="true"
      width={20}
      height={20}
    />
  );
}

export function PricingSection({ transparent = false, asH1 = false }: { transparent?: boolean; asH1?: boolean }) {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");

  const ctaLabel: Record<BillingPeriod, string> = {
    monthly: "Choose Plan",
    quarterly: "Get Started",
    annually: "Get Started",
  };

  return (
    <section id="pricing" className={`${styles["newPriceSec"]}${transparent ? ` ${styles["newPriceSecPage"]}` : ""}`}>
      <div className={styles["containerLarge3"]}>
        {/* Header */}
        <div className={styles["priceTitleGrid"]}>
          <div className={styles["maxWidthSmall4"]}>
            <div className={styles["priceSubheadOut"]}>
              <div className={styles["pricesubott"]}>
                <p className={styles["badgePillText"]}>
                  <strong className={styles["faqSkyText"]}>Pricing</strong>
                </p>
              </div>
            </div>
            {asH1 ? (
              <h1 className={styles["heading2"]}>
                Pick a Flexible Subscription.
                <br className={styles["brDesktopOnly"]} />{" "}
                Get Predictable Output.
              </h1>
            ) : (
              <h2 className={styles["heading2"]}>
                Pick a Flexible Subscription. Get Predictable Output.
              </h2>
            )}
            <p className={styles["paragraph"]}>
              Scale your output with a ready-to-go execution team — no
              onboarding delays, no overhead.
            </p>
          </div>
        </div>

        {/* Billing toggle */}
        <div
          className={styles["pricingTabsMenuLarge"]}
          role="group"
          aria-label="Billing period"
        >
          <button
            type="button"
            className={`${styles["pricingTabLink"]} ${styles["pricingTabLinkMonthly"]} ${period === "monthly" ? styles["pricingTabLinkActive"] : ""}`}
            onClick={() => setPeriod("monthly")}
            aria-pressed={period === "monthly"}
          >
            <div className={styles["priceTabText"]}>Monthly</div>
          </button>
          <button
            type="button"
            className={`${styles["pricingTabLink"]} ${period === "quarterly" ? styles["pricingTabLinkActive"] : ""}`}
            onClick={() => setPeriod("quarterly")}
            aria-pressed={period === "quarterly"}
          >
            <div className={styles["priceTabText"]}>Quarterly</div>
            <div className={styles["pricingBadge"]}>Save 10%</div>
          </button>
          <button
            type="button"
            className={`${styles["pricingTabLink"]} ${period === "annually" ? styles["pricingTabLinkActive"] : ""}`}
            onClick={() => setPeriod("annually")}
            aria-pressed={period === "annually"}
          >
            <div className={styles["priceTabText"]}>Annually</div>
            <div className={styles["pricingBadge"]}>Save 20%</div>
          </button>
        </div>

        {/* Plan cards */}
        <div className={styles["pricingGrid"]}>
          {PRICING_PLANS.map((plan) => {
            const price = getPlanPrice(plan, period);
            const link = getPlanCheckoutLink(plan, period);
            const isPopular = plan.popular;
            const isMonthly = period === "monthly";

            const cardClass = isPopular
              ? `${styles["pricingCard2"]} ${styles["pricingCard2CenterPcard"]}`
              : `${styles["pricingCard2"]} ${styles["pricingCard2WhiteCard"]}`;

            const btnClass = isPopular
              ? `${styles["buttonPricing"]} ${styles["buttonPricingSky"]}`
              : styles["buttonPricing"];

            const innerColClass = `${styles["columnXSmall10"]} ${styles["columnXSmall10CenterCol"]}`;

            return (
              <div key={plan.id} className={cardClass}>
                {isPopular && (
                  <div className={styles["pTopDv"]}>
                    <Image
                      src="/images/webflow/Layer_2.svg"
                      alt=""
                      aria-hidden="true"
                      width={18}
                      height={18}
                    />
                    <p className={styles["mostPopular"]}>Most Popular</p>
                  </div>
                )}

                <div className={innerColClass}>
                  <div className={styles["priceSubOtt"]}>
                    <h3 className={styles["h6Heading5PlanName"]}>{plan.name}</h3>
                  </div>
                  <div className={styles["priceBadgeOut"]}>
                    <h3 className={styles["h3Heading3"]}>
                      ${price}/month
                    </h3>
                    {!isMonthly && (
                      <p className={styles["comparePrice"]}>
                        ${plan.monthlyPrice}.00
                      </p>
                    )}
                  </div>
                  <p className={styles["paragraphSmall27TextColorTertiary"]}>
                    {plan.tagline}
                  </p>
                </div>

                <div>
                  <div className={styles["columnSmall5"]}>
                    <div className={styles["paragraphXSmall13TextColorTertiary"]}>
                      <strong>{plan.featuresLabels[period]}</strong>
                    </div>
                    {plan.features.map((feature) => (
                      <div key={feature} className={styles["pricingFeature"]}>
                        <CheckIcon />
                        <div className={styles["captionSmall2"]}>{feature}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={link}
                  className={btnClass}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div>{ctaLabel[period]}</div>
                </a>
              </div>
            );
          })}
        </div>

        {/* Comparison table */}
        <div
          className={styles["pricingTableWrapper"]}
          tabIndex={0}
          role="group"
          aria-label="Plan feature comparison"
        >
          <div className={styles["pricingTable"]}>
            {/* Header row (sits on the tinted container, no card) */}
            <div className={styles["pricingTableHeaderRow"]}>
              <div
                className={`${styles["pricingTableHeader"]} ${styles["pricingTableHeaderLeft"]}`}
              >
                <div className={styles["subheadingLarge7"]}>Basic Features</div>
              </div>
              <div className={styles["pricingTableHeader"]}>
                <div className={styles["subheadingLarge7"]}>Starter</div>
              </div>
              <div className={styles["pricingTableHeader"]}>
                <div className={styles["subheadingLarge7"]}>Growth</div>
              </div>
              <div className={styles["pricingTableHeader"]}>
                <div className={styles["pricingHeaderLast"]}>
                  <div className={styles["subheadingLarge7"]}>Pro</div>
                </div>
              </div>
            </div>

            {/* Data rows — each row is its own white card */}
            {COMPARISON_TABLE.map((row) => {
              const renderValue = (val: string | boolean) => {
                if (val === false) return <CrossIcon />;
                return (
                  <div className={styles["paragraphRegular14"]}>{val}</div>
                );
              };

              return (
                <div className={styles["pricingTableRow"]} key={row.label}>
                  <div
                    className={`${styles["pricingTableCell"]} ${styles["pricingTableCellLeft"]}`}
                  >
                    <div className={styles["paragraphRegular14"]}>
                      <strong>
                        {row.label.split("\n").map((part, idx, arr) => (
                          <React.Fragment key={idx}>
                            {part}
                            {idx < arr.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </strong>
                    </div>
                    <button
                      type="button"
                      className={styles["tooltip"]}
                      data-tooltip={row.tooltip}
                      aria-label={`More info: ${row.tooltip}`}
                    >
                      <Image
                        src="/images/webflow/icons8-info-48.png"
                        alt=""
                        aria-hidden="true"
                        width={16}
                        height={16}
                        className={styles["tooltipIco"]}
                      />
                    </button>
                  </div>
                  <div className={styles["pricingTableCell"]}>
                    {renderValue(row.starter)}
                  </div>
                  <div className={styles["pricingTableCell"]}>
                    {renderValue(row.growth)}
                  </div>
                  <div className={styles["pricingTableCell"]}>
                    {renderValue(row.pro)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
