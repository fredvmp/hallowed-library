import React, { useEffect, useState } from "react";
import styles from "./Library.module.css";

interface BookDto {
  id?: string;
  title: string;
  authors: string[];
  thumbnail?: string;
}

const Library: React.FC = () => {
  const [books, setBooks] = useState<BookDto[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchAndSetBooks = async (q: string) => {
    if (!q.trim()) {
      setBooks([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:8080/api/books/search?q=${encodeURIComponent(q)}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: BookDto[] = await res.json();

      // Filtrar libros con título válido
      const validBooks = data.filter((b) => b.title && b.title.trim() !== "");
      setBooks(validBooks);
    } catch (err: any) {
      console.error("Error fetching books:", err);
      setError(err.message || "Error searching books");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetBooks(query);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetchAndSetBooks(query);
  };

  return (
    <div className={styles.container}>
      {/* Contenedor buscador */}
      <form className={styles.searchContainer} onSubmit={handleSubmit}>
        <div className={styles.searchForm}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search by title, author, ISBN..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className={styles.searchButton}
            type="submit"
            disabled={loading}
          >
            {/* {loading ? "..." : "Search"} */}
            {loading ? "Search" : "Search"}
          </button>
        </div>
      </form>

      {/* Mensajes de error o vacío */}
      {error && <p className={styles.error}>{error}</p>}
      {!error && !loading && books.length === 0 && (
        <h2 className={styles.empty}>No results</h2>
      )}

      {/* Grid de tarjetas */}
      <div className={styles.grid}>
        {books.map((book, idx) => {
          const key = book.id ?? `${book.title}-${idx}`;

          return (
            <article key={key} className={styles.card}>
              <div className={styles.imageWrapper}>
                {book.thumbnail ? (
                  <img
                    src={book.thumbnail}
                    alt={book.title}
                    className={styles.image}
                  />
                ) : (
                  <div className={styles.noImage}>No image available</div>
                )}
              </div>
              <h3 className={styles.title}>{book.title}</h3>
              <p className={styles.author}>
                {book.authors && book.authors.length > 0
                  ? book.authors.join(", ")
                  : "Author unknown"}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Library;
