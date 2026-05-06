import Image from 'next/image';
import Link from 'next/link';
import { IconBox } from '@/components/primitives/icon-box/icon-box';
import styles from './feature-grid.module.css';
import type { FeatureGridProps, FeatureItem, FeatureGridVariant } from './feature-grid.types';

const ITEM_CLASS: Record<FeatureGridVariant, string> = {
  card: styles['item-card'],
  minimal: styles['item-minimal'],
  horizontal: styles['item-horizontal'],
};

function FeatureCard({ item, variant }: { item: FeatureItem; variant: FeatureGridVariant }) {
  const itemClass = ITEM_CLASS[variant];

  return (
    <div className={itemClass}>
      {item.icon ? (
        <div className={styles['icon']}>
          <IconBox variant="square-tint" size="md">{item.icon}</IconBox>
        </div>
      ) : null}

      <div>
        <h3 className={styles['title']}>{item.title}</h3>
        {item.description ? (
          <p className={styles['desc']}>{item.description}</p>
        ) : null}
        {item.href && item.hrefLabel ? (
          <Link href={item.href} className={styles['cta']}>
            {item.hrefLabel} →
          </Link>
        ) : null}
      </div>

      {item.imageSrc ? (
        <div className={styles['image']}>
          <Image
            src={item.imageSrc}
            alt={item.imageAlt ?? item.title}
            width={item.imageWidth ?? 600}
            height={item.imageHeight ?? 400}
            style={{ width: '100%', height: 'auto' }}
            loading="lazy"
          />
        </div>
      ) : null}
    </div>
  );
}

export function FeatureGrid({
  items,
  cols = 3,
  variant = 'card',
  className,
}: FeatureGridProps) {
  const gridClass = [
    styles['grid'],
    styles[`cols-${cols}`],
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={gridClass}>
      {items.map((item, i) => (
        <FeatureCard key={i} item={item} variant={variant} />
      ))}
    </div>
  );
}
