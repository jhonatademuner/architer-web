"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { DiagramEditor } from "@/components/diagram-editor"
import { ChatInterface } from "@/components/chat-interface"
import { Button } from "@/components/ui/button"
import { ChevronRight, MessageSquare } from "lucide-react"

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [chatWidth, setChatWidth] = useState(20) // percentage
  const resizeRef = useRef<HTMLDivElement>(null)
  const [isResizing, setIsResizing] = useState(false)

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const stopResize = () => {
    setIsResizing(false)
  }

  const resize = (e: MouseEvent) => {
    if (isResizing) {
      const containerWidth = window.innerWidth
      const newWidth = (e.clientX / containerWidth) * 100
      // Limit the width between 20% and 80%
      const clampedWidth = Math.min(Math.max(newWidth, 20), 80)
      setChatWidth(100 - clampedWidth)
    }
  }

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize)
      window.addEventListener("mouseup", stopResize)
    }

    return () => {
      window.removeEventListener("mousemove", resize)
      window.removeEventListener("mouseup", stopResize)
    }
  }, [isResizing])

  return (
    <main className="flex flex-col h-screen">
      <header className="bg-card text-card-foreground p-4 flex justify-between items-center border-b border-border">
        <h1 className="text-2xl font-bold">System Design Interview Practice</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="text-foreground hover:bg-secondary"
        >
          {isChatOpen ? (
            <>
              <ChevronRight className="mr-2 h-4 w-4" /> Hide Chat
            </>
          ) : (
            <>
              <MessageSquare className="mr-2 h-4 w-4" /> Show Chat
            </>
          )}
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`${
            isChatOpen ? `w-[${100 - chatWidth}%]` : "w-full"
          } h-full transition-all duration-300 ease-in-out`}
          style={{ width: isChatOpen ? `${100 - chatWidth}%` : "100%" }}
        >
          <DiagramEditor />
        </div>

        {isChatOpen && (
          <>
            <div
              ref={resizeRef}
              className="w-1 h-full bg-border hover:bg-border/80 cursor-col-resize"
              onMouseDown={startResize}
            />
            <div
              className="h-full border-l border-border bg-background flex flex-col"
              style={{ width: `${chatWidth}%` }}
            >
              <div className="flex justify-between items-center p-2 border-b border-border">
                <h2 className="font-semibold text-foreground">AI Interviewer</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsChatOpen(false)} className="h-8 w-8 p-0 text-foreground hover:bg-secondary">
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatInterface />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
