package com.hallowedlibrary.backend.dto;

import lombok.Data;

/**
 * DTO para la creación de usuario (signup)
 * passwordConf para validación en controller/servicio y no se almacena
 */
@Data
public class UserCreateDto {
    private String name;
    private String username;
    private String email;
    private String password;
    private String passwordConf;
}
