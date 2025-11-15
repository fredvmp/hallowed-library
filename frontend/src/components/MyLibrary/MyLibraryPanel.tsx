import React, { useEffect, useState } from "react";
import styles from "./MyLibraryPanel.module.css";

interface FavItem {
  volumeId: string;
  title: string;
  miniature?: string;
  authors?: string[];
}

export default function MyLibraryPanel() {
  const [items, setItems] = useState<FavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyLibrary = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No user");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/me/library", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("HTTP " + res.status);

      const data = await res.json();
      setItems(data || []);
    } catch (err: any) {
      setError(err.message || "Error loading My Library");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLibrary();
  }, []);

  const toggleFavorite = async (volumeId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const isFav = items.some((i) => i.volumeId === volumeId);

    try {
      if (isFav) {
        await fetch(`http://localhost:8080/api/me/library/${volumeId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        setItems((prev) => prev.filter((i) => i.volumeId !== volumeId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading library...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (items.length === 0)
    return <p className={styles.empty}>Ups, there aren't books here.</p>;

  return (
    <div className={styles.container}>
      <h3>My Library</h3>

      <div className={styles.grid}>
        {items.map((item) => (
          <article key={item.volumeId} className={styles.card}>
            <a href={`/library/${item.volumeId}`} className={styles.cardLink}>
              <div className={styles.imageWrapper}>
                {item.miniature ? (
                  <img
                    src={item.miniature}
                    alt={item.title}
                    className={styles.image}
                  />
                ) : (
                  <div className={styles.noImage}>No image available</div>
                )}
              </div>

              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.author}>
                {item.authors?.length ? item.authors.join(", ") : "Unknown Author"}
              </p>
            </a>

            <button
              className={`${styles.favoriteButton} ${styles.active}`}
              onClick={() => toggleFavorite(item.volumeId)}
              title="Remove from favorites"
            >
              ❤️
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
