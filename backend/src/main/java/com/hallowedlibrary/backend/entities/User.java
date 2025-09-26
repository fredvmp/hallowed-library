package com.hallowedlibrary.backend.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad User mapeada a la tabla "users"
 * Uso de Lombok para reducir boilerplate (getters/setters, constructor, builder)
 */
@Entity
@Table(name = "users")
@Data                // Genera getters/setters, toString, equals, hashCode
@NoArgsConstructor   // Constructor vacío
@AllArgsConstructor  // Constructor con todos los campos
@Builder             // Builder para crear instancias fácilmente
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // serial / auto increment
    private Long id;

    @Column(nullable = false, unique = true, length = 80)
    private String username;            // username público

    @Column(nullable = false, length = 120)
    private String name;                // nombre completo

    @Column(nullable = false, unique = true, length = 255)
    private String email;               // email (único)

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;        // hashed password (BCrypt)

    @Column(columnDefinition = "TEXT")
    private String bio;                 // biografía (opcional)

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;            // url de imagen de perfil (opcional)

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;    // fecha de creación (Hibernate)
}
