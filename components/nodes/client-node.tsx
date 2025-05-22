"use client"

import type React from "react"
import { type NodeProps } from "reactflow"
import { BaseNode, type BaseNodeData } from "./base-node"

export function ClientNode(props: NodeProps<BaseNodeData>) {
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
      <path d="M3 12a3 3 0 0 0 3-3V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3a3 3 0 0 0 3 3" />
      <path d="M9 18h6" />
      <path d="M12 12v6" />
    </svg>
  )

  return (
    <BaseNode
      {...props}
      defaultLabel="Client"
      subtitle="Client"
      icon={icon}
    />
  )
}
