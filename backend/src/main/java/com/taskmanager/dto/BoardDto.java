package com.taskmanager.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class BoardDto {
    private UUID id;
    private String title;
    private UserDto owner;
    private List<UserDto> members = new ArrayList<>();
    private List<TaskColumnDto> columns = new ArrayList<>();
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int memberCount;
    
    public BoardDto() {}
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public UserDto getOwner() { return owner; }
    public void setOwner(UserDto owner) { this.owner = owner; }
    public List<UserDto> getMembers() { return members; }
    public void setMembers(List<UserDto> members) { this.members = members; }
    public List<TaskColumnDto> getColumns() { return columns; }
    public void setColumns(List<TaskColumnDto> columns) { this.columns = columns; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public int getMemberCount() { return memberCount; }
    public void setMemberCount(int memberCount) { this.memberCount = memberCount; }
}
