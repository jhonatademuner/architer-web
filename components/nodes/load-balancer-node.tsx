"use client"

import type React from "react"
import { type NodeProps } from "reactflow"
import { BaseNode, type BaseNodeData } from "./base-node"

export function LoadBalancerNode(props: NodeProps<BaseNodeData>) {
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
      <path d="M4 12h16" />
      <path d="M12 4v16" />
      <path d="m8 8-4 4 4 4" />
      <path d="m16 8 4 4-4 4" />
      <path d="m8 16 4 4 4-4" />
      <path d="m8 8 4-4 4 4" />
    </svg>
  )

  return (
    <BaseNode
      {...props}
      defaultLabel="Load Balancer"
      subtitle="Load Balancer"
      icon={icon}
    />
  )
}
