import styles from "./BentoGrid.module.css";

import QuoteBlock from "./blocks/QuoteBlock";
import LibraryShortcutBlock from "./blocks/LibraryShortcutBlock";
import StatsBlock from "./blocks/StatsBlock";
import RandomBookBlock from "./blocks/RandomBookBlock";
import CurrentsBlock from "./blocks/CurrentsBlock";

export default function BentoGrid() {
  return (
    <section className={styles.bentoContainer}>
      <div className={styles.grid}>
        <div className={`${styles.card} ${styles.quote}`}>
          <QuoteBlock />
        </div>

        <div className={`${styles.card} ${styles.library}`}>
          <LibraryShortcutBlock />
        </div>

        <div className={`${styles.card} ${styles.stats}`}>
          <StatsBlock />
        </div>

        <div className={`${styles.card} ${styles.random}`}>
          <RandomBookBlock />
        </div>

        <div className={`${styles.card} ${styles.currents}`}>
          <CurrentsBlock />
        </div>
      </div>
    </section>
  );
}
