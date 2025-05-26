"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  updateEdge,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
  type EdgeTypes,
  MarkerType,
  useReactFlow,
  ReactFlowProvider,
  Panel,
  SelectionMode,
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { ServiceNode } from "./nodes/service-node"
import { DatabaseNode } from "./nodes/database-node"
import { ClientNode } from "./nodes/client-node"
import { LoadBalancerNode } from "./nodes/load-balancer-node"
import { CacheNode } from "./nodes/cache-node"
import { QueueNode } from "./nodes/queue-node"
import {
  ChevronLeft,
  ChevronRight,
  Circle,
  Eraser,
  HelpCircle,
  Keyboard,
  Pencil,
  Square,
  Star,
  Triangle,
} from "lucide-react"
import { CustomEdge } from "./edges/custom-edge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CDNNode } from "./nodes/cdn-node"
import { ProxyNode } from "./nodes/proxy-node"
import { ApiGatewayNode } from "./nodes/api-gateway-node"
import { ObjectStorageNode } from "./nodes/object-storage-node"
import { ConsumersNode } from "./nodes/consumers-node"
import { WAFNode } from "./nodes/waf-node"
import { ThemeToggle } from "./theme-toggle"

const DEFAULT_NODE_WIDTH = 180
const DEFAULT_NODE_HEIGHT = 60

const nodeTypes: NodeTypes = {
  service: ServiceNode,
  database: DatabaseNode,
  client: ClientNode,
  loadBalancer: LoadBalancerNode,
  cache: CacheNode,
  queue: QueueNode,
  cdn: CDNNode,
  proxy: ProxyNode,
  apiGateway: ApiGatewayNode,
  objectStorage: ObjectStorageNode,
  consumers: ConsumersNode,
  waf: WAFNode,
}

// Custom edge types
const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

const initialNodes: Node[] = [
  {
    id: "1",
    type: "client",
    position: { x: 100, y: 100 },
    style: { width: DEFAULT_NODE_WIDTH, height: DEFAULT_NODE_HEIGHT },
    data: { label: "Client", color: "#3b82f6" },
  },
]

// Edge connection types
const connectionTypes = [
  { id: "bezier", label: "Bezier" },
  { id: "step", label: "Step" },
  { id: "smoothstep", label: "Smooth Step" },
  { id: "straight", label: "Straight" },
]

// Edge thickness options
const edgeThicknessOptions = [
  { id: "thin", label: "Thin", value: 1 },
  { id: "medium", label: "Medium", value: 2 },
  { id: "thick", label: "Thick", value: 3 },
  { id: "extra-thick", label: "Extra Thick", value: 4 },
]

// Node colors
const nodeColors = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Orange", value: "#f97316" },
  { name: "Red", value: "#ef4444" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Pink", value: "#ec4899" },
  { name: "Yellow", value: "#eab308" },
  { name: "Gray", value: "#6b7280" },
]

// Shape types
const shapeTypes = [
  { id: "rectangle", label: "Rectangle", icon: Square },
  { id: "circle", label: "Circle", icon: Circle },
  { id: "triangle", label: "Triangle", icon: Triangle },
  { id: "star", label: "Star", icon: Star },
]

// Keyboard shortcuts
const keyboardShortcuts = [
  { key: "Delete", description: "Delete selected node or edge" },
  { key: "Ctrl + Z", description: "Undo" },
  { key: "Ctrl + Y", description: "Redo" },
  { key: "Ctrl + A", description: "Select all nodes" },
  { key: "Ctrl + D", description: "Duplicate selected node" },
  { key: "Ctrl + C", description: "Copy selected node" },
  { key: "Ctrl + V", description: "Paste copied node" },
  { key: "Ctrl + S", description: "Save diagram (when implemented)" },
  { key: "P", description: "Toggle pencil tool" },
  { key: "E", description: "Toggle eraser tool" },
  { key: "Esc", description: "Exit current tool mode" },
  { key: "Space + Drag", description: "Pan the canvas" },
  { key: "Shift + Scroll", description: "Zoom in/out" },
]

// Vector shape type
type VectorShape = {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  color: string
  label?: string
}

// Drawing type
type Drawing = {
  id: string
  points: { x: number; y: number }[]
  color: string
  width: number
}

// Wrapper component that provides the ReactFlow context
export function DiagramEditor() {
  return (
    <ReactFlowProvider>
      <DiagramEditorContent />
    </ReactFlowProvider>
  )
}

// The actual diagram editor content
function DiagramEditorContent() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const { getViewport, screenToFlowPosition, project } = useReactFlow()
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)
  const [selectedConnectionType, setSelectedConnectionType] = useState(connectionTypes[0].id)
  const [edgeThickness, setEdgeThickness] = useState(edgeThicknessOptions[1].value)
  const [selectedColor, setSelectedColor] = useState(nodeColors[0].value)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [copiedNode, setCopiedNode] = useState<Node | null>(null)
  const [activeTab, setActiveTab] = useState("style")

  // Add history state for undo/redo functionality
  const [history, setHistory] = useState<{
    nodes: Node[][]
    edges: Edge[][]
    currentIndex: number
  }>({
    nodes: [initialNodes],
    edges: [[]],
    currentIndex: 0,
  })

  // Add a function to save the current state to history
  const saveToHistory = useCallback(() => {
    // Create a new history entry
    const newHistory = {
      ...history,
      nodes: [...history.nodes.slice(0, history.currentIndex + 1), [...nodes]],
      edges: [...history.edges.slice(0, history.currentIndex + 1), [...edges]],
      currentIndex: history.currentIndex + 1,
    }
    setHistory(newHistory)
  }, [history, nodes, edges])

  // Add undo function
  const undo = useCallback(() => {
    if (history.currentIndex > 0) {
      const newIndex = history.currentIndex - 1
      setNodes(history.nodes[newIndex])
      setEdges(history.edges[newIndex])
      setHistory({
        ...history,
        currentIndex: newIndex,
      })
    }
  }, [history])

  // Add redo function
  const redo = useCallback(() => {
    if (history.currentIndex < history.nodes.length - 1) {
      const newIndex = history.currentIndex + 1
      setNodes(history.nodes[newIndex])
      setEdges(history.edges[newIndex])
      setHistory({
        ...history,
        currentIndex: newIndex,
      })
    }
  }, [history])

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      const type = event.dataTransfer.getData("application/reactflow")

      if (!type) {
        return
      }

      const bounds = reactFlowWrapper.current?.getBoundingClientRect()
      if (!bounds) return

      const position = {
        x: (event.clientX - bounds.left - getViewport().x) / getViewport().zoom,
        y: (event.clientY - bounds.top - getViewport().y) / getViewport().zoom,
      }

      const newNode = {
        id: `${Date.now()}`,
        type,
        position,
        style: { width: DEFAULT_NODE_WIDTH, height: DEFAULT_NODE_HEIGHT },
        data: {
          label: getDefaultLabel(type),
          color: selectedColor,
          onLabelChange: updateNodeLabel,
        },
      }
      setNodes((nds) => nds.concat(newNode))
      setTimeout(() => saveToHistory(), 0)
    },
    [getViewport, setNodes, selectedColor, saveToHistory],
  )

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const newEdge = {
        ...params,
        type: "custom",
        data: {
          connectionType: selectedConnectionType || "bezier",
          markerStartType: "none",
          markerEndType: "none",
          thickness: edgeThickness,
          color: selectedColor,
        },
      }
      setEdges((eds) => addEdge(newEdge, eds))
      setTimeout(() => saveToHistory(), 0)
    },
    [setEdges, selectedConnectionType, edgeThickness, selectedColor, saveToHistory],
  )

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      const edgeData = oldEdge.data || {}
      setEdges((els) => updateEdge(oldEdge, { ...newConnection, data: edgeData } as Connection & { data: any }, els))
    },
    [setEdges],
  )

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const getDefaultLabel = (type: string) => {
    switch (type) {
      case "service":
        return "Service"
      case "database":
        return "Database"
      case "client":
        return "Client"
      case "loadBalancer":
        return "Load Balancer"
      case "cache":
        return "Cache"
      case "queue":
        return "Queue"
      case "cdn":
        return "CDN"
      case "proxy":
        return "Proxy"
      case "apiGateway":
        return "API Gateway"
      case "objectStorage":
        return "Object Storage"
      case "consumers":
        return "Consumers"
      case "waf":
        return "WAF"        
      default:
        return "Node"
    }
  }

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  const clearCanvas = () => {
    setNodes([])
    setEdges([])
    setTimeout(() => saveToHistory(), 0)
  }

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    event.stopPropagation()
    setSelectedNode(node)
    setSelectedEdge(null)
    setActiveTab("style")
  }

  const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation()
    setSelectedEdge(edge)
    setSelectedNode(null)
    // Set the connection type from the edge data
    if (edge.data?.connectionType) {
      setSelectedConnectionType(edge.data.connectionType)
    }
    // Switch to the connection tab
    setActiveTab("connection")
  }

  const updateNodeLabel = (nodeId: string, newLabel: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              label: newLabel,
            },
          }
        }
        return node
      }),
    )
  }

  const updateNodeColor = (color: string) => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                color: color,
              },
            }
          }
          return node
        }),
      )
    } else if (selectedEdge) {
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === selectedEdge.id) {
            return {
              ...edge,
              data: {
                ...edge.data,
                color: color,
              },
            }
          }
          return edge
        }),
      )
    }
  }

  const updateEdgeStyle = (connectionType: string) => {
    if (!selectedEdge) return
    let updatedEdge: Edge | undefined;
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === selectedEdge.id) {
          updatedEdge = {
            ...edge,
            data: {
              ...edge.data,
              connectionType: connectionType,
              // markerEnd and markerStart will be handled separately
            },
          };
          return updatedEdge;
        }
        return edge;
      }),
    );
    if (updatedEdge) {
      setSelectedEdge(updatedEdge); // Re-select the edge to trigger UI update for buttons
      setSelectedConnectionType(connectionType); // Update the selected connection type
    }
    setTimeout(() => saveToHistory(), 0);
  }

  const updateEdgeArrowhead = (end: 'start' | 'end', type: 'none' | 'arrow') => {
    if (!selectedEdge) return;
    let updatedEdge: Edge | undefined;
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === selectedEdge.id) {
          updatedEdge = {
            ...edge,
            data: {
              ...edge.data,
              [end === 'start' ? 'markerStartType' : 'markerEndType']: type,
            },
          };
          return updatedEdge;
        }
        return edge;
      }),
    );
    if (updatedEdge) {
      setSelectedEdge(updatedEdge); // Re-select the edge to trigger UI update for buttons
    }
    setTimeout(() => saveToHistory(), 0); 
  };

  const updateEdgeThickness = (thickness: number) => {
    if (!selectedEdge) return
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === selectedEdge.id) {
          return {
            ...edge,
            data: {
              ...edge.data,
              thickness,
            },
          }
        }
        return edge
      }),
    )
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }
      if (event.key === "Escape") {
        // No tool modes to exit from
      }
      if (event.key === "Delete") {
        if (selectedNode) {
          setNodes((nodes) => nodes.filter((node) => node.id !== selectedNode.id))
          setSelectedNode(null)
          setTimeout(() => saveToHistory(), 0)
        } else if (selectedEdge) {
          setEdges((edges) => edges.filter((edge) => edge.id !== selectedEdge.id))
          setSelectedEdge(null)
          setTimeout(() => saveToHistory(), 0)
        }
      }
      if (event.ctrlKey && (event.key === "z" || event.key === "Z")) {
        event.preventDefault()
        undo()
      }
      if (
        (event.ctrlKey && (event.key === "y" || event.key === "Y")) ||
        (event.ctrlKey && event.shiftKey && (event.key === "z" || event.key === "Z"))
      ) {
        event.preventDefault()
        redo()
      }
      if (event.ctrlKey && (event.key === "c" || event.key === "C") && selectedNode) {
        setCopiedNode(selectedNode)
      }
      if (event.ctrlKey && (event.key === "v" || event.key === "V") && copiedNode) {
        const newNode = {
          ...copiedNode,
          id: `${Date.now()}`,
          position: {
            x: copiedNode.position.x + 50,
            y: copiedNode.position.y + 50,
          },
        }
        setNodes((nds) => nds.concat(newNode))
        setTimeout(() => saveToHistory(), 0)
      }
      if (event.ctrlKey && (event.key === "d" || event.key === "D") && selectedNode) {
        event.preventDefault() 
        const newNode = {
          ...selectedNode,
          id: `${Date.now()}`,
          position: {
            x: selectedNode.position.x + 50,
            y: selectedNode.position.y + 50,
          },
        }
        setNodes((nds) => nds.concat(newNode))
        setTimeout(() => saveToHistory(), 0)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [
    selectedNode,
    selectedEdge,
    copiedNode,
    undo,
    redo,
    saveToHistory,
  ])

  useEffect(() => {
    setHistory({
      nodes: [initialNodes],
      edges: [[]],
      currentIndex: 0,
    })
  }, [])

  return (
    <div className="h-full flex">
      {!isSidebarOpen && (
        <button
          className="absolute left-0 top-1/2 z-10 bg-background border border-border rounded-r-md p-1 shadow-md"
          onClick={() => setIsSidebarOpen(true)}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
      <div
        className={`${isSidebarOpen ? "w-64" : "w-0 -ml-64"
          } border-r border-border bg-background overflow-y-auto flex flex-col transition-all duration-300 ease-in-out z-10`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-medium">Design Tools</h3>
          <div className="flex gap-1">
            <ThemeToggle />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Keyboard className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Keyboard Shortcuts</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 mt-4">
                  {keyboardShortcuts.map((shortcut, index) => (
                    <div key={shortcut.key}>
                      <div className="flex justify-between">
                        <kbd className="px-2 py-1 bg-muted rounded text-xs font-semibold flex-nowrap text-nowrap">{shortcut.key}</kbd>
                        <span className="text-sm">{shortcut.description}</span>
                      </div>
                      {index < keyboardShortcuts.length - 1 && <div className="border-b border-border my-1" />}
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)} className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium">Components</h4>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h5 className="font-medium">Instructions</h5>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• Drag components onto the canvas</li>
                      <li>• Connect nodes by dragging from one handle to another</li>
                      <li>• Double-click on a node to edit its label</li>
                      <li>• Click on a node or edge to select it and change its properties</li>
                      <li>• Use keyboard shortcuts for faster workflow</li>
                    </ul>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div
                className="border border-border rounded-md p-2 flex flex-col items-center justify-center cursor-grab bg-card shadow-sm hover:shadow-md transition-shadow"
                onDragStart={(event) => onDragStart(event, "client")}
                draggable
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-600"
                  >
                    <rect width="16" height="12" x="4" y="2" rx="2" />
                    <rect width="8" height="8" x="8" y="14" rx="2" />
                  </svg>
                </div>
                <span className="text-xs font-medium">Client</span>
              </div>

              <div
                className="border border-border rounded-md p-2 flex flex-col items-center justify-center cursor-grab bg-card shadow-sm hover:shadow-md transition-shadow"
                onDragStart={(event) => onDragStart(event, "service")}
                draggable
              >
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-600"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M7 7h.01" />
                    <path d="M17 7h.01" />
                    <path d="M7 17h.01" />
                    <path d="M17 17h.01" />
                  </svg>
                </div>
                <span className="text-xs font-medium">Service</span>
              </div>

              <div
                className="border border-border rounded-md p-2 flex flex-col items-center justify-center cursor-grab bg-card shadow-sm hover:shadow-md transition-shadow"
                onDragStart={(event) => onDragStart(event, "database")}
                draggable
              >
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-600"
                  >
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
                  </svg>
                </div>
                <span className="text-xs font-medium">Database</span>
              </div>

              <div
                className="border border-border rounded-md p-2 flex flex-col items-center justify-center cursor-grab bg-card shadow-sm hover:shadow-md transition-shadow"
                onDragStart={(event) => onDragStart(event, "loadBalancer")}
                draggable
              >
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-orange-600"
                  >
                    <path d="m2 7 10 7 10-7" />
                    <path d="M2 17h20" />
                  </svg>
                </div>
                <span className="text-xs font-medium">Load Balancer</span>
              </div>

              <div
                className="border border-border rounded-md p-2 flex flex-col items-center justify-center cursor-grab bg-card shadow-sm hover:shadow-md transition-shadow"
                onDragStart={(event) => onDragStart(event, "cache")}
                draggable
              >
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-600"
                  >
                    <path d="M12 2v8" />
                    <path d="m4.93 10.93 1.41 1.41" />
                    <path d="M2 18h2" />
                    <path d="M20 18h2" />
                    <path d="m19.07 10.93-1.41 1.41" />
                    <path d="M22 22H2" />
                    <path d="M16 6 8 14" />
                    <path d="m8 6 8 8" />
                  </svg>
                </div>
                <span className="text-xs font-medium">Cache</span>
              </div>

              <div
                className="border border-border rounded-md p-2 flex flex-col items-center justify-center cursor-grab bg-card shadow-sm hover:shadow-md transition-shadow"
                onDragStart={(event) => onDragStart(event, "queue")}
                draggable
              >
                <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-teal-600"
                  >
                    <path d="M2 12h20" />
                    <path d="M2 17h20" />
                    <path d="M2 7h20" />
                  </svg>
                </div>
                <span className="text-xs font-medium">Queue</span>
              </div>


              <div
                className="border border-border rounded-md p-2 flex flex-col items-center justify-center cursor-grab bg-card shadow-sm hover:shadow-md transition-shadow"
                onDragStart={(event) => onDragStart(event, "cdn")}
                draggable
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-600"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                  </svg>
                </div>
                <span className="text-xs font-medium">CDN</span>
              </div>

              <div
                className="border border-border rounded-md p-2 flex flex-col items-center justify-center cursor-grab bg-card shadow-sm hover:shadow-md transition-shadow"
                onDragStart={(event) => onDragStart(event, "proxy")}
                draggable
              >
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-600"
                  >
                    <path d="M4 12h16" />
                    <path d="M12 4v16" />
                    <path d="m5 5 14 14" />
                    <path d="M19 5 5 19" />
                  </svg>
                </div>
                <span className="text-xs font-medium">Proxy</span>
              </div>

              <div
                className="border border-border rounded-md p-2 flex flex-col items-center justify-center cursor-grab bg-card shadow-sm hover:shadow-md transition-shadow"
                onDragStart={(event) => onDragStart(event, "apiGateway")}
                draggable
              >
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-600"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M8 12h8" />
                    <path d="M12 8v8" />
                    <path d="M3 12h3" />
                    <path d="M18 12h3" />
                  </svg>
                </div>
                <span className="text-xs font-medium">API Gateway</span>
              </div>

              <div
                className="border border-border rounded-md p-2 flex flex-col items-center justify-center cursor-grab bg-card shadow-sm hover:shadow-md transition-shadow"
                onDragStart={(event) => onDragStart(event, "objectStorage")}
                draggable
              >
                <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-yellow-600"
                  >
                    <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" />
                    <path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3" />
                    <path d="M4 12h16" />
                    <path d="M9 12v4" />
                    <path d="M15 12v4" />
                  </svg>
                </div>
                <span className="text-xs font-medium">Object Storage</span>
              </div>

              <div
                className="border border-border rounded-md p-2 flex flex-col items-center justify-center cursor-grab bg-card shadow-sm hover:shadow-md transition-shadow"
                onDragStart={(event) => onDragStart(event, "consumers")}
                draggable
              >
                <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-pink-600"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <span className="text-xs font-medium">Consumers</span>
              </div>

              <div
                className="border border-border rounded-md p-2 flex flex-col items-center justify-center cursor-grab bg-card shadow-sm hover:shadow-md transition-shadow"
                onDragStart={(event) => onDragStart(event, "waf")}
                draggable
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-600"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                </div>
                <span className="text-xs font-medium">WAF</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3">Properties</h4>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="style" className="flex-1">
                  Style
                </TabsTrigger>
                <TabsTrigger value="connection" className="flex-1">
                  Connection
                </TabsTrigger>
              </TabsList>
              <TabsContent value="style" className="mt-2">
                <div className="space-y-4">
                  <div>
                    <h5 className="text-xs font-medium mb-2">Color</h5>
                    <div className="grid grid-cols-3 gap-2">
                      {nodeColors.map((color) => (
                        <button
                          key={color.value}
                          className={`w-full h-8 rounded-md border border-border ${selectedColor === color.value ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => {
                            setSelectedColor(color.value)
                            updateNodeColor(color.value)
                          }}
                          title={color.name}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {selectedNode || selectedEdge
                        ? "Click a color to apply to selected item"
                        : "Select an item first or set default color for new items"}
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="connection" className="mt-2">
                <div className="space-y-4">
                  <div>
                    <h5 className="text-xs font-medium mb-2">Connection Type</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {connectionTypes.map((type) => (
                        <Button
                          key={type.id}
                          variant={selectedConnectionType === type.id ? "default" : "outline"}
                          size="sm"
                          className="h-auto py-2 justify-start"
                          onClick={() => {
                            if (selectedEdge) {
                              setSelectedConnectionType(type.id);
                              updateEdgeStyle(type.id);
                            }
                          }}
                          disabled={!selectedEdge}
                        >
                          <div className="flex flex-col items-start">
                            <span className="text-xs">{type.label}</span>
                            <div className="w-full h-4 flex items-center mt-1">
                              <div
                                className="flex-1 h-0.5 bg-current"
                                style={{
                                  borderTop: type.id === "dashed" ? "1px dashed currentColor" : 
                                             type.id === "dotted" ? "1px dotted currentColor" : undefined,
                                }}
                              />
                              {/* Visual indicator for path type, not functional arrow */}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-medium mb-2">Start Arrowhead</h5>
                    <div className="flex gap-2">
                      <Button 
                        variant={selectedEdge?.data?.markerStartType === 'none' ? 'default' : 'outline'}
                        size="sm" 
                        onClick={() => updateEdgeArrowhead('start', 'none')}
                        disabled={!selectedEdge}
                      >
                        None
                      </Button>
                      <Button 
                        variant={selectedEdge?.data?.markerStartType === 'arrow' ? 'default' : 'outline'}
                        size="sm" 
                        onClick={() => updateEdgeArrowhead('start', 'arrow')}
                        disabled={!selectedEdge}
                      >
                        Arrow
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-medium mb-2">End Arrowhead</h5>
                    <div className="flex gap-2">
                      <Button 
                        variant={selectedEdge?.data?.markerEndType === 'none' ? 'default' : 'outline'}
                        size="sm" 
                        onClick={() => updateEdgeArrowhead('end', 'none')}
                        disabled={!selectedEdge}
                      >
                        None
                      </Button>
                      <Button 
                        variant={selectedEdge?.data?.markerEndType === 'arrow' ? 'default' : 'outline'}
                        size="sm" 
                        onClick={() => updateEdgeArrowhead('end', 'arrow')}
                        disabled={!selectedEdge}
                      >
                        Arrow
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-medium mb-2">Line Thickness: {edgeThickness}px</h5>
                    <Slider
                      value={[edgeThickness]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => {
                        setEdgeThickness(value[0])
                        if (selectedEdge) {
                          updateEdgeThickness(value[0])
                        }
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <Button variant="outline" size="sm" onClick={clearCanvas} className="w-full border-border">
            Clear Canvas
          </Button>
        </div>
      </div>

      <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeUpdate={onEdgeUpdate}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultViewport={{ x: 0, y: 0, zoom: 1.5 }}
          deleteKeyCode="Delete"
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={() => {
            setSelectedNode(null)
            setSelectedEdge(null)
            setActiveTab("style")
          }}
          panOnScroll
          selectionOnDrag
          panOnDrag={true}
          elementsSelectable={true}
          selectionMode={SelectionMode.Full}
          className="dark:bg-background"
        >
          <Controls 
            className="dark:bg-[#32373e] dark:border-border [&>button]:dark:bg-[#32373e] [&>button]:dark:border-border [&>button]:dark:hover:bg-muted [&>button]:dark:text-foreground [&>button>svg]:dark:fill-white [&>button>svg]:dark:stroke-white" 
          />
          <Background className="dark:bg-background" />
        </ReactFlow>
      </div>
    </div>
  )
}
