"use client";
import socket from "@/config/WebSocketManager";
import { useGlobalContext } from "@/context/GeneralContext";
import React, { useEffect } from "react";

const WebsocketTest = () => {
  const { activeWorkspace } = useGlobalContext();
  console.log(activeWorkspace);
  const addTask = () => {
    socket.emit("join_room", "shit");
  };
  useEffect(() => {
    socket.on("recieve_task", (task: { taskId: string }) => {
      console.log(task.taskId);
    });
    socket.on("eventName", (data) => {
      console.log(data)
    });
  }, [socket]);

  return (
    <div>
      WebsocketTest
      <button onClick={addTask} className="bg-blue-500 p-4">
        add task
      </button>
    </div>
  );
};

export default WebsocketTest;
