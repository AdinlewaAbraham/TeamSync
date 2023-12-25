"use client";
import { useGlobalContext } from "@/context/GeneralContext";
import React, { useEffect } from "react";
import io from "socket.io-client";

const WebsocketTest = () => {
  const { activeWorkspace } = useGlobalContext();
  console.log(activeWorkspace);
  const socket = io.connect("http://localhost:5001/");
  const addTask = () => {
    socket.emit("add_task", { taskId: "someId" });
  };
  useEffect(() => {
    socket.on("recieve_task", (task: { taskId: string }) => {
      console.log(task.taskId);
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
