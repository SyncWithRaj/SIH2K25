"use client";
import React, { useCallback, useState, useRef, useEffect, useMemo } from "react";
import Link from 'next/link';
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
import {
  FaPlus,
  FaEraser,
  FaPen,
  FaTrashAlt,
  FaSave,
  FaFolderOpen,
  FaDownload,
  FaArrowLeft,
} from "react-icons/fa";

// --- Initial Data ---
const initialNodes = [
  {
    id: "1",
    position: { x: 50, y: 50 },
    data: { label: "Start: Self-Assessment" },
    style: { padding: '12px 18px', borderRadius: 99, border: "1px solid #4f46e5", minWidth: 150, background: '#eef2ff', color: '#312e81', fontWeight: 500 },
  },
  {
    id: "2",
    position: { x: 350, y: 50 },
    data: { label: "Learn Fundamentals" },
    style: { padding: '12px 18px', borderRadius: 99, border: "1px solid #1a192b", minWidth: 150 },
  },
  {
    id: "3",
    position: { x: 650, y: 50 },
    data: { label: "Build Projects" },
    style: { padding: '12px 18px', borderRadius: 99, border: "1px solid #1a192b", minWidth: 150 },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: '#4f46e5' } },
  { id: "e2-3", source: "2", target: "3" },
];

// --- Reusable Action Button Component ---
const ActionButton = ({ onClick, children, className = "", isActive = false }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 shadow-sm ${isActive
      ? "bg-indigo-600 text-white shadow-md scale-105"
      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
      } ${className}`}
  >
    {children}
  </button>
);


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
  const [editedLabel, setEditedLabel] = useState("");

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
      } else {
        if (response.status !== 404) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to load roadmap');
        }
        setRoadmapExists(false);
      }
    } catch (error) {
      console.error("Failed to load user roadmap:", error);
      alert(`Failed to load your roadmap: ${error.message}`);
    }
  }, [user?.id]);

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
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to load default roadmap:", error);
      alert(`Failed to load the default roadmap: ${error.message}`);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      loadUserRoadmap();
    }
  }, [isLoaded, isSignedIn, loadUserRoadmap]);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId),
    [nodes, selectedNodeId]
  );

  useEffect(() => {
    if (selectedNode) {
      setEditedLabel(selectedNode.data.label);
    }
  }, [selectedNode]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#4f46e5' }, type: 'smoothstep' }, eds)),
    []
  );

  const addNode = () => {
    const id = uuidv4();
    const newNode = {
      id,
      position: {
        x: 100 + Math.random() * 400,
        y: 100 + Math.random() * 200,
      },
      data: { label: "New Step" },
      style: { padding: '12px 18px', borderRadius: 99, border: '1px solid #1a192b', minWidth: 150 },
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

  const handleSaveChanges = () => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNodeId) {
          return {
            ...node,
            data: { ...node.data, label: editedLabel },
          };
        }
        return node;
      })
    );
    setSelectedNodeId(null);
  };

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
    ctx.strokeStyle = '#1e293b';
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

  // ✅ FINAL, MOST ROBUST FIX
  const saveRoadmap = async () => {
    if (!user?.id) {
      alert("Please log in to save your roadmap.");
      return;
    }

    // --- THE FIX ---
    // Create "clean" versions of nodes and edges, only including properties
    // that are defined in your Mongoose schema. This strips out ALL internal
    // properties from React Flow (like width, height, dragging, selected, etc.)
    // and complex objects like `style` that cause database errors.
    const sanitizedNodes = nodes.map(node => ({
      id: node.id,
      position: node.position,
      data: node.data,
      // We explicitly DO NOT include the 'style' object here anymore.
      // If you need styling, it should be applied on the client-side
      // or stored differently in a schema-compliant way.
      type: node.type,
    }));

    const sanitizedEdges = edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      animated: edge.animated,
      // The same applies to edge styles.
      type: edge.type,
    }));

    const payload = { userId: user.id, nodes: sanitizedNodes, edges: sanitizedEdges };

    const method = roadmapExists ? 'PUT' : 'POST';
    const url = '/api/roadmap/save';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), // This payload is now guaranteed to be clean
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setRoadmapExists(true);
      alert(result.message || 'Roadmap saved successfully!');

    } catch (error) {
      console.error('Failed to save roadmap:', error);
      alert(`Failed to save roadmap: ${error.message}`);
    }
  };

  return (
    <div className="flex w-full h-[91vh] p-6 bg-slate-50 font-sans mt-18">
      <div className="flex-grow flex flex-col h-full">

        <div className="mb-2 text-center md:text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 leading-tight">
            Architect Your{' '}
            <span
              className="font-extrabold text-transparent bg-clip-text  bg-gradient-to-r from-indigo-600 to-blue-500 animate-gradient-x"
            >
              Ambition
            </span>

          </h1>
          <p className="mt-2 text-lg md:text-xl text-slate-500 w-full mx-auto md:mx-0">
            Your dynamic career blueprint for tomorrow's opportunities.
          </p>
        </div>


        <div className="flex gap-2 items-center mb-4 p-2 bg-white/60 backdrop-blur-lg border border-slate-200/80 rounded-full shadow-lg shadow-slate-300/10 flex-wrap">
          <Link href="/">
            <ActionButton><FaArrowLeft /> Back</ActionButton>
          </Link>
          <ActionButton onClick={addNode}><FaPlus /> Add Step</ActionButton>
          <ActionButton onClick={() => setEraserMode((s) => !s)} isActive={eraserMode} className={eraserMode ? 'bg-red-500 text-white hover:bg-red-600' : ''}>
            <FaEraser /> {eraserMode ? "Eraser: ON" : "Eraser"}
          </ActionButton>
          <ActionButton onClick={toggleDrawMode} isActive={drawMode} className={drawMode ? 'bg-emerald-500 text-white hover:bg-emerald-600' : ''}>
            <FaPen /> {drawMode ? "Draw: ON" : "Annotate"}
          </ActionButton>
          <ActionButton onClick={clearAnnotations}><FaTrashAlt /> Clear</ActionButton>

          <div className="flex-grow" />

          <ActionButton onClick={saveRoadmap} className="bg-blue-600 text-black hover:bg-blue-700"><FaSave /> Save</ActionButton>
          <ActionButton onClick={loadUserRoadmap}><FaFolderOpen /> Load My Roadmap</ActionButton>
          <ActionButton onClick={loadDefaultRoadmap}><FaDownload /> Load Default</ActionButton>
        </div>

        <div className="relative w-full h-full border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/60">
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
              className="absolute inset-0 bg-white"
            >
              <MiniMap nodeStrokeWidth={3} zoomable pannable />
              <Controls />
              <Background color="#eef2ff" gap={24} />
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
        <div className="w-96 flex-shrink-0 ml-6 p-1 bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-300/40 flex flex-col">
          <div className="p-5 border-b border-slate-200">
            <h3 className="text-xl font-semibold text-slate-800">Edit Step</h3>
          </div>
          <div className="p-5 flex-grow">
            <label htmlFor="node-label" className="block text-sm font-medium text-slate-600 mb-2">
              Title
            </label>
            <div className="group relative">
              <input
                id="node-label"
                type="text"
                className="w-full pl-3 pr-10 py-2 bg-slate-50 border-2 border-slate-200 rounded-lg shadow-inner transition-colors focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                value={editedLabel}
                onChange={(e) => setEditedLabel(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveChanges()}
              />
            </div>
          </div>
          <div className="flex gap-3 p-5 border-t border-slate-200 bg-slate-50/50 rounded-b-2xl">
            <button
              className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105 shadow-sm"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
            <button
              className="flex-1 px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-full hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-colors"
              onClick={() => setSelectedNodeId(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

