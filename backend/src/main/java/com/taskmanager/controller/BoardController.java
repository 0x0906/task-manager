package com.taskmanager.controller;

import com.taskmanager.dto.BoardDto;
import com.taskmanager.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/boards")
public class BoardController {

    @Autowired
    private BoardService boardService;

    @GetMapping
    public ResponseEntity<List<BoardDto>> getBoards(Authentication authentication) {
        return ResponseEntity.ok(boardService.getUserBoards(authentication.getName()));
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<BoardDto> createBoard(@RequestParam String title, Authentication authentication) {
        return ResponseEntity.ok(boardService.createBoard(title, authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoardDto> getBoard(@PathVariable UUID id) {
        return ResponseEntity.ok(boardService.getBoard(id));
    }

    @PostMapping("/{id}/columns")
    public ResponseEntity<BoardDto> addColumn(@PathVariable UUID id, @RequestParam String title) {
        return ResponseEntity.ok(boardService.addColumn(id, title));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable UUID id) {
        boardService.deleteBoard(id);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{id}/members")
    public ResponseEntity<BoardDto> addMember(@PathVariable UUID id, @RequestParam String username) {
        return ResponseEntity.ok(boardService.addMember(id, username));
    }
    
    @PutMapping("/{id}/status")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<BoardDto> updateStatus(@PathVariable UUID id, @RequestParam String status) {
        return ResponseEntity.ok(boardService.updateStatus(id, status));
    }
    
    @GetMapping("/{id}/logs")
    public ResponseEntity<List<com.taskmanager.dto.ActivityLogDto>> getActivityLogs(@PathVariable UUID id) {
        return ResponseEntity.ok(boardService.getActivityLogs(id));
    }
}
