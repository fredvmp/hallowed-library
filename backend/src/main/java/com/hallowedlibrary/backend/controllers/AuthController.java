package com.hallowedlibrary.backend.controllers;

import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hallowedlibrary.backend.dto.LoginDto;
import com.hallowedlibrary.backend.dto.UserCreateDto;
import com.hallowedlibrary.backend.dto.UserResponseDto;
import com.hallowedlibrary.backend.entities.User;
import com.hallowedlibrary.backend.exceptions.UserAlreadyExistsException;
import com.hallowedlibrary.backend.security.JwtUtil;
import com.hallowedlibrary.backend.services.UserService;

/**
 * Controlador de autenticación:
 * - POST /api/users -> registro (signup)
 * - POST /api/login -> login (devuelve JWT)
 * - GET  /api/profile -> perfil protegido (requiere token)
 */
@RestController
@RequestMapping("/api")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Registro de usuario
     * Recibe un UserCreateDto (con passwordConf) y delega en UserService
     */
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody UserCreateDto userDto) {
        try {
            // Crear usuario y devolver DTO público sin password
            User saved = userService.createUser(userDto);
            UserResponseDto resp = userService.toResponseDto(saved);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of("message", "Usuario creado con éxito", "user", resp));

        } catch (UserAlreadyExistsException e) {
            // Validación personalizada: username/email ya existían
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));

        } catch (IllegalArgumentException e) {
            // Errores de validación simple desde el servicio
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));

        } catch (DataIntegrityViolationException e) {
            // En caso de haber una violación de integridad en DB (race condition, constraints)
            logger.warn("Data integrity error al crear usuario: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Error de integridad en la base de datos"));

        } catch (Exception e) {
            // Otros errores
            logger.error("Error inesperado creando usuario", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error inesperado"));
        }
    }

    /**
     * Login: recibe LoginDto (identifier + password) -> Devuelve access_token y user
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto dto) {
        // Buscar por username o email según el identificador
        Optional<User> userOpt = userService.findByUsernameOrEmail(dto.getIdentifier());
        if (userOpt.isEmpty() || !userService.checkPassword(userOpt.get(), dto.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales inválidas"));
        }

        User user = userOpt.get();

        // Generar token JWT
        String token = jwtUtil.generateToken(user.getId());

        // Construir DTO público
        UserResponseDto resp = userService.toResponseDto(user);

        return ResponseEntity.ok(Map.of("access_token", token, "user", resp));
    }

    /**
     * Perfil protegido, @AuthenticationPrincipal inyecta el principal puesto por el filtro JWT
     * Si no hay principal, devuelve un error
     */
    @GetMapping("/profile")
    public ResponseEntity<?> profile(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Token inválido o expirado"));
        }

        // Convertir a DTO público y devolver
        UserResponseDto resp = userService.toResponseDto(user);
        return ResponseEntity.ok(resp);
    }
}
