"use client"

import type React from "react"

import { useState, useRef, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { LuArrowLeft, LuSend, LuUpload, LuImage, LuUser, LuBot, LuCirclePause, LuClock, LuTarget } from "react-icons/lu"
import Link from "next/link"
import { Interview, InterviewMessage } from "@/types/interview"
import api from "@/lib/axios"
import { useParams } from "next/navigation"

export default function ActiveInterviewPage() {
  const params = useParams<{ id: string }>()
 
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<InterviewMessage[]>([])
  const [currentPhase, setCurrentPhase] = useState("intro")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [interviewTime, setInterviewTime] = useState(0)
  const [interview, setInterview] = useState<Interview>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const phases = [
    { id: "intro", name: "Introduction", progress: 20, description: "Understanding requirements" },
    { id: "designing", name: "High-Level Design", progress: 40, description: "System architecture" },
    { id: "deep-dive", name: "Deep Dive", progress: 60, description: "Detailed components" },
    { id: "scaling", name: "Scale & Optimize", progress: 80, description: "Performance & reliability" },
    { id: "wrap-up", name: "Wrap Up", progress: 100, description: "Final questions" },
  ]

  const currentPhaseData = phases.find((p) => p.id === currentPhase) || phases[0]

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setInterviewTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Fetch interview data
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await api.get<Interview>(`/v1/interviews/${params.id}`)
        setInterview(response.data)
      } catch (error) {
        console.error("Failed to fetch interview data:", error)
      }
    }
    fetchInterview()
  }, [params.id])

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await api.get<InterviewMessage[]>(`/v1/interviews/${params.id}/messages`)
      setMessages(response.data)
    }
    fetchMessages()
  }, [params.id])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const newMessage: InterviewMessage = {
      role: "user",
      content: message,
    }

    setMessages((prev) => [...prev, newMessage])
    setMessage("")
    setSelectedImage(null)
    setImagePreview(null)

    try {
      const formData = new FormData()
      const messagePayload = {
        role: "user",
        text: message,
      }
      formData.append("message", new Blob([JSON.stringify(messagePayload)], { type: "application/json" }))

      if (selectedImage) {
        formData.append("image", selectedImage)
      }

      console.log("Sending message with data", formData)

      const response = await api.post<InterviewMessage>(
        `/v1/interviews/${params.id}/messages`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      const assistantMessage: InterviewMessage = response.data
      setMessages((prev) => [...prev, assistantMessage])

      const totalMessages = messages.length + 2
      if (totalMessages > 6 && currentPhase === "intro") {
        setCurrentPhase("designing")
      } else if (totalMessages > 12 && currentPhase === "designing") {
        setCurrentPhase("deep-dive")
      } else if (totalMessages > 18 && currentPhase === "deep-dive") {
        setCurrentPhase("scaling")
      } else if (totalMessages > 24 && currentPhase === "scaling") {
        setCurrentPhase("wrap-up")
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }



  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }


  const handleEndInterview = () => {
    if (confirm("Are you sure you want to end this interview? Your progress will be saved.")) {
      // In a real app, save interview data and redirect
      window.location.href = "/interviews"
    }
  }

  const getSeniorityColor = (seniority: string) => {
    switch (seniority.toLowerCase()) {
      case "junior":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "mid-level":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "senior":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "architect":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  return (
    <div className="bg-background flex flex-col h-screen">
      <Navigation isLoggedIn={true} userCredits={11} />

      {/* Interview Header */}
      <div className="border-b border-border/40 bg-background/95 backdrop-blur flex-shrink-0">
        <div className="container px-4 py-3 mx-auto max-w-screen-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/home">
                <Button variant="ghost" size="sm">
                  <LuArrowLeft className="w-4 h-4 mr-2" />
                  Exit Interview
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-bold">{interview?.challenge.title}</h1>
                <Badge variant="outline" className={getSeniorityColor(interview?.seniority ?? "")}>
                  {interview?.seniority}
                </Badge>
                <Badge variant="secondary">{interview?.behavior.title}</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <LuClock className="w-4 h-4" />
                <span>{formatTime(interviewTime)}</span>
              </div>
              <Button variant="destructive" onClick={handleEndInterview} size="sm">
                <LuCirclePause className="w-4 h-4 mr-2" />
                End Interview
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container px-4 py-6 mx-auto max-w-screen-2xl flex-1 flex flex-col min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
          {/* Chat Panel */}
          <div className="lg:col-span-3 flex flex-col">
            <Card className="border-border/50 bg-card/50 backdrop-blur flex flex-col ">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Interview Chat</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {currentPhaseData.name}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex flex-col min-h-0 overflow-y-auto space-y-4 mb-4 pr-2 max-h-[40rem]">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`flex items-start space-x-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-primary" : "bg-muted"}`}
                        >
                          {msg.role === "user" ? (
                            <LuUser className="w-4 h-4 text-primary-foreground" />
                          ) : (
                            <LuBot className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <div
                          className={`p-4 rounded-2xl ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                        >
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <p
                            className={`text-xs mt-2 ${msg.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                          >
                            {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Type your response..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 resize-none bg-background/50"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} disabled={!message.trim()}>
                    <LuSend className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Phase Progress */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <LuTarget className="w-4 h-4 mr-2 text-primary" />
                  Interview Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{currentPhaseData.name}</span>
                    <span className="text-xs text-muted-foreground">{currentPhaseData.progress}%</span>
                  </div>
                  <Progress value={currentPhaseData.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{currentPhaseData.description}</p>
                </div>

                <div className="space-y-2">
                  {phases.map((phase) => (
                    <div
                      key={phase.id}
                      className={`flex items-center space-x-2 text-xs ${phase.id === currentPhase
                        ? "text-primary font-medium"
                        : phase.progress <= currentPhaseData.progress
                          ? "text-green-400"
                          : "text-muted-foreground"
                        }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${phase.id === currentPhase
                          ? "bg-primary"
                          : phase.progress <= currentPhaseData.progress
                            ? "bg-green-400"
                            : "bg-muted"
                          }`}
                      />
                      <span>{phase.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-base">System Diagrams</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full bg-transparent"
                  size="sm"
                >
                  <LuUpload className="w-4 h-4 mr-2" />
                  Upload Diagram
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Selected Image</h4>
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Diagram"
                        className="w-full rounded-lg border border-border/50"
                      />
                      <Badge className="absolute top-2 right-2 text-xs">#1</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <LuImage className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No diagram selected yet</p>
                    <p className="text-xs">Upload a system diagram to send it with your message</p>
                  </div>
                )}

              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
