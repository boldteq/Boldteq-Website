import styles from './built-for.module.css';

const ITEMS = [
  {
    number: '#1.',
    title: 'Starting Out',
    description: 'Winning clients is easy. You need reliable execution without full-time hires.',
  },
  {
    number: '#2.',
    title: 'Feeling Stretched',
    description: 'Your team is overloaded. Quality drops, deadlines slip, and opportunities are lost.',
  },
  {
    number: '#3.',
    title: 'Consistency',
    description: 'Repeatable systems keep quality stable, even as requests increase.',
  },
  {
    number: '#4.',
    title: '\u00a0Scaling Up',
    description: 'You need scalable capacity that adjusts to your workload.',
  },
] as const;

export function BuiltFor() {
  return (
    <section className={styles['built-seccc']}>
      <div className={styles['container-large-3']}>
        <h2 className={`${styles['heading-2']} ${styles['margin-bottom-24px']}`}>
          Who Is Boldteq Built For?
        </h2>
        <p className={`${styles['paragraph']} ${styles['center']}`}>
          Boldteq is designed to support agencies at different stages of growth &mdash; whether{' '}
          <br />
          you&apos;re just starting out or scaling fast without wanting to rebuild your team.
        </p>

        <div className={styles['built-3-grid-new']}>
          {ITEMS.map((item) => (
            <div key={item.number} className={styles['built-grid-outer-new']}>
              <div className={styles['build-grid-inndiv']}>
                <p className={styles['built-subheading']}>
                  <strong className={styles['color-mix-bold']}>{item.number}</strong> {item.title}
                </p>
                <p className={`${styles['paragraph-text-left']} ${styles['line-height-smaller']} ${styles['left-mob']}`}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
