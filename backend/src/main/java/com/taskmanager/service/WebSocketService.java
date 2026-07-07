package com.taskmanager.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class WebSocketService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void broadcastBoardUpdate(UUID boardId) {
        messagingTemplate.convertAndSend("/topic/board/" + boardId, "UPDATED");
    }
}
