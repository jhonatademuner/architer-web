"use client"

import type React from "react"
import { type NodeProps } from "reactflow"
import { BaseNode, type BaseNodeData } from "./base-node"

export function CDNNode(props: NodeProps<BaseNodeData>) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  )

  return (
    <BaseNode
      {...props}
      defaultLabel="CDN"
      subtitle="CDN"
      icon={icon}
    />
  )
} 