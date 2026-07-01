'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './faq-accordion.module.css';
import type { FaqAccordionProps, FaqItem } from './faq-accordion.types';

function FaqRow({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);
  const panelId = `faq-panel-${index}`;
  const triggerId = `faq-trigger-${index}`;

  return (
    <div className={styles['item']}>
      <button
        id={triggerId}
        type="button"
        className={styles['toggle']}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span>{item.question}</span>
        <span className={styles['chevron']}>
          <Image
            src="/images/webflow/ion_chevron-back.svg"
            alt=""
            aria-hidden="true"
            width={24}
            height={24}
          />
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={`${styles['panel']}${open ? ` ${styles['open']}` : ''}`}
      >
        <div className={styles['panelInner']}>
          <p className={styles['answer']}>{item.answer}</p>
          {item.linkHref && item.linkLabel ? (
            <Link href={item.linkHref} className={styles['link']}>
              {item.linkLabel}
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                <path
                  d="M1.64376 1.00077H9.36014V8.71715M8.82428 1.53663L1.00073 9.36018"
                  stroke="url(#faq_arrow_grad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="faq_arrow_grad" x1="1.32225" y1="1.32228" x2="9.03863" y2="9.03866" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#21CFFF" />
                    <stop offset="1" stopColor="#019AE6" />
                  </linearGradient>
                </defs>
              </svg>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function FaqAccordion({
  items,
  layout = 'single',
  className,
}: FaqAccordionProps) {
  const listClass = [
    styles['list'],
    layout === 'double' ? styles['double'] : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={listClass} role="list">
      {items.map((item, i) => (
        <div key={item.question} role="listitem">
          <FaqRow item={item} index={i} />
        </div>
      ))}
    </div>
  );
}
