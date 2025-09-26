package com.hallowedlibrary.backend.services;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hallowedlibrary.backend.dto.UserCreateDto;
import com.hallowedlibrary.backend.dto.UserResponseDto;
import com.hallowedlibrary.backend.entities.User;
import com.hallowedlibrary.backend.exceptions.UserAlreadyExistsException;
import com.hallowedlibrary.backend.repositories.UserRepository;

/**
 * UserService: encapsula la lógica relacionada con usuarios
 * - creación (signup)
 * - búsquedas
 * - validación de contraseña
 * - transformación a DTO de respuesta
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Inyectamos repositorio y encoder (configurado en PasswordConfig)
    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Crea un usuario nuevo a partir de un UserCreateDto
     * Lanza UserAlreadyExistsException si username/email ya están en uso
     */
    public User createUser(UserCreateDto dto) {
        // Validaciones de campos
        if (dto.getUsername() == null || dto.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("username requerido");
        }
        if (dto.getEmail() == null || dto.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("email requerido");
        }
        if (dto.getPassword() == null || dto.getPassword().isEmpty()) {
            throw new IllegalArgumentException("password requerido");
        }
        if (!dto.getPassword().equals(dto.getPasswordConf())) {
            throw new IllegalArgumentException("Las contraseñas no coinciden");
        }

        // Comprobar duplicados
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new UserAlreadyExistsException("El username ya está en uso");
        }
        if (userRepository.existsByEmail(dto.getEmail().toLowerCase())) {
            throw new UserAlreadyExistsException("El email ya está en uso");
        }

        // Construir User y hashear la contraseña
        User user = User.builder()
                .username(dto.getUsername().trim())
                .name(dto.getName().trim())
                .email(dto.getEmail().trim().toLowerCase())
                .passwordHash(passwordEncoder.encode(dto.getPassword()))
                .build();

        // Guardar en DB
        return userRepository.save(user);
    }

    /**
     * Busca user por username o por email
     */
    public Optional<User> findByUsernameOrEmail(String identifier) {
        if (identifier == null) return Optional.empty();
        if (identifier.contains("@")) {
            return userRepository.findByEmail(identifier.toLowerCase());
        } else {
            return userRepository.findByUsername(identifier);
        }
    }

    /**
     * Comprobar una contraseña (raw) contra el passwordHash (BCrypt)
     */
    public boolean checkPassword(User user, String rawPassword) {
        if (user == null || rawPassword == null) return false;
        return passwordEncoder.matches(rawPassword, user.getPasswordHash());
    }

    /**
     * Obtener un User por id
     */
    public Optional<User> getById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Convierte entidad User a UserResponseDto para devolver al frontend
     */
    public UserResponseDto toResponseDto(User user) {
        if (user == null) return null;
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setBio(user.getBio());
        dto.setImageUrl(user.getImageUrl());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
