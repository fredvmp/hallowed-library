package com.hallowedlibrary.backend.services;

import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hallowedlibrary.backend.dto.BookDto;

/**
 * Servicio que actúa como cliente hacia Google Books API
 * - Construye las URLs
 * - Llama a Google (RestTemplate)
 * - Recibe un JSON y devuelve List<BookDto>
 */
@Service
public class BooksService {

    private static final Logger logger = LoggerFactory.getLogger(BooksService.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String apiKey;

    public BooksService(RestTemplateBuilder builder,
                        ObjectMapper objectMapper,
                        @Value("${google.books.api.key:}") String apiKey) {
        this.restTemplate = builder.build();
        this.objectMapper = objectMapper;
        this.apiKey = (apiKey == null) ? "" : apiKey.trim();
    }

    /**
     * Buscar libros en Google Books
     * q puede ser una query compuesta
     * startIndex y maxResults controlan paginación
     */
    public List<BookDto> searchBooks(String q, int startIndex, int maxResults) throws Exception {
        if (q == null || q.isBlank()) {
            // Query por defecto para no devolver nada masivo; se puede ajustar
            q = "subject:fiction";
        }

        // Máximo 30 páginas
        if (maxResults <= 0) maxResults = 20;
        if (maxResults > 40) maxResults = 30;

        URI uri = UriComponentsBuilder
                .fromHttpUrl("https://www.googleapis.com/books/v1/volumes")
                .queryParam("q", q)
                .queryParam("startIndex", Math.max(0, startIndex))
                .queryParam("maxResults", maxResults)
                .queryParam("key", apiKey)
                .build()
                .encode()
                .toUri();

        logger.debug("Google Books search URI: {}", uri);

        String json = restTemplate.getForObject(uri, String.class);
        if (json == null || json.isBlank()) return Collections.emptyList();

        JsonNode root = objectMapper.readTree(json);
        JsonNode items = root.path("items");
        if (!items.isArray()) return Collections.emptyList();

        List<BookDto> results = new ArrayList<>();
        for (JsonNode item : items) {
            String id = item.path("id").asText(null);
            JsonNode vol = item.path("volumeInfo");

            String title = vol.path("title").asText(null);
            // autores
            List<String> authors = new ArrayList<>();
            if (vol.has("authors") && vol.get("authors").isArray()) {
                for (JsonNode a : vol.get("authors")) authors.add(a.asText());
            }

            String publisher = vol.path("publisher").asText(null);
            String publishedDate = vol.path("publishedDate").asText(null);
            String description = vol.path("description").asText(null);

            // categorías
            List<String> categories = new ArrayList<>();
            if (vol.has("categories") && vol.get("categories").isArray()) {
                for (JsonNode c : vol.get("categories")) categories.add(c.asText());
            }

            // imagen (thumbnail)
            String thumbnail = null;
            JsonNode imageLinks = vol.path("imageLinks");
            if (!imageLinks.isMissingNode()) {
                thumbnail = imageLinks.path("thumbnail").asText(null);
                if (thumbnail == null) thumbnail = imageLinks.path("smallThumbnail").asText(null);
            }

            // ISBNs
            String isbn13 = null;
            String isbn10 = null;
            JsonNode industry = vol.path("industryIdentifiers");
            if (industry.isArray()) {
                for (JsonNode ident : industry) {
                    String type = ident.path("type").asText("");
                    String identifier = ident.path("identifier").asText("");
                    if ("ISBN_13".equalsIgnoreCase(type)) isbn13 = identifier;
                    if ("ISBN_10".equalsIgnoreCase(type)) isbn10 = identifier;
                }
            }

            BookDto dto = new BookDto(id, title, authors, publisher, publishedDate, description, categories, thumbnail, isbn13, isbn10);
            results.add(dto);
        }

        return results;
    }

    /**
     * Obtiene información de un volumen por su ID (Google volume id)
     */
    public BookDto getBookById(String volumeId) throws Exception {
        if (volumeId == null || volumeId.isBlank()) return null;

        URI uri = UriComponentsBuilder
                .fromHttpUrl("https://www.googleapis.com/books/v1/volumes/" + volumeId)
                .queryParam("key", apiKey)
                .build()
                .encode()
                .toUri();

        logger.debug("Google Books getById URI: {}", uri);

        String json = restTemplate.getForObject(uri, String.class);
        if (json == null || json.isBlank()) return null;

        JsonNode item = objectMapper.readTree(json);
        if (item.isMissingNode()) return null;

        JsonNode vol = item.path("volumeInfo");

        String id = item.path("id").asText(null);
        String title = vol.path("title").asText(null);

        List<String> authors = new ArrayList<>();
        if (vol.has("authors") && vol.get("authors").isArray()) {
            for (JsonNode a : vol.get("authors")) authors.add(a.asText());
        }

        String publisher = vol.path("publisher").asText(null);
        String publishedDate = vol.path("publishedDate").asText(null);
        String description = vol.path("description").asText(null);

        List<String> categories = new ArrayList<>();
        if (vol.has("categories") && vol.get("categories").isArray()) {
            for (JsonNode c : vol.get("categories")) categories.add(c.asText());
        }

        String thumbnail = null;
        JsonNode imageLinks = vol.path("imageLinks");
        if (!imageLinks.isMissingNode()) {
            thumbnail = imageLinks.path("thumbnail").asText(null);
            if (thumbnail == null) thumbnail = imageLinks.path("smallThumbnail").asText(null);
        }

        String isbn13 = null;
        String isbn10 = null;
        JsonNode industry = vol.path("industryIdentifiers");
        if (industry.isArray()) {
            for (JsonNode ident : industry) {
                String type = ident.path("type").asText("");
                String identifier = ident.path("identifier").asText("");
                if ("ISBN_13".equalsIgnoreCase(type)) isbn13 = identifier;
                if ("ISBN_10".equalsIgnoreCase(type)) isbn10 = identifier;
            }
        }

        return new BookDto(id, title, authors, publisher, publishedDate, description, categories, thumbnail, isbn13, isbn10);
    }
}
