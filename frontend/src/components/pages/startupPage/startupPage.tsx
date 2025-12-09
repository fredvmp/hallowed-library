import { Rain } from "../../rain/Rain";
import BookCarousel from "../../BookCarousel/BookCarousel";
import styles from "./startupPage.module.css";

function StartupPage() {
  return (
    <div className={styles.pageContainer}>
      <Rain />

      <div className={styles.contentWrap}>
        <BookCarousel />
      </div>
    </div>
  );
}

export default StartupPage;
