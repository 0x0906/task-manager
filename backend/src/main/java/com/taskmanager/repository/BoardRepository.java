package com.taskmanager.repository;

import com.taskmanager.model.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface BoardRepository extends JpaRepository<Board, UUID> {
    List<Board> findByOwnerId(UUID ownerId);
    
    List<Board> findDistinctByOwnerIdOrMembersId(UUID ownerId, UUID memberId);
}
