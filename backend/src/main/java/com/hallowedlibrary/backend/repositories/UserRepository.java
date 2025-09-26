package com.hallowedlibrary.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hallowedlibrary.backend.entities.User;

/**
 * Repositorio JPA para User
 * Define consultas útiles (email/username) y checks de existencia
 */
public interface UserRepository extends JpaRepository<User, Long> {

    // Buscar usuario por username
    Optional<User> findByUsername(String username);

    // Buscar usuario por email
    Optional<User> findByEmail(String email);

    // Comprueba si existe username
    boolean existsByUsername(String username);

    // Comprueba si existe email
    boolean existsByEmail(String email);
}
