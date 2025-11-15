package com.hallowedlibrary.backend.entities;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "favorites", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "volume_id" })
})
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con User (muchos favoritos -> un usuario)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private com.hallowedlibrary.backend.entities.User user;

    @Column(name = "volume_id", nullable = false, length = 128)
    private String volumeId;

    @Column(name = "title", length = 1024)
    private String title;

    @Column(name = "miniature", length = 2048)
    private String miniature;

    @Column(name = "authors_text", length = 2048)
    private String authorsText;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public Favorite() {
    }

    public Favorite(com.hallowedlibrary.backend.entities.User user, String volumeId,
            String title, String miniature, String authorsText) {
        this.user = user;
        this.volumeId = volumeId;
        this.title = title;
        this.miniature = miniature;
        this.authorsText = authorsText;
        this.createdAt = Instant.now();
    }

    // Getters / setters
    public Long getId() {
        return id;
    }

    public com.hallowedlibrary.backend.entities.User getUser() {
        return user;
    }

    public void setUser(com.hallowedlibrary.backend.entities.User user) {
        this.user = user;
    }

    public String getVolumeId() {
        return volumeId;
    }

    public void setVolumeId(String volumeId) {
        this.volumeId = volumeId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMiniature() {
        return miniature;
    }

    public void setMiniature(String miniature) {
        this.miniature = miniature;
    }

    public String getAuthorsText() {
        return authorsText;
    }

    public void setAuthorsText(String authorsText) {
        this.authorsText = authorsText;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
