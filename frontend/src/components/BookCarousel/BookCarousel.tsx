import React, { useEffect, useState } from "react";
import styles from "./BookCarousel.module.css";

interface BookDto {
  id: string;
  title: string;
  authors: string[];
  miniature?: string;
}

const featuredISBNs = [
  "9788483835692",
  "9788401352799",
  "9788416542215",
  "9788483837108",
  "9788490691779",
  "9781689796828",
  "9788466363402",
  "9788401389412",
  "9786070764745",
  "9788466658898",
  
];

const VISIBLE_RANGE = 2; // central + 2 -> 5 visibles

const BookCarousel: React.FC = () => {
  const [books, setBooks] = useState<BookDto[]>([]);
  const [index, setIndex] = useState(0);

  // Cargar libros
  useEffect(() => {
    const fetchBooks = async () => {
      const results: (BookDto | null)[] = await Promise.all(
        featuredISBNs.map(async (isbn) => {
          try {
            const res = await fetch(
              `http://localhost:8080/api/books/isbn/${encodeURIComponent(isbn)}`
            );
            if (!res.ok) return null;
            const data = await res.json();
            if (!data || !data.id) return null;
            return {
              id: data.id,
              title: data.title || "Untitled",
              authors: data.authors || [],
              miniature: data.miniature || data.thumbnail || "",
            } as BookDto;
          } catch (e) {
            console.warn("Failed to load isbn", isbn, e);
            return null;
          }
        })
      );

      const filtered = results.filter((r): r is BookDto => r !== null);
      if (filtered.length > 0) {
        setBooks(filtered);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    if (books.length <= 1) return;
    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % books.length);
    }, 7000);
    return () => clearInterval(t);
  }, [books]);

  if (books.length === 0) return null;

  return (
    <div className={styles.carouselWrapper} aria-hidden={false}>
      {books.map((book, i) => {
        let raw = i - index;

        // ajustar rotación para que la distancia sea la mínima
        const half = Math.floor(books.length / 2);
        if (raw > half) raw -= books.length;
        if (raw < -half) raw += books.length;

        const offset = raw;

        // renderizar sólo los 5 visibles
        if (Math.abs(offset) > VISIBLE_RANGE) return null;

        // cálculos visuales del carousel
        const spacing = 300;
        const translateX = offset * spacing;
        const scale =
          offset === 0 ? 1.25 : Math.abs(offset) === 1 ? 1.05 : 0.85;
        const opacity = offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.9 : 0.45;
        const filter =
          Math.abs(offset) === 2 ? "blur(2px) saturate(0.7)" : "none";
        const zIndex = 100 - Math.abs(offset);

        const style: React.CSSProperties = {
          transform: `translateX(${translateX}px) scale(${scale})`,
          opacity,
          filter,
          zIndex,
        };

        return (
          <div key={book.id} className={styles.card} style={style}>
            <div className={styles.imageWrapper}>
              <img
                src={
                  book.miniature && book.miniature.length > 0
                    ? book.miniature
                    : "/placeholder_book.png"
                }
                alt={book.title}
                className={styles.image}
                loading="lazy"
              />
            </div>

            <div className={styles.textZone}>
              <h3 className={styles.title}>{book.title}</h3>
              <p className={styles.author}>{book.authors?.join(", ")}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookCarousel;
