package com.hallowedlibrary.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO público para enviar información del usuario
 */
@Data
public class UserResponseDto {
    private Long id;
    private String username;
    private String name;
    private String email;
    private String bio;
    private String imageUrl;
    private LocalDateTime createdAt;
}
