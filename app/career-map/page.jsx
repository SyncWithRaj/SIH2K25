"use client";
import React, { useCallback, useState, useRef, useEffect, useMemo } from "react";
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
import { useUser } from "@clerk/nextjs";

// ✅ Moved initialNodes and initialEdges outside the component
// This ensures they have a stable reference and don't cause re-renders.
const initialNodes = [
  {
    id: "1",
    position: { x: 50, y: 50 },
    data: { label: "Start: Self-Assessment" },
    style: { padding: 10, borderRadius: 8, border: '1px solid #1a192b', minWidth: 150 },
  },
  {
    id: "2",
    position: { x: 350, y: 50 },
    data: { label: "Learn Fundamentals" },
    style: { padding: 10, borderRadius: 8, border: '1px solid #1a192b', minWidth: 150 },
  },
  {
    id: "3",
    position: { x: 650, y: 50 },
    data: { label: "Build Projects" },
    style: { padding: 10, borderRadius: 8, border: '1px solid #1a192b', minWidth: 150 },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
];

export default function CareerRoadmapCanvas() {
  const { user, isLoaded, isSignedIn } = useUser();
  
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [eraserMode, setEraserMode] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  const [roadmapExists, setRoadmapExists] = useState(false);
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // This function loads the roadmap specific to the logged-in user.
  const loadUserRoadmap = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`/api/roadmap/load?userId=${user.id}`);
      if (response.ok) {
        const { data } = await response.json();
        if (data && data.nodes && data.edges) {
          setNodes(data.nodes);
          setEdges(data.edges);
          setRoadmapExists(true);
        } else {
          setNodes(initialNodes);
          setEdges(initialEdges);
          setRoadmapExists(false);
        }
      }
    } catch (error) {
      console.error("Failed to load user roadmap:", error);
      alert('Failed to load your roadmap.');
    }
  // ✅ Updated dependencies to only include what's necessary
  }, [user?.id]);

  // This function loads a default roadmap template.
  const loadDefaultRoadmap = async () => {
    try {
      const response = await fetch('/api/roadmap/load-default'); 
      if (response.ok) {
        const { data } = await response.json();
        if (data) {
          setNodes(data.nodes);
          setEdges(data.edges);
          alert('Default roadmap loaded successfully!');
        } else {
           alert('Default roadmap could not be found.');
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to load default roadmap:", error);
      alert('Failed to load the default roadmap.');
    }
  };


  useEffect(() => {
    if (isLoaded && isSignedIn) {
      loadUserRoadmap();
    }
  // ✅ The dependency array is now stable, preventing the infinite loop.
  }, [isLoaded, isSignedIn, loadUserRoadmap]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

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
      style: { padding: 10, borderRadius: 8, border: '1px solid #1a192b', minWidth: 150 },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const onNodeClick = (_event, node) => {
    if (eraserMode) {
      setNodes((nds) => nds.filter((n) => n.id !== node.id));
      setEdges(
        (eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id)
      );
      setSelectedNodeId(null);
    } else {
      setSelectedNodeId(node.id);
    }
  };

  const onEdgeClick = (_event, edge) => {
    if (eraserMode) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
  };

  const handleNodeLabelChange = (e) => {
    const newLabel = e.target.value;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              label: newLabel,
            },
          };
        }
        return node;
      })
    );
  };
  
  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId),
    [nodes, selectedNodeId]
  );

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

  const saveRoadmap = async () => {
    if (!user?.id) {
      alert("Please log in to save your roadmap.");
      return;
    }
    const payload = { userId: user.id, nodes, edges };
    const method = roadmapExists ? 'PUT' : 'POST';
    const url = '/api/roadmap/save';
    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setRoadmapExists(true);
      alert('Roadmap saved/updated successfully!');
    } catch (error) {
      console.error('Failed to save roadmap:', error);
      alert('Failed to save roadmap.');
    }
  };

  return (
    <div className="flex w-full h-screen p-4 bg-gray-50">
      <div className="flex-grow flex flex-col h-full">
        <div className="flex gap-3 items-center mb-3 flex-wrap">
            <button className="px-3 py-1 rounded bg-indigo-600 text-white" onClick={addNode}>Add Step</button>
            <button className={`px-3 py-1 rounded ${eraserMode ? "bg-red-500 text-white" : "bg-gray-200"}`} onClick={() => setEraserMode((s) => !s)}>
                {eraserMode ? "Eraser: ON" : "Eraser"}
            </button>
            <button className={`px-3 py-1 rounded ${drawMode ? "bg-green-600 text-white" : "bg-gray-200"}`} onClick={toggleDrawMode}>
                {drawMode ? "Draw: ON" : "Annotate"}
            </button>
            <button className="px-3 py-1 rounded bg-yellow-400" onClick={clearAnnotations}>Clear Annotations</button>
            <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={saveRoadmap}>Save Roadmap</button>
            <button className="px-3 py-1 rounded bg-cyan-500 text-white" onClick={loadUserRoadmap}>Load My Roadmap</button>
            <button className="px-3 py-1 rounded bg-purple-500 text-white" onClick={loadDefaultRoadmap}>Load Default Roadmap</button>
        </div>

        <div className="relative w-full h-full border rounded">
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

          <canvas
            ref={canvasRef}
            width={typeof window !== "undefined" ? window.innerWidth : 800}
            height={typeof window !== "undefined" ? window.innerHeight : 600}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={`absolute left-0 top-0 ${drawMode ? "pointer-events-auto" : "pointer-events-none"}`}
            style={{ zIndex: 20 }}
          />
        </div>
      </div>

      {selectedNode && (
        <div className="w-80 flex-shrink-0 ml-4 p-4 bg-white border rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">Edit Node</h3>
          <div className="mb-4">
            <label htmlFor="node-label" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="node-label"
              type="text"
              className="w-full px-2 py-1 border border-gray-300 rounded-md"
              value={selectedNode.data.label}
              onChange={handleNodeLabelChange}
            />
          </div>
          <button
            className="w-full px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300"
            onClick={() => setSelectedNodeId(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

