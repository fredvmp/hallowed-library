package com.hallowedlibrary.backend.exceptions;

/**
 * Excepción runtime para indicar que ya existe un usuario con ese username/email
 */
public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
