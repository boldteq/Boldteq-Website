"use client";

import { useState, useMemo, useRef, useEffect, useId } from "react";
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
  laborSaved: number;
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
  return `linear-gradient(to right, #019ae6 0%, #019ae6 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`;
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function Tooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <span className={styles.tooltipWrap}>
      <button
        type="button"
        className={styles.tooltipBtn}
        aria-describedby={visible ? id : undefined}
        aria-label="More information"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        ?
      </button>
      {visible && (
        <span role="tooltip" id={id} className={styles.tooltipBubble}>
          {text}
        </span>
      )}
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
  label: string;
  value: string;
  sub?: string;
}

function MetricCard({ label, value, sub }: MetricCardProps) {
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricLabel}>{label}</div>
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
      laborSaved,
      savings,
      net,
      roi,
      monthlyBenefit,
      hrsSaved,
      prodGain,
    };
  }, [state]);

  const netIsPositive = result.net >= 0;

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
          <div className={styles.eyebrowBadge}>ROI Calculator</div>
          <h2 id="roi-calc-heading" className={styles.title}>
            See Your Real Savings Before You Commit
          </h2>
          <p className={styles.subtitle}>
            Adjust the inputs to match your team. We&apos;ll show exactly how
            much Boldteq saves you annually compared to hiring.
          </p>
        </div>

        {/* Preset buttons */}
        <div className={styles.presets}>
          {(Object.keys(ROI_PRESETS) as PresetKey[]).map((key) => {
            const { label, emoji } = ROI_PRESET_META[key];
            const preset = ROI_PRESETS[key];
            const isActive =
              state.plan === preset.plan &&
              state.teamSize === preset.teamSize &&
              state.manualHours === preset.manualHours;

            return (
              <button
                key={key}
                type="button"
                className={`${styles.presetBtn} ${isActive ? styles.presetBtnActive : ""}`}
                onClick={() => applyPreset(key)}
              >
                <span aria-hidden="true">{emoji}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Two-column layout */}
        <div className={styles.layout}>
          {/* LEFT: Inputs */}
          <div className={styles.leftPanel}>
            <div className={styles.panelTitle}>Tell us about your team</div>

            {/* Plan Selection block */}
            <div className={styles.planBlock}>
              {/* Billing toggle */}
              <div className={styles.billingToggle}>
                {(Object.keys(BILLING_LABELS) as BillingPeriod[]).map((b) => (
                  <button
                    key={b}
                    type="button"
                    className={`${styles.billingBtn} ${state.billing === b ? styles.billingBtnActive : ""}`}
                    onClick={() => patch({ billing: b })}
                  >
                    <span>{BILLING_LABELS[b]}</span>
                    {BILLING_BADGES[b] && (
                      <span className={styles.billingBadge}>
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
                  >
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
                <span className={styles.badge}>{state.teamSize} people</span>
              </div>
              <input
                id={teamSizeId}
                ref={teamSizeRef}
                type="range"
                min={1}
                max={200}
                step={1}
                value={state.teamSize}
                onChange={(e) => patch({ teamSize: Number(e.target.value) })}
                className={styles.slider}
              />
              <div className={styles.sliderRange}>
                <span>1</span>
                <span>200</span>
              </div>
            </div>

            {/* Hours per week slider */}
            <div className={styles.field}>
              <div className={styles.fieldHeader}>
                <label htmlFor={manualHoursId} className={styles.fieldLabel}>
                  Hours / week on manual tasks
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
              label="Average Hourly Rate"
              tooltip={ROI_FIELD_TOOLTIPS.hourlyRate}
              value={state.hourlyRate}
              min={10}
              onChange={(v) => patch({ hourlyRate: v })}
            />

            {/* Tool cost dollar input */}
            <DollarField
              label="Annual Tool & Contractor Cost"
              tooltip={ROI_FIELD_TOOLTIPS.toolCost}
              value={state.toolCost}
              min={0}
              onChange={(v) => patch({ toolCost: v })}
            />
          </div>

          {/* RIGHT: Results */}
          <div className={styles.rightPanel}>
            {/* Hero savings card */}
            <div className={styles.heroCard}>
              <div className={styles.heroLabel}>
                Your Estimated Annual Savings
              </div>
              <div
                className={`${styles.heroAmount} ${netIsPositive ? styles.heroAmountPositive : styles.heroAmountNegative}`}
              >
                {fmt(result.savings)}
              </div>
              <div className={styles.heroMeta}>
                <span
                  className={`${styles.roiPill} ${netIsPositive ? styles.roiPillPositive : styles.roiPillNegative}`}
                >
                  {fmtRoi(result.roi)} ROI
                </span>
                <span className={styles.heroSubLabel}>in the first year</span>
              </div>
            </div>

            {/* Metrics grid */}
            <div className={styles.metricsGrid}>
              <MetricCard
                label="Hours Saved"
                value={fmtHrs(result.hrsSaved)}
                sub="annually"
              />
              <MetricCard
                label="Monthly Benefit"
                value={fmt(result.monthlyBenefit)}
                sub="after plan cost"
              />
              <MetricCard
                label="Productivity Boost"
                value={fmtPct(result.prodGain)}
                sub="of total work hrs"
              />
              <MetricCard
                label="Total Gain"
                value={fmt(result.net)}
                sub="net over plan cost"
              />
            </div>

            {/* Plan summary */}
            <div className={styles.planSummary}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>What You&apos;ll Pay</span>
                <span className={styles.summaryValue}>
                  {fmt(result.byr)}/yr
                </span>
              </div>
              <div className={styles.summaryDivider} />
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Money You Keep</span>
                <span
                  className={`${styles.summaryValue} ${netIsPositive ? styles.summaryPositive : styles.summaryNegative}`}
                >
                  {fmt(result.net)}
                </span>
              </div>
            </div>

            {/* CTA card */}
            <div className={styles.ctaCard}>
              <div className={styles.ctaHeadline}>
                You could save{" "}
                <span className={styles.ctaHighlight}>
                  {fmt(result.savings)}
                </span>{" "}
                this year
              </div>
              <p className={styles.ctaSubtitle}>
                Stop paying {fmt(result.laborSaved)} in labor on tasks Boldteq
                handles end-to-end.
              </p>
              <a
                href="/book-a-demo"
                className={styles.ctaButton}
              >
                Schedule a Free Demo
              </a>
              <div className={styles.trustBadges}>
                <span className={styles.trustBadge}>14-day guarantee</span>
                <span className={styles.trustBadgeDot} aria-hidden="true" />
                <span className={styles.trustBadge}>No lock-in</span>
                <span className={styles.trustBadgeDot} aria-hidden="true" />
                <span className={styles.trustBadge}>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
