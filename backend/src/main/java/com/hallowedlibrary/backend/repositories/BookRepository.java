package com.hallowedlibrary.backend.repositories;

import com.hallowedlibrary.backend.entities.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
}

