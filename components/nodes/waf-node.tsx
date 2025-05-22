"use client"

import type React from "react"
import { type NodeProps } from "reactflow"
import { BaseNode, type BaseNodeData } from "./base-node"

export function WAFNode(props: NodeProps<BaseNodeData>) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )

  return (
    <BaseNode
      {...props}
      defaultLabel="WAF"
      subtitle="WAF"
      icon={icon}
    />
  )
} 