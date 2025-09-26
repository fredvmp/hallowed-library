import LoginPanel from "../../panels/LoginPanel/LoginPanel";
import SignUpPanel from "../../panels/SignUpPanel/SignUpPanel";
import styles from "./LoginPage.module.css";

function LoginPage() {
  return (
    <>
      <div className={styles.pageContainer}>
        <SignUpPanel />
        <LoginPanel />
      </div>
    </>
  );
}

export default LoginPage;
