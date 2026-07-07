package com.taskmanager.service;

import com.taskmanager.dto.TaskDto;
import com.taskmanager.dto.UserDto;
import com.taskmanager.model.Task;
import com.taskmanager.model.TaskColumn;
import com.taskmanager.model.TaskPriority;
import com.taskmanager.model.User;
import com.taskmanager.repository.TaskColumnRepository;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.ActivityLogRepository;
import com.taskmanager.model.ActivityLog;
import com.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private TaskColumnRepository columnRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private WebSocketService webSocketService;
    
    @Autowired
    private ActivityLogRepository activityLogRepository;

    public TaskDto createTask(UUID columnId, String title, String description, String username) {
        TaskColumn column = columnRepository.findById(columnId).orElseThrow();
        User user = userRepository.findByUsername(username).orElseThrow();
        
        Task task = new Task();
        task.setTitle(title);
        task.setDescription(description);
        task.setPosition(column.getTasks().size());
        task.setColumn(column);
        
        Task saved = taskRepository.save(task);
        
        activityLogRepository.save(new ActivityLog(column.getBoard(), user, "Created task '" + title + "'"));
        
        webSocketService.broadcastBoardUpdate(column.getBoard().getId());
        return mapToDto(saved);
    }

    public TaskDto updateTask(UUID id, String title, String description, String priority, LocalDate dueDate, String assigneeUsername, String username) {
        Task task = taskRepository.findById(id).orElseThrow();
        User user = userRepository.findByUsername(username).orElseThrow();
        
        if (title != null) task.setTitle(title);
        if (description != null) task.setDescription(description);
        if (priority != null) task.setPriority(TaskPriority.valueOf(priority));
        if (dueDate != null) task.setDueDate(dueDate);
        if (assigneeUsername != null) {
            User assignee = userRepository.findByUsername(assigneeUsername).orElseThrow();
            task.setAssignee(assignee);
        }
        Task saved = taskRepository.save(task);
        
        activityLogRepository.save(new ActivityLog(saved.getColumn().getBoard(), user, "Updated task '" + saved.getTitle() + "'"));
        
        webSocketService.broadcastBoardUpdate(saved.getColumn().getBoard().getId());
        return mapToDto(saved);
    }

    @Transactional
    public void moveTask(UUID taskId, UUID newColumnId, int newPosition, String username) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        TaskColumn newColumn = columnRepository.findById(newColumnId)
                .orElseThrow(() -> new RuntimeException("Column not found"));
        UUID oldColumnId = task.getColumn().getId();
        User user = userRepository.findByUsername(username).orElseThrow();

        if (oldColumnId.equals(newColumnId)) {
            List<Task> tasks = taskRepository.findByColumnIdOrderByPositionAsc(oldColumnId);
            tasks.removeIf(t -> t.getId().equals(task.getId()));
            
            if (newPosition > tasks.size()) newPosition = tasks.size();
            tasks.add(newPosition, task);
            
            for (int i = 0; i < tasks.size(); i++) {
                tasks.get(i).setPosition(i);
            }
            taskRepository.saveAll(tasks);
        } else {
            // Fetch both lists BEFORE modifying the entity to prevent auto-flush issues
            List<Task> oldTasks = taskRepository.findByColumnIdOrderByPositionAsc(oldColumnId);
            List<Task> newTasks = taskRepository.findByColumnIdOrderByPositionAsc(newColumnId);
            
            oldTasks.removeIf(t -> t.getId().equals(task.getId()));
            for (int i = 0; i < oldTasks.size(); i++) {
                oldTasks.get(i).setPosition(i);
            }
            
            task.setColumn(newColumn);
            
            if (newPosition > newTasks.size()) newPosition = newTasks.size();
            newTasks.add(newPosition, task);
            
            for (int i = 0; i < newTasks.size(); i++) {
                newTasks.get(i).setPosition(i);
            }
            
            taskRepository.saveAll(oldTasks);
            taskRepository.saveAll(newTasks);
        }
        
        activityLogRepository.save(new ActivityLog(task.getColumn().getBoard(), user, "Moved task '" + task.getTitle() + "' to '" + newColumn.getTitle() + "'"));
        
        webSocketService.broadcastBoardUpdate(task.getColumn().getBoard().getId());
    }

    public void deleteTask(UUID id, String username) {
        Task task = taskRepository.findById(id).orElseThrow();
        User user = userRepository.findByUsername(username).orElseThrow();
        UUID boardId = task.getColumn().getBoard().getId();
        
        activityLogRepository.save(new ActivityLog(task.getColumn().getBoard(), user, "Deleted task '" + task.getTitle() + "'"));
        
        taskRepository.deleteById(id);
        webSocketService.broadcastBoardUpdate(boardId);
    }
    
    private TaskDto mapToDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setPosition(task.getPosition());
        if (task.getPriority() != null) {
            dto.setPriority(task.getPriority().name());
        }
        dto.setDueDate(task.getDueDate());
        if (task.getAssignee() != null) {
            dto.setAssignee(new UserDto(task.getAssignee().getId(), task.getAssignee().getUsername(), task.getAssignee().getRole().name()));
        }
        return dto;
    }
}
