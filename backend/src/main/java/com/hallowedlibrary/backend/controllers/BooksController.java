package com.hallowedlibrary.backend.controllers;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hallowedlibrary.backend.dto.BookDto;
import com.hallowedlibrary.backend.services.BooksService;

/**
 * Endpoints públicos para buscar/obtener libros
 * - GET /api/books/search?q=...
 * - GET /api/books/{id}
 */
@RestController
@RequestMapping("/api/books")
public class BooksController {

    private static final Logger logger = LoggerFactory.getLogger(BooksController.class);

    private final BooksService booksService;

    public BooksController(BooksService booksService) {
        this.booksService = booksService;
    }

    /**
     * Buscar libros
     * Parámetros:
     *  - q (query libre) OR title / author / isbn
     *  - startIndex, maxResults (paginación)
     */
    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String isbn,
            @RequestParam(defaultValue = "0") int startIndex,
            @RequestParam(defaultValue = "20") int maxResults
    ) {
        try {
            String query;
            if (isbn != null && !isbn.isBlank()) {
                query = "isbn:" + isbn;
            } else if ((title != null && !title.isBlank()) || (author != null && !author.isBlank())) {
                StringBuilder sb = new StringBuilder();
                if (title != null && !title.isBlank()) sb.append("intitle:").append(title.replace(" ", "+"));
                if (author != null && !author.isBlank()) {
                    if (sb.length() > 0) sb.append("+");
                    sb.append("inauthor:").append(author.replace(" ", "+"));
                }
                query = sb.toString();
            } else if (q != null && !q.isBlank()) {
                query = q;
            } else {
                query = "subject:fiction";
            }

            List<BookDto> results = booksService.searchBooks(query, startIndex, maxResults);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            logger.error("Error search books", e);
            return ResponseEntity.status(500).body("Error buscando libros: " + e.getMessage());
        }
    }

    /**
     * Obtener un libro por su Google volume id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") String id) {
        try {
            BookDto book = booksService.getBookById(id);
            if (book == null) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(book);
        } catch (Exception e) {
            logger.error("Error getting book by id {}", id, e);
            return ResponseEntity.status(500).body("Error obteniendo libro: " + e.getMessage());
        }
    }
}
