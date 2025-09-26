package com.hallowedlibrary.backend.security;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

/*
 * Utilidad para generar y validar JWT usando HS256
 * Lee la clave secreta desde application.properties (jwt.secret)
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    // 24 horas
    private final long EXPIRATION_TIME = 1000L * 60 * 60 * 24;

    /**
     * Genera un token cuyo subject es el userId (Long -> string)
     */
    public String generateToken(Long userId) {
        Algorithm alg = Algorithm.HMAC256(secret);
        return JWT.create()
                .withSubject(String.valueOf(userId))
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(alg);
    }

    /**
     * Valida el token y devuelve el userId contenido en el subject
     * Lanza JWTVerificationException si el token es inválido o ha expirado
     */
    public Long validateTokenAndGetUserId(String token) throws JWTVerificationException {
        Algorithm alg = Algorithm.HMAC256(secret);
        DecodedJWT decoded = JWT.require(alg).build().verify(token);
        String subject = decoded.getSubject();
        return Long.parseLong(subject);
    }
}
