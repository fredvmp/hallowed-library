package com.hallowedlibrary.backend.dto;

import lombok.Data;

/**
 * DTO para login: identifier puede ser username o email
 */
@Data
public class LoginDto {
    private String identifier;
    private String password;
}
