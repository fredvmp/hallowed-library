package com.hallowedlibrary.backend.controllers;

import com.hallowedlibrary.backend.dto.FavoriteDto;
import com.hallowedlibrary.backend.entities.User;
import com.hallowedlibrary.backend.services.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Chuleta endpoints:
 * - GET /api/me/library
 * - POST /api/me/library
 * - DELETE /api/me/library/{volumeId}
 */
@RestController
@RequestMapping("/api/me/library")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    // Lista favoritos
    @GetMapping
    public ResponseEntity<List<FavoriteDto>> getMyLibrary(@AuthenticationPrincipal User user) {
        if (user == null)
            return ResponseEntity.status(401).build();
        return ResponseEntity.ok(favoriteService.listFavorites(user.getId()));
    }

    // Añadir a favoritos
    @PostMapping
    public ResponseEntity<?> addFavorite(@AuthenticationPrincipal User user,
            @RequestBody FavoriteDto dto) {
        if (user == null)
            return ResponseEntity.status(401).build();
        FavoriteDto saved = favoriteService.addFavorite(user.getId(), dto);
        return ResponseEntity.status(201).body(saved);
    }

    // Quitar de favoritos
    @DeleteMapping("/{volumeId}")
    public ResponseEntity<?> removeFavorite(@AuthenticationPrincipal User user,
            @PathVariable String volumeId) {
        if (user == null)
            return ResponseEntity.status(401).build();
        favoriteService.removeFavorite(user.getId(), volumeId);
        return ResponseEntity.noContent().build();
    }

}
