'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './InfiniteScrollSection.module.scss';

export interface ScrollCard {
  name: string;
  image: string;
  description: string;
  url: string;
}

interface InfiniteScrollSectionProps {
  title: string;
  cards: ScrollCard[];
}

export default function InfiniteScrollSection({ title, cards }: InfiniteScrollSectionProps) {
  return (
    <section className={styles.scrollSection} aria-labelledby="cards-grid-title">
      <h2 id="cards-grid-title">{title}</h2>
      <div className={styles.cardsWrapper} role="list">
        {cards && cards.length > 0 ? (
          cards.map((card, i) => (
            <Link
              key={i}
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
              role="listitem"
            >
              <div className={styles.cardImage}>
                <Image
                  src={card.image}
                  alt={card.name}
                  width={320}
                  height={180}
                  sizes="(max-width: 768px) 48vw, 250px"
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  priority={false}
                />
              </div>

              <h3>{card.name}</h3>
              <p>{card.description}</p>
            </Link>
          ))
        ) : (
          <div className={styles.emptyState}>No items to display.</div>
        )}
      </div>
    </section>
  );
}
