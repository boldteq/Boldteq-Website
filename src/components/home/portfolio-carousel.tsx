'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import styles from './portfolio-carousel.module.css';

interface Slide {
  label: string;
  labelVariant: string;
  cardVariant: string;
  imageOuterVariant: string;
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
}

const SLIDES: Slide[] = [
  {
    label: 'Shopify',
    labelVariant: 'heading-3-green',
    cardVariant: 'cream',
    imageOuterVariant: 'green',
    imageSrc: '/images/webflow/69662a202a4c0d57bdf2c10b_Home.png',
    imageAlt: 'Portfolio Image',
    imageWidth: 843,
    imageHeight: 690,
  },
  {
    label: 'WordPress',
    labelVariant: 'heading-3-green-light',
    cardVariant: 'light-green',
    imageOuterVariant: 'green-light',
    imageSrc: '/images/webflow/Travel.png',
    imageAlt: 'TravelPerk corporate travel management website template built by Boldteq',
    imageWidth: 840,
    imageHeight: 690,
  },
  {
    label: 'Figma UI/UX Design',
    labelVariant: 'heading-3-purple',
    cardVariant: 'light-purple',
    imageOuterVariant: 'orange-light',
    imageSrc: '/images/webflow/Home-1.png',
    imageAlt: 'Dynamic lifestyle brand website template built by Boldteq',
    imageWidth: 843,
    imageHeight: 690,
  },
  {
    label: 'Banners',
    labelVariant: 'heading-3-orange',
    cardVariant: 'light-orange',
    imageOuterVariant: 'olive-green',
    imageSrc: '/images/webflow/Group-7.png',
    imageAlt: 'Beauty and skincare product website template built by Boldteq',
    imageWidth: 807,
    imageHeight: 690,
  },
];

// Duplicate for seamless loop
const ALL_SLIDES = [...SLIDES, ...SLIDES];

export function PortfolioCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    dragFree: false,
    slidesToScroll: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap() % SLIDES.length);
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  return (
    <section
      className={`${styles['section-regular-2']} ${styles['img-slider-sec']}`}
    >
      <div className={`${styles['column-4x-large']} ${styles['column-4x-large-centered']}`}>
        {/* Slider container — relative for arrow positioning */}
        <div className={styles['sliderRelative']}>
          {/* Embla viewport */}
          <div ref={emblaRef} className={styles['gallery-13-mask']}>
            {/* Track */}
            <div className={styles['gallery-13-track']}>
              {ALL_SLIDES.map((slide, i) => (
                <div
                  key={`${slide.label}-${i}`}
                  className={styles['gallery-13-slide']}
                >
                  <div
                    className={`${styles['gallery-13-card']} ${styles[slide.cardVariant]}`}
                  >
                    {/* Image outer */}
                    <div
                      className={`${styles['gallery-image-outer']} ${styles[slide.imageOuterVariant]}`}
                    >
                      <Image
                        src={slide.imageSrc}
                        alt={slide.imageAlt}
                        width={slide.imageWidth}
                        height={slide.imageHeight}
                        loading="lazy"
                        className={`${styles['image-cover']} ${styles['radius-0']}`}
                      />
                    </div>
                    {/* Caption */}
                    <div className={styles['gallery-13-caption']}>
                      <div className={`${styles['heading-3']} ${styles[slide.labelVariant]}`}>
                        {slide.label}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prev button */}
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous slide"
            className={`${styles['gallery-13-button']} ${styles['button-left']}`}
          >
            <div className={styles['icon-button-outline-large']}>
              <span className={`${styles['icon-regular']} ${styles['icon-blue']}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z" fill="currentColor" />
                </svg>
              </span>
            </div>
          </button>

          {/* Next button */}
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next slide"
            className={`${styles['gallery-13-button']} ${styles['button-right']}`}
          >
            <div className={styles['icon-button-outline-large']}>
              <span className={`${styles['icon-regular']} ${styles['icon-blue']}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" fill="currentColor" />
                </svg>
              </span>
            </div>
          </button>
        </div>

        {/* Dot navigation */}
        <div className={styles['slider-dots']}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`${styles['slider-dot']}${i === selectedIndex ? ` ${styles['slider-dot-active']}` : ''}`}
            />
          ))}
        </div>
      </div>

      <div className={styles['container-large-2']} />
    </section>
  );
}
