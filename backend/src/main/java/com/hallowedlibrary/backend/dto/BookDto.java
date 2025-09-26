package com.hallowedlibrary.backend.dto;

import java.util.List;

/**
 *  DTO para los libros
 */
public record BookDto(
        String id,
        String title,
        List<String> authors,
        String publisher,
        String publishedDate,
        String description,
        List<String> categories,
        String thumbnail,
        String isbn13,
        String isbn10

        
) {}
