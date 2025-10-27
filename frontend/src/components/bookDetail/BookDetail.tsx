import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./BookDetail.module.css";

interface BookDto {
  id?: string;
  title: string;
  authors: string[];
  thumbnail?: string;
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

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!book) return <p className={styles.empty}>Book not found</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {book.thumbnail && (
          <img src={book.thumbnail} alt={book.title} className={styles.image} />
        )}
        <div className={styles.info}>
          <h1 className={styles.title}>{book.title}</h1>
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
