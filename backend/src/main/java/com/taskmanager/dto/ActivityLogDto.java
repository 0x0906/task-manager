package com.taskmanager.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class ActivityLogDto {
    private UUID id;
    private String username;
    private String actionText;
    private LocalDateTime timestamp;

    public ActivityLogDto() {}

    public ActivityLogDto(UUID id, String username, String actionText, LocalDateTime timestamp) {
        this.id = id;
        this.username = username;
        this.actionText = actionText;
        this.timestamp = timestamp;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getActionText() { return actionText; }
    public void setActionText(String actionText) { this.actionText = actionText; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
