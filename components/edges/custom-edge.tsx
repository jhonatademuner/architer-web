"use client"

import { useCallback } from "react"
import { type EdgeProps, getSmoothStepPath, getStraightPath, getBezierPath } from "reactflow"

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}: EdgeProps) {
  const getPath = useCallback(() => {
    const connectionType = data?.connectionType || "bezier"

    switch (connectionType) {
      case "step":
        return getSmoothStepPath({
          sourceX,
          sourceY,
          sourcePosition,
          targetX,
          targetY,
          targetPosition,
        })
      case "smoothstep":
        return getSmoothStepPath({
          sourceX,
          sourceY,
          sourcePosition,
          targetX,
          targetY,
          targetPosition,
          borderRadius: 10,
        })
      case "straight":
        return getStraightPath({
          sourceX,
          sourceY,
          targetX,
          targetY,
        })
      case "bezier":
      default:
        return getBezierPath({
          sourceX,
          sourceY,
          sourcePosition,
          targetX,
          targetY,
          targetPosition,
        })
    }
  }, [sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data?.connectionType])

  const [edgePath, labelX, labelY] = getPath()
  const thickness = data?.thickness || 2
  const color = data?.color || "#000"

  // Determine if we need markers
  const showMarkerStart = data?.markerStartType === 'arrow';
  const showMarkerEnd = data?.markerEndType === 'arrow';

  const markerStartUrl = showMarkerStart ? `url(#${id}-marker-start)` : undefined;
  const markerEndUrl = showMarkerEnd ? `url(#${id}-marker-end)` : undefined;

  return (
    <>
      {/* Define markers for arrows */}
      <defs>
        {showMarkerStart && (
          <marker
            id={`${id}-marker-start`}
            markerWidth="12"
            markerHeight="12"
            refX="12"
            refY="6"
            orient="auto-start-reverse"
            markerUnits="strokeWidth"
          >
            <path d="M2,1 L12,6 L2,11" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        )}
        {showMarkerEnd && (
          <marker
            id={`${id}-marker-end`}
            markerWidth="12"
            markerHeight="12"
            refX="12"
            refY="6"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M2,1 L12,6 L2,11" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        )}
      </defs>

      <path
        id={id}
        style={{
          ...style,
          strokeWidth: thickness,
          stroke: color,
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEndUrl}
        markerStart={markerStartUrl}
      />
    </>
  )
}
