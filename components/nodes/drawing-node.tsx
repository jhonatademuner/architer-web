import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"

type Point = {
  x: number
  y: number
}

type DrawingNodeData = {
  points: Point[]
  width: number
  height: number
  color: string
}

export const DrawingNode = memo(({ data }: NodeProps<DrawingNodeData>) => {
  const { points, width, height, color } = data

  if (!points || points.length < 2) {
    return null
  }

  return (
    <div
      style={{
        width: Math.max(width, 20),
        height: Math.max(height, 20),
        position: "relative",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${Math.max(width, 20)} ${Math.max(height, 20)}`}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <path
          d={`M ${points.map((p) => `${p.x},${p.y}`).join(" L ")}`}
          fill="none"
          stroke={color || "#000"}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2"
        style={{ right: -5, top: "50%", borderRadius: "50%", backgroundColor: color }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2"
        style={{ left: -5, top: "50%", borderRadius: "50%", backgroundColor: color }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2"
        style={{ bottom: -5, left: "50%", borderRadius: "50%", backgroundColor: color }}
      />
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2"
        style={{ top: -5, left: "50%", borderRadius: "50%", backgroundColor: color }}
      />
    </div>
  )
})

DrawingNode.displayName = "DrawingNode"
