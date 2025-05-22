"use client"

import type React from "react"
import { type NodeProps } from "reactflow"
import { BaseNode, type BaseNodeData } from "./base-node"

export function DatabaseNode(props: NodeProps<BaseNodeData>) {
  const icon = (
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
      style={{ color: props.data.color || "#10b981" }}
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  )

  return (
    <BaseNode
      {...props}
      defaultLabel="Database"
      subtitle="Database"
      icon={icon}
    />
  )
}
