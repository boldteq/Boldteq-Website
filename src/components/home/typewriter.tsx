'use client';

import { useEffect, useState } from 'react';
import styles from './hero.module.css';

const PHRASES = ['Ownership Driven', 'Without Hiring', 'On Demand'] as const;

/**
 * Typewriter — SSR-safe phrase cycler.
 *
 * Hydration contract:
 *   • Server renders index=0 ("Ownership Driven"), no fade class.
 *   • First client render also renders index=0 with no fade class.
 *   • DOM bytes match → no hydration mismatch.
 *   • After mount, useEffect kicks the interval and adds the fade class on swap.
 */
export function Typewriter() {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;
    const raf = requestAnimationFrame(() => setAnimate(true));
    const id = setInterval(() => {
      setIndex((p) => (p + 1) % PHRASES.length);
    }, 2400);
    return () => { cancelAnimationFrame(raf); clearInterval(id); };
  }, []);

  return (
    <span
      aria-live="polite"
      aria-atomic="true"
      className={styles['typewriterContainer']}
    >
      <span
        key={index}
        className={`${styles['animate-span']} ${styles['typewriterWord']}${
          animate ? ` ${styles['typewriterFade']}` : ''
        }`}
      >
        {PHRASES[index]}
      </span>
    </span>
  );
}
