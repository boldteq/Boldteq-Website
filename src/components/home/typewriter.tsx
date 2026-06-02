'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './hero.module.css';

const PHRASES = ['Ownership Driven', 'Without Hiring', 'On Demand'] as const;

/** Webflow typewriter timing (verbatim from boldteq-v1-0.webflow/index.html lines 2779-2828) */
const TYPE_SPEED_MS = 200;
const DELETE_SPEED_MS = 100; // typeSpeed / 2
const END_OF_PHRASE_PAUSE_MS = 2000;
const BEFORE_NEXT_PHRASE_PAUSE_MS = 500;
const INITIAL_DELAY_MS = 1000;

/**
 * Typewriter — Webflow-parity character-by-character typer.
 *
 * Mirrors the Webflow script:
 *   - Type each char with 200ms cadence
 *   - When full phrase shown, pause 2000ms
 *   - Delete each char with 100ms cadence
 *   - When empty, pause 500ms, advance to next phrase
 *   - Initial 1000ms delay before first type
 *
 * SSR contract: renders the first phrase fully (matches Webflow's static
 * server HTML `<span class="animate-span">Ownership Driven</span>`). The
 * typewriter only kicks in on the client via useEffect — so DOM bytes match
 * during hydration and there is no flash/mismatch.
 *
 * Respects prefers-reduced-motion: when set, the first phrase remains
 * visible and the loop never starts.
 */
export function Typewriter() {
  const [text, setText] = useState<string>(PHRASES[0]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    let textIndex = 0;
    let charIndex = PHRASES[0].length;
    let isDeleting = false;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const currentText = PHRASES[textIndex];
      let nextSpeed: number;

      if (isDeleting) {
        charIndex -= 1;
        setText(currentText.substring(0, charIndex));
        nextSpeed = DELETE_SPEED_MS;
        if (charIndex === 0) {
          // Fully deleted → advance to next phrase, pause before retyping.
          isDeleting = false;
          textIndex = (textIndex + 1) % PHRASES.length;
          nextSpeed = BEFORE_NEXT_PHRASE_PAUSE_MS;
        }
      } else if (charIndex === currentText.length) {
        // Fully typed (incl. the SSR-seeded first phrase) → pause, then delete.
        // Checked BEFORE incrementing so we never overshoot the length.
        isDeleting = true;
        nextSpeed = END_OF_PHRASE_PAUSE_MS;
      } else {
        charIndex += 1;
        setText(currentText.substring(0, charIndex));
        nextSpeed = TYPE_SPEED_MS;
      }

      timeoutRef.current = setTimeout(tick, nextSpeed);
    };

    timeoutRef.current = setTimeout(tick, INITIAL_DELAY_MS);

    return () => {
      cancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <span
      aria-live="polite"
      aria-atomic="true"
      className={`${styles['animate-span']} ${styles['typewriterContainer']}`}
    >
      {text}
    </span>
  );
}
