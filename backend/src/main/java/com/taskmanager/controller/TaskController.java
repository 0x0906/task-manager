package com.taskmanager.controller;

import com.taskmanager.dto.TaskDto;
import com.taskmanager.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;
import java.security.Principal;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TaskDto> createTask(@RequestParam UUID columnId, @RequestBody Map<String, String> payload, Principal principal) {
        return ResponseEntity.ok(taskService.createTask(columnId, payload.get("title"), payload.get("description"), principal.getName()));
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TaskDto> updateTask(@PathVariable UUID id, @RequestBody Map<String, String> payload, Principal principal) {
        java.time.LocalDate dueDate = payload.get("dueDate") != null && !payload.get("dueDate").isEmpty() ? java.time.LocalDate.parse(payload.get("dueDate")) : null;
        return ResponseEntity.ok(taskService.updateTask(
                id, 
                payload.get("title"), 
                payload.get("description"),
                payload.get("priority"),
                dueDate,
                payload.get("assigneeUsername"),
                principal.getName()
        ));
    }

    @PutMapping("/{id}/move")
    public ResponseEntity<Void> moveTask(
            @PathVariable UUID id,
            @RequestParam UUID columnId,
            @RequestParam int position,
            Principal principal) {
        taskService.moveTask(id, columnId, position, principal.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID id, Principal principal) {
        taskService.deleteTask(id, principal.getName());
        return ResponseEntity.ok().build();
    }
}
