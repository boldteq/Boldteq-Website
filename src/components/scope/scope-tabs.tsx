"use client";

import { useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { SCOPE_PLATFORMS, type Platform, type TierKey } from "@/lib/constants/scope";
import styles from "./scope-tabs.module.css";

/**
 * Roving-tabindex arrow-key handler for a horizontal/vertical tablist.
 * ArrowLeft/Up -> previous, ArrowRight/Down -> next, Home -> first, End -> last.
 * Moves focus (and activation) to the target tab so inactive tabs stay reachable.
 */
function handleTabKeyDown(
  e: KeyboardEvent<HTMLButtonElement>,
  index: number,
  count: number,
  refs: RefObject<(HTMLButtonElement | null)[]>,
  activate: (index: number) => void,
): void {
  let next = index;
  switch (e.key) {
    case "ArrowLeft":
    case "ArrowUp":
      next = (index - 1 + count) % count;
      break;
    case "ArrowRight":
    case "ArrowDown":
      next = (index + 1) % count;
      break;
    case "Home":
      next = 0;
      break;
    case "End":
      next = count - 1;
      break;
    default:
      return;
  }
  e.preventDefault();
  activate(next);
  refs.current[next]?.focus();
}

/**
 * Compose a base CSS-module class with its per-tier variant, e.g.
 * variantClass("tierIntro", "small") -> `${styles.tierIntro} ${styles.tierIntroSmall}`.
 * `suffix` handles variants named base+Key+Suffix (e.g. tierTabSmallActive).
 */
function variantClass(base: string, key: TierKey, suffix = ""): string {
  const variant = `${base}${key.charAt(0).toUpperCase()}${key.slice(1)}${suffix}`;
  return `${styles[base]} ${styles[variant]}`;
}

function getTierTabClass(key: TierKey, active: boolean): string {
  return active ? variantClass("tierTab", key, "Active") : styles.tierTab;
}

function PlatformContent({ platform }: { platform: Platform }) {
  const [activeTier, setActiveTier] = useState<TierKey>("small");
  const tier = platform.tiers.find((t) => t.key === activeTier) ?? platform.tiers[0];
  const tierRefs = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <div className={styles.platformContent}>
      {/* platform-header.shopify / .wordpress */}
      <div className={styles.platformHeader}>
        <div className={styles.phIcon}>{platform.icon}</div>
        <div className={styles.phBody}>
          <h2 className={styles.phName}>{platform.name}</h2>
          <p className={styles.phDesc}>{platform.description}</p>
        </div>
      </div>

      {/* tier-tabs — 4-col grid */}
      <div
        className={styles.tierTabs}
        role="tablist"
        aria-label={`${platform.label} task size`}
      >
        {platform.tiers.map((t, i) => (
          <button
            key={t.key}
            ref={(el) => {
              tierRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tier-tab-${platform.key}-${t.key}`}
            aria-selected={activeTier === t.key}
            aria-controls={
              activeTier === t.key
                ? `tier-panel-${platform.key}-${t.key}`
                : undefined
            }
            tabIndex={activeTier === t.key ? 0 : -1}
            className={getTierTabClass(t.key, activeTier === t.key)}
            onClick={() => setActiveTier(t.key)}
            onKeyDown={(e) =>
              handleTabKeyDown(e, i, platform.tiers.length, tierRefs, (idx) =>
                setActiveTier(platform.tiers[idx].key),
              )
            }
          >
            {t.icon} {t.name}
          </button>
        ))}
      </div>

      {/* tier panel */}
      <div
        role="tabpanel"
        id={`tier-panel-${platform.key}-${tier.key}`}
        aria-labelledby={`tier-tab-${platform.key}-${tier.key}`}
      >
        {/* tier-intro */}
        <div className={variantClass("tierIntro", tier.key)}>
          <span className={styles.tierIntroIcon} aria-hidden="true">
            {tier.icon}
          </span>
          <div className={styles.tierIntroBody}>
            <h3 className={styles.tierIntroName}>
              {tier.name} — {platform.label}
            </h3>
            <p className={styles.tierIntroDesc}>{tier.description}</p>
          </div>
          <span className={variantClass("tierIntroTag", tier.key)}>
            <strong>{tier.timeframe}</strong>
          </span>
        </div>

        {/* cards-grid */}
        <div
          className={
            tier.key === "support"
              ? `${styles.cardsGrid} ${styles.cardsGridSupport}`
              : styles.cardsGrid
          }
        >
          {tier.cards.map((card) => (
            <div key={card.label} className={styles.card}>
              <p className={variantClass("cardLabel", tier.key)}>{card.label}</p>
              <h3 className={styles.cardHeading}>{card.heading}</h3>
              <ul className={styles.serviceList}>
                {card.items.map((item) => (
                  <li key={item} className={styles.serviceItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ScopeTabs() {
  const [activePlatform, setActivePlatform] = useState(SCOPE_PLATFORMS[0].key);
  const platform =
    SCOPE_PLATFORMS.find((p) => p.key === activePlatform) ?? SCOPE_PLATFORMS[0];
  const platformRefs = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <div id="scope-sec" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.scopeOuter}>
          {/* scope-tabs — flex row: sidebar left, content right */}
          <div className={styles.scopeTabs}>
            {/* scope-tabs-menu — vertical sidebar */}
            <nav
              className={styles.platformMenu}
              role="tablist"
              aria-label="Platform"
            >
              {SCOPE_PLATFORMS.map((p, i) => (
                <button
                  key={p.key}
                  ref={(el) => {
                    platformRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`platform-tab-${p.key}`}
                  aria-selected={activePlatform === p.key}
                  aria-controls={
                    activePlatform === p.key
                      ? `platform-panel-${p.key}`
                      : undefined
                  }
                  tabIndex={activePlatform === p.key ? 0 : -1}
                  className={
                    activePlatform === p.key
                      ? `${styles.platformBtn} ${styles.platformBtnActive}`
                      : styles.platformBtn
                  }
                  onClick={() => setActivePlatform(p.key)}
                  onKeyDown={(e) =>
                    handleTabKeyDown(
                      e,
                      i,
                      SCOPE_PLATFORMS.length,
                      platformRefs,
                      (idx) => setActivePlatform(SCOPE_PLATFORMS[idx].key),
                    )
                  }
                >
                  {/* sp-icon */}
                  <span className={styles.platformIcon}>{p.icon}</span>
                  {/* stab */}
                  <span className={styles.platformLabel}>{p.label}</span>
                </button>
              ))}
            </nav>

            {/* scope-tabs-content */}
            <div
              className={styles.scopeContent}
              role="tabpanel"
              id={`platform-panel-${platform.key}`}
              aria-labelledby={`platform-tab-${platform.key}`}
            >
              <PlatformContent platform={platform} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
