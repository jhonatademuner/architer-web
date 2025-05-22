"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Handle, Position, type NodeProps } from "reactflow"

export interface BaseNodeData {
  label?: string
  color?: string
  style?: {
    width: number
    height: number
  }
  onLabelChange?: (id: string, label: string) => void
}

interface BaseNodeProps extends NodeProps<BaseNodeData> {
  defaultLabel: string
  subtitle: string
  icon: React.ReactNode
}

export function BaseNode({ id, data, defaultLabel, subtitle, icon }: BaseNodeProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(data.label || defaultLabel)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (data.onLabelChange) {
      data.onLabelChange(id, label)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false)
      if (data.onLabelChange) {
        data.onLabelChange(id, label)
      }
    }
  }

  const borderColor = data.color || "#10b981"

  return (
    <div
      className="w-full h-full shadow-md rounded-md bg-background border-2 flex flex-col"
      style={{ 
        borderColor,
        width: data.style?.width,
        height: data.style?.height,
      }}
      onDoubleClick={handleDoubleClick}
    >
      <div className="flex items-center px-2.5 gap-2 flex-grow">
        <div
          className="rounded-full w-7 h-7 flex-shrink-0 flex items-center justify-center"
          style={{ backgroundColor: `${borderColor}20` }}
        >
          {icon}
        </div>
        <div className="flex-grow min-w-0 flex flex-col justify-center">
          {isEditing ? (
            <input
              ref={inputRef}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="text-sm font-bold p-0 border-0 focus:outline-none focus:ring-0 w-full bg-background text-foreground"
              autoFocus
            />
          ) : (
            <div className="text-sm font-bold truncate text-foreground leading-none mb-0.5">{label}</div>
          )}
          <div className="text-[10px] text-muted-foreground leading-none">{subtitle}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="w-2 h-2"
        style={{ top: -5, left: "33%", borderRadius: "50%", backgroundColor: borderColor }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        className="w-2 h-2"
        style={{ top: -5, left: "66%", borderRadius: "50%", backgroundColor: borderColor }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="w-2 h-2"
        style={{ bottom: -5, left: "33%", borderRadius: "50%", backgroundColor: borderColor }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className="w-2 h-2"
        style={{ bottom: -5, left: "66%", borderRadius: "50%", backgroundColor: borderColor }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="w-2 h-2"
        style={{ right: -5, top: "33%", borderRadius: "50%", backgroundColor: borderColor }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="w-2 h-2"
        style={{ right: -5, top: "66%", borderRadius: "50%", backgroundColor: borderColor }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="w-2 h-2"
        style={{ left: -5, top: "33%", borderRadius: "50%", backgroundColor: borderColor }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className="w-2 h-2"
        style={{ left: -5, top: "66%", borderRadius: "50%", backgroundColor: borderColor }}
      />
    </div>
  )
} 