import { Rain } from "../../rain/Rain";
import BookCarousel from "../../home/BookCarousel/BookCarousel";
import styles from "./startupPage.module.css";
import BentoGrid from "../../home/bento/BentoGrid";

function StartupPage() {
  return (
    <div className={styles.pageContainer}>
      <Rain />

      <div className={styles.contentWrap}>
        <BookCarousel />
        <BentoGrid />
      </div>
    </div>
  );
}

export default StartupPage;
