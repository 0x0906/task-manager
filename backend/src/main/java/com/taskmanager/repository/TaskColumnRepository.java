package com.taskmanager.repository;

import com.taskmanager.model.TaskColumn;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface TaskColumnRepository extends JpaRepository<TaskColumn, UUID> {
    List<TaskColumn> findByBoardIdOrderByPositionAsc(UUID boardId);
}
