import React, { useEffect, useState } from "react";
import styles from "./Library.module.css";
import { useSearchParams, Link } from "react-router-dom";

interface BookDto {
  id?: string;
  title: string;
  authors: string[];
  miniature?: string;
}

const Library: React.FC = () => {
  const [books, setBooks] = useState<BookDto[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState<string>(initialQuery);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [favoritesSet, setFavoritesSet] = useState<Set<string>>(new Set());

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

  // Cargar favoritos del backend
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      (async () => {
        try {
          const res = await fetch("http://localhost:8080/api/me/library", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) {
            console.warn("Favorites could not be loaded:", res.status);
            return;
          }
          const data: Array<{ volumeId: string }> = await res.json();
          const favSet = new Set<string>(data.map((x) => x.volumeId));
          setFavoritesSet(favSet);
        } catch (err) {
          console.error("Error loading favorites", err);
        }
      })();
    }

    if (initialQuery) {
      fetchAndSetBooks(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchParams({ q: query });
    await fetchAndSetBooks(query);
  };

  const toggleFavorite = async (bookId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to save favorites");
      return;
    }

    const isFav = favoritesSet.has(bookId);
    const newSet = new Set(favoritesSet);

    try {
      if (isFav) {
        // Quitar de favoritos
        await fetch(`http://localhost:8080/api/me/library/${bookId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        newSet.delete(bookId);
      } else {
        // Añadir a favoritos
        await fetch(`http://localhost:8080/api/me/library/${bookId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        newSet.add(bookId);
      }
      setFavoritesSet(newSet);
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  // alternar botón favorito
  const handleToggleFavorite = async (book: BookDto) => {
    if (!book.id) {
      console.warn("Book has no id, cannot favorite");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to save favorites");
      return;
    }

    const alreadyFavorite = favoritesSet.has(book.id);
    try {
      if (alreadyFavorite) {
        // DELETE
        const res = await fetch(
          `http://localhost:8080/api/me/library/${encodeURIComponent(book.id)}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          // no actualizar si falla
          console.error("Failed to remove favorite", res.status);
          return;
        }
        // actualizar set local
        setFavoritesSet((prev) => {
          const copy = new Set(prev);
          copy.delete(book.id!);
          return copy;
        });
      } else {
        // POST
        const res = await fetch("http://localhost:8080/api/me/library", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            volumeId: book.id,
            title: book.title,
            miniature: book.miniature,
            authors: book.authors || [],
          }),
        });
        if (!res.ok) {
          console.error("Failed to add favorite", res.status);
          return;
        }
        // OK -> actualizar set local
        setFavoritesSet((prev) => {
          const copy = new Set(prev);
          copy.add(book.id!);
          return copy;
        });
      }
    } catch (err) {
      console.error("Error updating favorite:", err);
    }
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
          const isFav = book.id ? favoritesSet.has(book.id) : false;

          return (
            <article key={key} className={styles.card}>
              <Link to={`/library/${key}`} className={styles.cardLink}>
                <div className={styles.imageWrapper}>
                  {book.miniature ? (
                    <img
                      src={book.miniature}
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
              </Link>

              {/* Botón de favoritos */}
              {book.id && (
                <button
                  className={`${styles.favoriteButton} ${
                    isFav ? styles.active : ""
                  }`}
                  onClick={() => handleToggleFavorite(book)}
                  title={isFav ? "Remove from favorites" : "Add to favorites"}
                >
                  {isFav ? "❤️" : "🤍"}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Library;
