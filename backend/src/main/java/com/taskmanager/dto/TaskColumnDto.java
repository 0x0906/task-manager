package com.taskmanager.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class TaskColumnDto {
    private UUID id;
    private String title;
    private Integer position;
    private List<TaskDto> tasks = new ArrayList<>();
    
    public TaskColumnDto() {}
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Integer getPosition() { return position; }
    public void setPosition(Integer position) { this.position = position; }
    public List<TaskDto> getTasks() { return tasks; }
    public void setTasks(List<TaskDto> tasks) { this.tasks = tasks; }
}
