package com.hallowedlibrary.backend.security;

import java.io.IOException;
import java.util.Collections;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.hallowedlibrary.backend.entities.User;
import com.hallowedlibrary.backend.repositories.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/*
 * Filtro JWT principal
 * - Extrae "Authorization: Bearer <token>"
 * - Valida el token con JwtUtil
 * - Si es válido, carga el User desde la BBDD y lo pone como principal en SecurityContext
 */
@Component
public class JwtFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public JwtFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        // Evitar procesar preflight CORS
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7).trim();

            try {
                // Validar token y extraer userId
                Long userId = jwtUtil.validateTokenAndGetUserId(token);

                // Cargar entidad User desde la BBDD
                User user = userRepository.findById(userId).orElse(null);

                if (user != null) {
                    // Crear Authentication con la entidad User como principal
                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(auth);

                    logger.debug("JwtFilter: usuario autenticado id={} uri={}", user.getId(), request.getRequestURI());
                } else {
                    logger.debug("JwtFilter: token válido pero no se encontró usuario id={} uri={}", userId, request.getRequestURI());
                }
            } catch (Exception ex) {
                // Token inválido o expirado -> no autenticamos
                logger.debug("JwtFilter: validación de token falló: {} (uri={})", ex.getMessage(), request.getRequestURI());
            }
        }

        chain.doFilter(request, response);
    }
}
