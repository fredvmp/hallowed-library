import ProfilePanel from "../../panels/ProfilePanel/ProfilePanel";
import { Rain } from "../../rain/Rain";
import styles from "./ProfilePage.module.css";

function ProfilePage() {
  return (
    <div className={styles.pageContainer}>
      <Rain />
      <ProfilePanel />
    </div>
  );
}

export default ProfilePage;
