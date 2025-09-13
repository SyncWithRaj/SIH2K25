"use client";
import React, { useCallback, useState, useRef } from "react";
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from "uuid";

export default function CareerRoadmapCanvas() {
  const initialNodes = [
    {
      id: "1",
      position: { x: 50, y: 50 },
      data: { label: "Start: Self-Assessment" },
      style: { padding: 10, borderRadius: 8 },
    },
    {
      id: "2",
      position: { x: 350, y: 50 },
      data: { label: "Learn Fundamentals" },
      style: { padding: 10, borderRadius: 8 },
    },
    {
      id: "3",
      position: { x: 650, y: 50 },
      data: { label: "Build Projects" },
      style: { padding: 10, borderRadius: 8 },
    },
  ];

  const initialEdges = [
    { id: "e1-2", source: "1", target: "2" },
    { id: "e2-3", source: "2", target: "3" },
  ];

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [eraserMode, setEraserMode] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  // ✅ Proper node changes
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // ✅ Proper edge changes
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const addNode = () => {
    const id = uuidv4();
    const newNode = {
      id,
      position: {
        x: 200 + Math.random() * 400,
        y: 200 + Math.random() * 200,
      },
      data: { label: "New Step" },
      style: { padding: 10, borderRadius: 8 },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const onNodeClick = (_event, node) => {
    if (eraserMode) {
      setNodes((nds) => nds.filter((n) => n.id !== node.id));
      setEdges(
        (eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id)
      );
    }
  };

  const onEdgeClick = (_event, edge) => {
    if (eraserMode) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
  };

  // Annotation canvas
  const toggleDrawMode = () => setDrawMode((d) => !d);

  const handlePointerDown = (e) => {
    if (!drawMode) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    drawing.current = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handlePointerMove = (e) => {
    if (!drawMode || !drawing.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    if (!drawMode) return;
    drawing.current = false;
  };

  const clearAnnotations = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const exportRoadmap = () => {
    const payload = { nodes, edges };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "career-roadmap.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-screen p-4 bg-gray-50">
      <div className="flex gap-3 items-center mb-3">
        <button
          className="px-3 py-1 rounded bg-indigo-600 text-white"
          onClick={addNode}
        >
          Add Step
        </button>
        <button
          className={`px-3 py-1 rounded ${
            eraserMode ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setEraserMode((s) => !s)}
        >
          {eraserMode ? "Eraser: ON" : "Eraser"}
        </button>
        <button
          className={`px-3 py-1 rounded ${
            drawMode ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
          onClick={toggleDrawMode}
        >
          {drawMode ? "Draw: ON" : "Annotate"}
        </button>
        <button
          className="px-3 py-1 rounded bg-yellow-400"
          onClick={clearAnnotations}
        >
          Clear Annotations
        </button>
        <button
          className="px-3 py-1 rounded bg-slate-700 text-white"
          onClick={exportRoadmap}
        >
          Export JSON
        </button>
      </div>

      <div className="relative w-full h-[85vh] border rounded">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            fitView
            attributionPosition="bottom-left"
            className="absolute inset-0"
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </ReactFlowProvider>

        {/* Annotation canvas */}
        <canvas
          ref={canvasRef}
          width={typeof window !== "undefined" ? window.innerWidth : 800}
          height={typeof window !== "undefined" ? window.innerHeight : 600}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`absolute left-0 top-0 ${
            drawMode ? "pointer-events-auto" : "pointer-events-none"
          }`}
          style={{ zIndex: 20 }}
        />
      </div>
    </div>
  );
}
