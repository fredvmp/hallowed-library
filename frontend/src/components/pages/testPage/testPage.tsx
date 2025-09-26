import { useState, useEffect } from "react";
import styles from "./testPage.module.css";
import Navbar from "../../navbar/Navbar";
import { Rain } from "../../rain/Rain";

function TestPage() {
    const [users, setUsers] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users))
      .catch((err) => console.error(err));
  }, []);


  return (
    <>
      <div className={styles.pageContainer}>
        <Rain />

        <div className={styles.provisionalWrap}>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <strong>ID:</strong> {user.id} — <strong>Nombre:</strong> {user.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

    </>
  );
}

export default TestPage;