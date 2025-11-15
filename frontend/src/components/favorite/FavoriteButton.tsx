import React, { useState } from "react";
import styles from "./FavoriteButton.module.css";

interface Props {
  volumeId: string;
  initialFavorited?: boolean;
  onChange?: (favorited: boolean) => void;
}

export const FavoriteButton: React.FC<Props> = ({
  volumeId,
  initialFavorited = false,
  onChange,
}) => {
  const [favorited, setFavorited] = useState<boolean>(initialFavorited);
  const [loading, setLoading] = useState(false);

  // handle click: POST o DELETE según estado
  const toggle = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login"; // redirigir si no hay user
      return;
    }

    setLoading(true);
    try {
      if (!favorited) {
        // Añadir favorito
        await fetch("http://localhost:8080/api/me/library", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ volumeId }),
        });
        setFavorited(true);
        onChange?.(true);
      } else {
        // Borrar favorito
        await fetch(
          `http://localhost:8080/api/me/library/${encodeURIComponent(
            volumeId
          )}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFavorited(false);
        onChange?.(false);
      }
    } catch (err) {
      console.error("Favorite toggle error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`${styles.btn} ${favorited ? styles.fav : ""}`}
      onClick={toggle}
      disabled={loading}
      aria-pressed={favorited}
      title={favorited ? "Remove from My Library" : "Add to My Library"}
    >
      <span className={styles.heart} aria-hidden>
        {favorited ? "❤️" : "🤍"}
      </span>
    </button>
  );
};

export default FavoriteButton;
