"use client"

import type React from "react"
import { type NodeProps } from "reactflow"
import { BaseNode, type BaseNodeData } from "./base-node"

export function QueueNode(props: NodeProps<BaseNodeData>) {
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
      <path d="M3 7h18" />
      <path d="M3 11h18" />
      <path d="M3 15h18" />
      <path d="M3 19h18" />
    </svg>
  )

  return (
    <BaseNode
      {...props}
      defaultLabel="Queue"
      subtitle="Queue"
      icon={icon}
    />
  )
}
