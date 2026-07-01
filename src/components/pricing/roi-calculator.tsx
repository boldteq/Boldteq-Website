"use client";

import { useState, useMemo, useRef, useEffect, useId, type ReactNode } from "react";
import Link from "next/link";
import { animate, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import {
  type BillingPeriod,
  type PlanKey,
  type PresetKey,
  PLAN_PRICE_MAP,
  PLAN_LABELS,
  BILLING_LABELS,
  BILLING_BADGES,
  ROI_PRESETS,
  ROI_PRESET_META,
  ROI_FIELD_TOOLTIPS,
} from "@/lib/constants/pricing";
import styles from "./roi-calculator.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CalcState {
  billing: BillingPeriod;
  plan: PlanKey;
  teamSize: number;
  manualHours: number;
  hourlyRate: number;
  toolCost: number;
}

interface CalcResult {
  bmo: number;
  byr: number;
  savings: number;
  net: number;
  roi: number;
  monthlyBenefit: number;
  hrsSaved: number;
  prodGain: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

// Signed currency: "+$26,668" / "-$5,000" — keeps the minus on the $, not the digits.
function fmtSigned(n: number): string {
  const rounded = Math.round(n);
  const sign = rounded >= 0 ? "+" : "-";
  return sign + "$" + Math.abs(rounded).toLocaleString("en-US");
}

function fmtRoi(n: number): string {
  return Math.round(n).toLocaleString("en-US") + "%";
}

function fmtHrs(n: number): string {
  return Math.round(n).toLocaleString("en-US") + " hrs";
}

function fmtPct(n: number): string {
  return n.toFixed(1) + "%";
}

function sliderBg(value: number, min: number, max: number): string {
  const pct = ((value - min) / (max - min)) * 100;
  // Brand cyan→blue gradient across the filled portion, soft gray for the rest.
  return `linear-gradient(to right, #21cfff 0%, #019ae6 ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`;
}

// ─── Icons ───────────────────────────────────────────────────────────────────
// Inline line icons (replace Webflow's emoji). Sized via `1em`, colored via
// currentColor so each call site controls size + tone through CSS.

const svgBase = {
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function IconClock() {
  return (
    <svg {...svgBase}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg {...svgBase}>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="8" y1="2.5" x2="8" y2="5.5" />
      <line x1="16" y1="2.5" x2="16" y2="5.5" />
    </svg>
  );
}

function IconTrendingUp() {
  return (
    <svg {...svgBase}>
      <polyline points="3 17 9 11 13 15 21 6" />
      <polyline points="14 6 21 6 21 13" />
    </svg>
  );
}

function IconDollarCircle() {
  return (
    <svg {...svgBase}>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.6 9.2c-.5-.9-1.5-1.4-2.6-1.4-1.5 0-2.6.8-2.6 2s1.1 1.7 2.6 2 2.6.9 2.6 2.1-1.1 2-2.6 2c-1.1 0-2.1-.5-2.6-1.4" />
      <line x1="12" y1="6.2" x2="12" y2="7.8" />
      <line x1="12" y1="16.2" x2="12" y2="17.8" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg {...svgBase}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg {...svgBase}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg {...svgBase}>
      <rect x="4.5" y="11" width="15" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg {...svgBase}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <polyline points="3 4 3 9 8 9" />
    </svg>
  );
}

function IconRocket() {
  return (
    <svg {...svgBase}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function IconBuilding() {
  return (
    <svg {...svgBase}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
      <path d="M2 22h20" />
      <path d="M10 6h.01" />
      <path d="M14 6h.01" />
      <path d="M10 10h.01" />
      <path d="M14 10h.01" />
      <path d="M10 14h.01" />
      <path d="M14 14h.01" />
    </svg>
  );
}

// Scenario preset → matching line icon (replaces Webflow's emoji for consistency)
const PRESET_ICONS: Record<PresetKey, ReactNode> = {
  startup: <IconRocket />,
  midsize: <IconTrendingUp />,
  enterprise: <IconBuilding />,
};

// ─── Animated counter ───────────────────────────────────────────────────────
// Smooth Framer Motion counter — animates from previous value to next over
// ~900ms with easeOut. prefers-reduced-motion → instant update.

type Formatter = (n: number) => string;

interface AnimatedValueProps {
  value: number;
  format: Formatter;
  duration?: number;
  className?: string;
  // When true, the text color tracks the sign of the *currently displayed*
  // frame (green ≥ 0, red < 0) so the color never disagrees with the digits
  // while the counter sweeps across zero.
  signed?: boolean;
}

function signTone(n: number): string {
  return n >= 0 ? styles.signedPositive : styles.signedNegative;
}

function AnimatedValue({
  value,
  format,
  duration = 0.9,
  className,
  signed = false,
}: AnimatedValueProps) {
  const prefersReducedMotion = useReducedMotion();
  const motionValue = useMotionValue(value);
  const display = useTransform(motionValue, (latest) => format(latest));
  const [text, setText] = useState<string>(() => format(value));
  const [tone, setTone] = useState<string>(() =>
    signed ? signTone(value) : ""
  );

  useEffect(() => {
    // Subscribe to the transformed display value so the rendered text
    // updates each animation frame; keep the sign tone in lockstep.
    const unsubscribe = display.on("change", (v) => setText(v));
    const unsubTone = signed
      ? motionValue.on("change", (latest) => setTone(signTone(latest)))
      : undefined;
    return () => {
      unsubscribe();
      unsubTone?.();
    };
  }, [display, motionValue, signed]);

  useEffect(() => {
    if (prefersReducedMotion) {
      // Instant jump for reduced-motion users — set then sync text via
      // the subscription above (which fires synchronously on .set()).
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [value, prefersReducedMotion, motionValue, duration]);

  return (
    <span
      className={`${className ?? styles.animatedCounter} ${signed ? tone : ""}`}
      aria-hidden="true"
    >
      {text}
    </span>
  );
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function Tooltip({ text, label }: { text: string; label?: string }) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <span className={styles.tooltipWrap}>
      <button
        type="button"
        className={styles.tooltipBtn}
        aria-describedby={id}
        aria-expanded={visible}
        aria-label={label ? `More information about ${label}` : "More information"}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        onClick={() => setVisible((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setVisible(false);
        }}
      >
        ?
      </button>
      {/* Always rendered (stable describedby target); shown via CSS so the
          description stays available and touch/keyboard can toggle it. */}
      <span
        role="tooltip"
        id={id}
        className={`${styles.tooltipBubble} ${visible ? "" : styles.tooltipHidden}`}
      >
        {text}
      </span>
    </span>
  );
}

// ─── Dollar input field ───────────────────────────────────────────────────────

interface DollarFieldProps {
  label: string;
  tooltip: string;
  value: number;
  min?: number;
  onChange: (v: number) => void;
}

function DollarField({
  label,
  tooltip,
  value,
  min = 0,
  onChange,
}: DollarFieldProps) {
  const inputId = useId();

  return (
    <div className={styles.field}>
      <label htmlFor={inputId} className={styles.fieldLabel}>
        {label}
        <Tooltip text={tooltip} />
      </label>
      <div className={styles.dollarWrap}>
        <span className={styles.dollarSign} aria-hidden="true">
          $
        </span>
        <input
          id={inputId}
          type="number"
          inputMode="numeric"
          min={min}
          value={value}
          onChange={(e) => {
            const parsed = parseFloat(e.target.value);
            if (!isNaN(parsed) && parsed >= min) onChange(parsed);
          }}
          className={styles.dollarInput}
        />
      </div>
    </div>
  );
}

// ─── Metric card ──────────────────────────────────────────────────────────────

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  sub?: string;
  highlight?: boolean;
  labelTooltip?: string;
}

function MetricCard({
  icon,
  label,
  value,
  sub,
  highlight = false,
  labelTooltip,
}: MetricCardProps) {
  return (
    <div
      className={`${styles.metricCard} ${highlight ? styles.metricCardHighlight : ""}`}
    >
      <span className={styles.metricIcon} aria-hidden="true">
        {icon}
      </span>
      <div className={styles.metricLabel}>
        {label}
        {labelTooltip && <Tooltip text={labelTooltip} label={label} />}
      </div>
      <div className={styles.metricValue}>{value}</div>
      {sub && <div className={styles.metricSub}>{sub}</div>}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function RoiCalculator() {
  const [state, setState] = useState<CalcState>({
    billing: "monthly",
    plan: "growth",
    teamSize: 10,
    manualHours: 12,
    hourlyRate: 55,
    toolCost: 800,
  });

  const teamSizeRef = useRef<HTMLInputElement | null>(null);
  const manualHoursRef = useRef<HTMLInputElement | null>(null);

  // Keep range slider fill track in sync
  useEffect(() => {
    const el = teamSizeRef.current;
    if (!el) return;
    el.style.background = sliderBg(state.teamSize, 1, 200);
  }, [state.teamSize]);

  useEffect(() => {
    const el = manualHoursRef.current;
    if (!el) return;
    el.style.background = sliderBg(state.manualHours, 1, 40);
  }, [state.manualHours]);

  function patch(partial: Partial<CalcState>) {
    setState((prev) => ({ ...prev, ...partial }));
  }

  function applyPreset(key: PresetKey) {
    setState((prev) => ({ ...prev, ...ROI_PRESETS[key] }));
  }

  const result = useMemo<CalcResult>(() => {
    const bmo = PLAN_PRICE_MAP[state.plan][state.billing];
    const byr = bmo * 12;
    const laborSaved =
      state.manualHours * state.hourlyRate * state.teamSize * 52;
    const savings = laborSaved + state.toolCost;
    const net = savings - byr;
    const roi = byr > 0 ? (net / byr) * 100 : 0;
    const monthlyBenefit = savings / 12 - bmo;
    const hrsSaved = state.manualHours * state.teamSize * 52;
    const totalHrs = 40 * state.teamSize * 52;
    const prodGain = totalHrs > 0 ? (hrsSaved / totalHrs) * 100 : 0;

    return {
      bmo,
      byr,
      savings,
      net,
      roi,
      monthlyBenefit,
      hrsSaved,
      prodGain,
    };
  }, [state]);

  const netIsPositive = result.net >= 0;

  // Single, debounced live region — announces the settled result once the user
  // stops adjusting, instead of letting each animated counter spam the SR.
  const [announcement, setAnnouncement] = useState("");
  useEffect(() => {
    const t = setTimeout(() => {
      setAnnouncement(
        `Estimated annual savings ${fmt(result.savings)}, ${fmtRoi(result.roi)} ROI. ` +
          `Net gain ${fmtSigned(result.net)} per year.`
      );
    }, 500);
    return () => clearTimeout(t);
  }, [result]);

  const teamSizeId = useId();
  const manualHoursId = useId();

  return (
    <section
      id="roi-calc"
      className={styles.section}
      aria-labelledby="roi-calc-heading"
    >
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.eyebrowBadge}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            <span>ROI Calculator</span>
          </div>
          <h2 id="roi-calc-heading" className={styles.title}>
            See Your Real <span>Savings</span> Before You Commit
          </h2>
          <p className={styles.subtitle}>
            Move the sliders, see your numbers instantly. No sales call, no
            commitment.
          </p>
        </div>

        {/* Preset buttons */}
        <div className={styles.presets}>
          {(Object.keys(ROI_PRESETS) as PresetKey[]).map((key) => {
            const { label } = ROI_PRESET_META[key];
            const preset = ROI_PRESETS[key];
            const isActive =
              state.plan === preset.plan &&
              state.teamSize === preset.teamSize &&
              state.manualHours === preset.manualHours &&
              state.hourlyRate === preset.hourlyRate &&
              state.toolCost === preset.toolCost;

            return (
              <button
                key={key}
                type="button"
                className={`${styles.presetBtn} ${isActive ? styles.presetBtnActive : ""}`}
                onClick={() => applyPreset(key)}
              >
                <span className={styles.presetIcon} aria-hidden="true">
                  {PRESET_ICONS[key]}
                </span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Two-column layout */}
        <div className={styles.layout}>
          {/* LEFT: Inputs */}
          <div className={styles.leftPanel}>
            <div className={styles.panelTitle}>
              <span className={styles.panelIcon} aria-hidden="true">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                  <circle cx="9" cy="8" r="2.4" fill="currentColor" stroke="none" />
                  <circle cx="15" cy="16" r="2.4" fill="currentColor" stroke="none" />
                </svg>
              </span>
              Tell us about your team
            </div>

            {/* Plan Selection block */}
            <div className={styles.planBlock}>
              <div className={styles.sectionLabel}>
                Which Boldteq plan are you comparing?
              </div>

              {/* Billing toggle */}
              <div className={styles.billingToggle}>
                {(Object.keys(BILLING_LABELS) as BillingPeriod[]).map((b) => (
                  <button
                    key={b}
                    type="button"
                    className={`${styles.billingBtn} ${state.billing === b ? styles.billingBtnActive : ""}`}
                    onClick={() => patch({ billing: b })}
                    aria-pressed={state.billing === b}
                  >
                    {BILLING_LABELS[b]}
                    {BILLING_BADGES[b] && (
                      <span className={styles.billingSave}>
                        {BILLING_BADGES[b]}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Plan buttons */}
              <div className={styles.planButtons}>
                {(Object.keys(PLAN_LABELS) as PlanKey[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`${styles.planBtn} ${state.plan === p ? styles.planBtnActive : ""}`}
                    onClick={() => patch({ plan: p })}
                    aria-pressed={state.plan === p}
                  >
                    <span className={styles.planCheck} aria-hidden="true">
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span className={styles.planBtnName}>
                      {PLAN_LABELS[p]}
                    </span>
                    <span className={styles.planBtnPrice}>
                      {fmt(PLAN_PRICE_MAP[p][state.billing])}/mo
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Team size slider */}
            <div className={styles.field}>
              <div className={styles.fieldHeader}>
                <label htmlFor={teamSizeId} className={styles.fieldLabel}>
                  Team Size
                  <Tooltip text={ROI_FIELD_TOOLTIPS.teamSize} />
                </label>
                <span className={styles.badge}>{state.teamSize}</span>
              </div>
              <input
                id={teamSizeId}
                ref={teamSizeRef}
                type="range"
                min={1}
                max={200}
                step={1}
                value={state.teamSize}
                aria-valuetext={`${state.teamSize} ${state.teamSize === 1 ? "person" : "people"}`}
                onChange={(e) => patch({ teamSize: Number(e.target.value) })}
                className={styles.slider}
              />
              <div className={styles.sliderRange}>
                <span>1</span>
                <span>200+</span>
              </div>
            </div>

            {/* Hours per week slider */}
            <div className={styles.field}>
              <div className={styles.fieldHeader}>
                <label htmlFor={manualHoursId} className={styles.fieldLabel}>
                  Hours your team spends on tasks like these each week
                  <Tooltip text={ROI_FIELD_TOOLTIPS.manualHours} />
                </label>
                <span className={styles.badge}>{state.manualHours} hrs</span>
              </div>
              <input
                id={manualHoursId}
                ref={manualHoursRef}
                type="range"
                min={1}
                max={40}
                step={0.5}
                value={state.manualHours}
                aria-valuetext={`${state.manualHours} ${state.manualHours === 1 ? "hour" : "hours"} per week`}
                onChange={(e) =>
                  patch({ manualHours: Number(e.target.value) })
                }
                className={styles.slider}
              />
              <div className={styles.sliderRange}>
                <span>1 hr</span>
                <span>40 hrs</span>
              </div>
            </div>

            {/* Hourly rate dollar input */}
            <DollarField
              label="Average cost per team member per hour"
              tooltip={ROI_FIELD_TOOLTIPS.hourlyRate}
              value={state.hourlyRate}
              min={10}
              onChange={(v) => patch({ hourlyRate: v })}
            />

            {/* Tool cost dollar input */}
            <DollarField
              label="What you currently pay for freelancers, contractors, or tools doing this work"
              tooltip={ROI_FIELD_TOOLTIPS.toolCost}
              value={state.toolCost}
              min={0}
              onChange={(v) => patch({ toolCost: v })}
            />
          </div>

          {/* RIGHT: Results */}
          <div className={styles.rightPanel}>
            <div className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </div>
            {/* Hero savings card */}
            <div className={styles.heroCard}>
              <div className={styles.heroLabel}>
                Your Estimated Annual Savings
              </div>
              <div className={styles.heroAmount}>
                <AnimatedValue value={result.savings} format={fmt} />
              </div>
              <div className={styles.heroMeta}>
                <span
                  className={`${styles.roiPill} ${netIsPositive ? styles.roiPillPositive : styles.roiPillNegative}`}
                >
                  <span className={styles.roiPillIcon} aria-hidden="true">
                    <IconTrendingUp />
                  </span>
                  <AnimatedValue value={result.roi} format={fmtRoi} />
                  <span className={styles.roiPillUnit}>ROI</span>
                </span>
                <span className={styles.heroSubLabel}>in the first year</span>
              </div>
            </div>

            {/* Metrics grid */}
            <div className={styles.metricsGrid}>
              <MetricCard
                icon={<IconClock />}
                label="Hours You'll Save"
                value={<AnimatedValue value={result.hrsSaved} format={fmtHrs} />}
                sub="annually"
              />
              <MetricCard
                icon={<IconCalendar />}
                label="Monthly Benefit"
                labelTooltip="Your net savings each month, after paying for Boldteq."
                value={
                  <AnimatedValue
                    value={result.monthlyBenefit}
                    format={fmtSigned}
                    signed
                  />
                }
                sub="after plan cost"
              />
              <MetricCard
                icon={<IconTrendingUp />}
                label="Productivity Boost"
                value={
                  <AnimatedValue value={result.prodGain} format={fmtPct} />
                }
                sub="of total work hours"
              />
              <MetricCard
                icon={<IconDollarCircle />}
                label="Your Total Gain"
                value={
                  <AnimatedValue value={result.net} format={fmtSigned} signed />
                }
                highlight={netIsPositive}
                sub="net, after plan cost"
              />
            </div>

            {/* Plan summary — the bottom line */}
            <div className={styles.planSummary}>
              <div className={styles.summaryTitle}>The Bottom Line</div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>What You&apos;ll Pay</span>
                <span className={styles.summaryValue}>
                  <AnimatedValue value={result.bmo} format={fmt} />
                  /mo
                  <span className={styles.summaryDot}>·</span>
                  <AnimatedValue value={result.byr} format={fmt} />
                  /yr
                </span>
              </div>
              <div className={styles.summaryDivider} />
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Money You Keep</span>
                <span className={styles.summaryValue}>
                  <AnimatedValue value={result.net} format={fmtSigned} signed />
                </span>
              </div>
            </div>

            {/* CTA card */}
            <div className={styles.ctaCard}>
              {result.savings > 0 && (
                <div className={styles.ctaCheck}>
                  <span className={styles.ctaCheckIcon} aria-hidden="true">
                    <IconCheck />
                  </span>
                  <span>
                    You could save{" "}
                    <span className={styles.ctaCheckAmount}>
                      <AnimatedValue value={result.savings} format={fmt} />
                    </span>{" "}
                    this year
                  </span>
                </div>
              )}
              <div className={styles.ctaTitle}>Ready to unlock your savings?</div>
              <p className={styles.ctaSubtitle}>
                Book a free 15-minute demo and we&apos;ll walk through your exact
                numbers — no commitment, no pressure.
              </p>
              <Link href="/book-a-demo" className={styles.ctaButton}>
                Schedule a Free Demo
                <span className={styles.ctaButtonArrow} aria-hidden="true">
                  <IconArrowRight />
                </span>
              </Link>
              <Link href="/contact" className={styles.ctaChat}>
                Have questions? <span>Chat with our team →</span>
              </Link>
              <div className={styles.trustBadges}>
                <span className={styles.trustBadge}>
                  <span className={styles.trustBadgeIcon} aria-hidden="true">
                    <IconLock />
                  </span>
                  No credit card
                </span>
                <span className={styles.trustBadge}>
                  <span className={styles.trustBadgeIcon} aria-hidden="true">
                    <IconClock />
                  </span>
                  15-min call
                </span>
                <span className={styles.trustBadge}>
                  <span className={styles.trustBadgeIcon} aria-hidden="true">
                    <IconRefresh />
                  </span>
                  Cancel anytime
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
