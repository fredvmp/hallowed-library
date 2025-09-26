import { Rain } from "../../rain/Rain";
import styles from "./startupPage.module.css";

function StartupPage() {
  return (
    <>
      <div className={styles.pageContainer}>
        <Rain />

        <div className={styles.provisionalWrap}>
          <h2>In progress...</h2>
        </div>
      </div>
    </>
  );
}

export default StartupPage;
