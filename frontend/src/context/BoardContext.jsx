import React, { createContext, useState, useCallback, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import axiosClient from '../api/axiosClient';

export const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const stompClient = useRef(null);

  useEffect(() => {
    if (currentBoard) {
      const client = new Client({
        brokerURL: 'ws://localhost:8080/ws',
        onConnect: () => {
          client.subscribe(`/topic/board/${currentBoard.id}`, () => {
            fetchBoard(currentBoard.id);
          });
        }
      });
      client.activate();
      stompClient.current = client;

      return () => {
        if (stompClient.current) stompClient.current.deactivate();
      };
    }
  }, [currentBoard?.id]);

  const fetchBoards = useCallback(async () => {
    const res = await axiosClient.get('/boards');
    setBoards(res.data);
  }, []);

  const fetchBoard = useCallback(async (id) => {
    const res = await axiosClient.get(`/boards/${id}`);
    setCurrentBoard(res.data);
  }, []);

  const createBoard = async (title) => {
    await axiosClient.post(`/boards?title=${title}`);
    fetchBoards();
  };

  const addColumn = async (boardId, title) => {
    await axiosClient.post(`/boards/${boardId}/columns?title=${title}`);
    fetchBoard(boardId);
  };

  const createTask = async (columnId, title, description) => {
    await axiosClient.post(`/tasks?columnId=${columnId}`, { title, description });
    if (currentBoard) fetchBoard(currentBoard.id);
  };

  const moveTask = async (taskId, columnId, position) => {
    await axiosClient.put(`/tasks/${taskId}/move?columnId=${columnId}&position=${position}`, {});
  };

  const deleteTask = async (taskId) => {
    await axiosClient.delete(`/tasks/${taskId}`);
    if (currentBoard) fetchBoard(currentBoard.id);
  };

  const addMember = async (boardId, username) => {
    await axiosClient.post(`/boards/${boardId}/members?username=${username}`);
    fetchBoard(boardId);
  };

  const deleteBoard = async (boardId) => {
    await axiosClient.delete(`/boards/${boardId}`);
    fetchBoards();
    setCurrentBoard(null);
  };

  const updateTask = async (taskId, data) => {
    await axiosClient.put(`/tasks/${taskId}`, data);
    if (currentBoard) fetchBoard(currentBoard.id);
  };
  
  const updateBoardStatus = async (boardId, status) => {
    await axiosClient.put(`/boards/${boardId}/status?status=${status}`);
    fetchBoards();
    if (currentBoard && currentBoard.id === boardId) {
      fetchBoard(boardId);
    }
  };

  return (
    <BoardContext.Provider value={{
      boards, currentBoard, fetchBoards, fetchBoard, createBoard, addColumn, createTask, moveTask, deleteTask, deleteBoard, addMember, updateTask, updateBoardStatus
    }}>
      {children}
    </BoardContext.Provider>
  );
};
