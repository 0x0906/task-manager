package com.taskmanager.service;

import com.taskmanager.dto.ActivityLogDto;
import com.taskmanager.dto.BoardDto;
import com.taskmanager.dto.TaskColumnDto;
import com.taskmanager.dto.TaskDto;
import com.taskmanager.dto.UserDto;
import com.taskmanager.model.ActivityLog;
import com.taskmanager.model.Board;
import com.taskmanager.model.BoardStatus;
import com.taskmanager.model.Task;
import com.taskmanager.model.TaskColumn;
import com.taskmanager.model.User;
import com.taskmanager.model.Role;
import com.taskmanager.repository.BoardRepository;
import com.taskmanager.repository.TaskColumnRepository;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class BoardService {

    @Autowired
    private BoardRepository boardRepository;
    
    @Autowired
    private TaskColumnRepository columnRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WebSocketService webSocketService;
    
    @Autowired
    private ActivityLogRepository activityLogRepository;

    public List<BoardDto> getUserBoards(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        
        if (user.getRole() == Role.ADMIN) {
            return boardRepository.findAll().stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
        }
        
        return boardRepository.findDistinctByOwnerIdOrMembersId(user.getId(), user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public BoardDto createBoard(String title, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Board board = new Board();
        board.setTitle(title);
        board.setOwner(user);
        
        TaskColumn todo = new TaskColumn();
        todo.setTitle("To Do");
        todo.setPosition(0);
        todo.setBoard(board);
        
        TaskColumn inProgress = new TaskColumn();
        inProgress.setTitle("In Progress");
        inProgress.setPosition(1);
        inProgress.setBoard(board);
        
        TaskColumn done = new TaskColumn();
        done.setTitle("Done");
        done.setPosition(2);
        done.setBoard(board);
        
        board.getColumns().add(todo);
        board.getColumns().add(inProgress);
        board.getColumns().add(done);
        
        return mapToDto(boardRepository.save(board));
    }

    public BoardDto getBoard(UUID id) {
        return mapToDto(boardRepository.findById(id).orElseThrow());
    }

    @Transactional
    public BoardDto addColumn(UUID boardId, String title) {
        Board board = boardRepository.findById(boardId).orElseThrow();
        TaskColumn column = new TaskColumn();
        column.setTitle(title);
        column.setPosition(board.getColumns().size());
        column.setBoard(board);
        columnRepository.save(column);
        board.getColumns().add(column);
        webSocketService.broadcastBoardUpdate(boardId);
        return mapToDto(board);
    }
    
    public void deleteBoard(UUID id) {
        boardRepository.deleteById(id);
    }
    
    @Transactional
    public BoardDto addMember(UUID boardId, String username) {
        Board board = boardRepository.findById(boardId).orElseThrow();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        board.getMembers().add(user);
        boardRepository.save(board);
        webSocketService.broadcastBoardUpdate(boardId);
        return mapToDto(board);
    }
    
    @Transactional
    public BoardDto updateStatus(UUID boardId, String status) {
        Board board = boardRepository.findById(boardId).orElseThrow();
        board.setStatus(BoardStatus.valueOf(status));
        boardRepository.save(board);
        webSocketService.broadcastBoardUpdate(boardId);
        return mapToDto(board);
    }
    
    public List<ActivityLogDto> getActivityLogs(UUID boardId) {
        return activityLogRepository.findByBoardIdOrderByTimestampDesc(boardId)
                .stream()
                .map(log -> new ActivityLogDto(log.getId(), log.getUser().getUsername(), log.getActionText(), log.getTimestamp()))
                .collect(Collectors.toList());
    }

    private BoardDto mapToDto(Board board) {
        BoardDto dto = new BoardDto();
        dto.setId(board.getId());
        dto.setTitle(board.getTitle());
        dto.setOwner(mapToDto(board.getOwner()));
        dto.setMembers(board.getMembers().stream().map(this::mapToDto).collect(Collectors.toList()));
        dto.setColumns(board.getColumns().stream().map(this::mapToDto).collect(Collectors.toList()));
        dto.setStatus(board.getStatus() != null ? board.getStatus().name() : null);
        dto.setCreatedAt(board.getCreatedAt());
        dto.setUpdatedAt(board.getUpdatedAt());
        dto.setMemberCount(board.getMembers().size() + 1); // +1 for owner
        return dto;
    }

    private TaskColumnDto mapToDto(TaskColumn column) {
        TaskColumnDto dto = new TaskColumnDto();
        dto.setId(column.getId());
        dto.setTitle(column.getTitle());
        dto.setPosition(column.getPosition());
        dto.setTasks(column.getTasks().stream().map(this::mapToDto).collect(Collectors.toList()));
        return dto;
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
            dto.setAssignee(mapToDto(task.getAssignee()));
        }
        return dto;
    }

    private UserDto mapToDto(User user) {
        if (user == null) return null;
        return new UserDto(user.getId(), user.getUsername(), user.getRole().name());
    }
}
