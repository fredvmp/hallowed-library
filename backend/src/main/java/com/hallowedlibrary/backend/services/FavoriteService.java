package com.hallowedlibrary.backend.services;

import com.hallowedlibrary.backend.dto.FavoriteDto;
import com.hallowedlibrary.backend.entities.Favorite;
import com.hallowedlibrary.backend.entities.User;
import com.hallowedlibrary.backend.repositories.FavoriteRepository;
import com.hallowedlibrary.backend.repositories.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * añadir, listar y borrar favoritos
 */
@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;

    public FavoriteService(FavoriteRepository favoriteRepository,
            UserRepository userRepository) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
    }

    // Listar favoritos
    public List<FavoriteDto> listFavorites(Long userId) {
        return favoriteRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(f -> new FavoriteDto(f.getVolumeId(), f.getTitle(), f.getMiniature(),
                        f.getAuthorsText() == null ? List.of()
                                : List.of(f.getAuthorsText().split("\\|"))))
                .collect(Collectors.toList());
    }

    /**
     * Añadir favorito.
     * - Si ya existe para userId + volumeId -> devuelve el DTO existente.
     * - Si no existe -> se crea y se devuelve.
     */
    @Transactional
    public FavoriteDto addFavorite(Long userId, FavoriteDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // Si ya existe, devolver DTO existente
        var existingOpt = favoriteRepository.findByUserIdAndVolumeId(userId, dto.getVolumeId());
        if (existingOpt.isPresent()) {
            Favorite existing = existingOpt.get();
            return new FavoriteDto(existing.getVolumeId(), existing.getTitle(), existing.getMiniature(),
                    existing.getAuthorsText() == null ? List.of()
                            : List.of(existing.getAuthorsText().split("\\|")));
        }

        String authorsText = null;
        if (dto.getAuthors() != null && !dto.getAuthors().isEmpty()) {
            authorsText = String.join("|", dto.getAuthors());
        }

        Favorite fav = new Favorite(user, dto.getVolumeId(), dto.getTitle(), dto.getMiniature(), authorsText);

        try {
            Favorite saved = favoriteRepository.save(fav);
            return new FavoriteDto(saved.getVolumeId(), saved.getTitle(), saved.getMiniature(),
                    saved.getAuthorsText() == null ? List.of() : List.of(saved.getAuthorsText().split("\\|")));
        } catch (DataIntegrityViolationException ex) {
            var recovered = favoriteRepository.findByUserIdAndVolumeId(userId, dto.getVolumeId())
                    .orElseThrow(() -> ex);
            return new FavoriteDto(recovered.getVolumeId(), recovered.getTitle(), recovered.getMiniature(),
                    recovered.getAuthorsText() == null ? List.of() : List.of(recovered.getAuthorsText().split("\\|")));
        }
    }

    // Quitar favorito
    @Transactional
    public void removeFavorite(Long userId, String volumeId) {
        favoriteRepository.deleteByUserIdAndVolumeId(userId, volumeId);
    }

}
