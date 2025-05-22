"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

type Message = {
  role: "user" | "assistant"
  content: string
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: "assistant",
    content:
      "Hello! I'm your system design interviewer. What system would you like to design today? Some popular options include:\n\n- URL shortener\n- Social media feed\n- E-commerce platform\n- Chat application\n- Video streaming service\n- Ride-sharing application\n\nOr feel free to suggest something else you'd like to work on!",
  },
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Construct the prompt with conversation history
      const conversationHistory = messages
        .map((msg) => `${msg.role === "user" ? "User" : "Interviewer"}: ${msg.content}`)
        .join("\n\n")

      const prompt = `${conversationHistory}\n\nUser: ${input}\n\nInterviewer:`

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        system:
          "You are an expert system design interviewer for software engineering interviews. Ask probing questions about the user's system design, focusing on scalability, reliability, and performance. Guide them to think about trade-offs, bottlenecks, and edge cases. Be concise but thorough in your feedback. Focus on one aspect at a time rather than overwhelming with too many questions at once. Your goal is to help the user improve their system design skills through this practice interview.",
      })

      const assistantMessage: Message = {
        role: "assistant",
        content: text,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error generating response:", error)

      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const resetChat = () => {
    setMessages(INITIAL_MESSAGES)
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <Card
              key={index}
              className={`p-3 max-w-[85%] ${
                message.role === "user"
                  ? "ml-auto bg-secondary text-secondary-foreground"
                  : "mr-auto bg-card text-card-foreground"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </Card>
          ))}
          {isLoading && (
            <Card className="p-3 max-w-[85%] mr-auto bg-card text-card-foreground">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-muted animate-pulse"></div>
                <div
                  className="w-2 h-2 rounded-full bg-muted animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-muted animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </Card>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border bg-background flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={resetChat}>
          Reset Chat
        </Button>
      </div>

      <div className="p-4 border-t border-border bg-background">
        <div className="flex space-x-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1 bg-background"
          />
          <Button onClick={handleSendMessage} disabled={isLoading}>
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
