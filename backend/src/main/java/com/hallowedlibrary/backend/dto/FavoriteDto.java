package com.hallowedlibrary.backend.dto;

import java.util.List;

/**
 * DTO para enviar/recibir favoritos desde el front
 */
public class FavoriteDto {
    private String volumeId;
    private String title;
    private String miniature;
    private List<String> authors;

    public FavoriteDto() {}

    public FavoriteDto(String volumeId, String title, String miniature, List<String> authors) {
        this.volumeId = volumeId;
        this.title = title;
        this.miniature = miniature;
        this.authors = authors;
    }

    public String getVolumeId() { return volumeId; }
    public void setVolumeId(String volumeId) { this.volumeId = volumeId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMiniature() { return miniature; }
    public void setMiniature(String miniature) { this.miniature = miniature; }

    public List<String> getAuthors() { return authors; }
    public void setAuthors(List<String> authors) { this.authors = authors; }
}
