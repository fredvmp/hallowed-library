import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./BookDetail.module.css";

interface BookDto {
  id?: string;
  title: string;
  authors: string[];
  miniature?: string;
  description?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
}

const BookDetail: React.FC = () => {
  // Obtener el id de la URL
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);

  // Obtener la información del libro desde el backend
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/books/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: BookDto = await res.json();
        setBook(data);
      } catch (err: any) {
        setError(err.message || "Error fetching book");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  useEffect(() => {
    const checkFavorite = async () => {
      const token = localStorage.getItem("token");
      if (!token || !id) return;

      try {
        const res = await fetch("http://localhost:8080/api/me/library", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;

        const favorites: Array<{ volumeId: string }> = await res.json();
        const found = favorites.some((f) => f.volumeId === id);
        setIsFavorite(found);
      } catch (err) {
        console.error("Error checking favorite:", err);
      }
    };

    checkFavorite();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!book || updating) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to use favorites.");
      return;
    }

    setUpdating(true);
    try {
      if (isFavorite) {
        const res = await fetch(
          `http://localhost:8080/api/me/library/${encodeURIComponent(book.id || "")}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          console.error("Failed to remove favorite", res.status);
        } else {
          setIsFavorite(false);
        }
      } else {
        const res = await fetch("http://localhost:8080/api/me/library", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            volumeId: id,
            title: book.title,
            miniature: book.miniature,
            authorsText: book.authors?.join(", ") || "Unknown Author",
            authors: book.authors || []
          }),
        });
        if (!res.ok) {
          console.error("Failed to add favorite", res.status);
        } else {
          setIsFavorite(true);
        }
      }
    } catch (err) {
      console.error("Error updating favorite:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!book) return <p className={styles.empty}>Book not found</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {book.miniature && (
          <img src={book.miniature} alt={book.title} className={styles.image} />
        )}
        <div className={styles.info}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{book.title}</h1>
            <button
              className={`${styles.favoriteButton} ${
                isFavorite ? styles.active : ""
              }`}
              onClick={handleToggleFavorite}
              disabled={updating}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? "❤️" : "🤍"}
            </button>
          </div>
          <p className={styles.authors}>
            {book.authors ? book.authors.join(", ") : "Unknown Author"}
          </p>
          <p className={styles.meta}>
            {book.publishedDate && <span>Published: {book.publishedDate}</span>}
            {book.pageCount && <span> · {book.pageCount} pages</span>}
          </p>
          {book.categories && (
            <p className={styles.categories}>
              Categories: {book.categories.join(", ")}
            </p>
          )}
        </div>
      </div>
      <div className={styles.description}>
        <h2>Description</h2>
        <div
          dangerouslySetInnerHTML={{
            __html: book.description || "<p>No description available.</p>",
          }}
        />
      </div>
    </div>
  );

};

export default BookDetail;
