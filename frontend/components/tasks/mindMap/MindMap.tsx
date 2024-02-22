"use client";
import { useCallback, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  Panel,
  MiniMap,
  ControlButton,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import ProjectNode from "./nodeTypes/ProjectNode";
import "@/styles/tree.css";

const MindMap = () => {
  const initialNodes: Node[] = [
    {
      id: "1",
      type: "projectNode",
      data: { label: "Input Node" },
      position: { x: 250, y: 25 },
      deletable: true,
    },

    {
      id: "2",
      // you can also pass a React component as a label
      data: { label: <div>Default Node</div> },
      position: { x: 100, y: 125 },
    },
    {
      id: "3",
      type: "output",
      data: { label: "Output Node" },
      position: { x: 250, y: 250 },
    },
  ];

  const nodeTypes = { projectNode: ProjectNode };

  const initialEdges: Edge[] = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      type: "simplebezier",
      style: { width: 5 },
    },
    { id: "e2-3", source: "2", target: "3", animated: true },
  ];

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect = useCallback(
    (connection: Edge | Connection) => {
      console.log(connection);
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges],
  );

  return (
    <div style={{ height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Background />
        <MiniMap nodeStrokeWidth={3} position="bottom-center" pannable />
        <Controls position="bottom-left" />
      </ReactFlow>
    </div>
  );
};

export default MindMap;
