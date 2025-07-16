"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { LuArrowLeft, LuUser, LuBot, LuCalendar, LuClock, LuTarget, LuDownload } from "react-icons/lu"
import Link from "next/link"

export default function InterviewDetailsPage({ params }: { params: { id: string } }) {
  // Mock data - in a real app, you'd fetch this based on the ID
  const interview = {
    id: Number.parseInt(params.id),
    challenge: "Design YouTube",
    difficulty: "Hard",
    profile: "Socratic",
    candidateName: "John Doe",
    date: "2024-01-15",
    duration: "45 min",
    status: "Completed",
    score: 85,
    phases: [
      { name: "Introduction", completed: true, duration: "5 min" },
      { name: "System Design", completed: true, duration: "15 min" },
      { name: "Deep Dive", completed: true, duration: "12 min" },
      { name: "Optimization", completed: true, duration: "8 min" },
      { name: "Wrap Up", completed: true, duration: "5 min" },
    ],
    messages: [
      {
        id: 1,
        sender: "ai",
        content:
          "Hello John! I'm your AI interviewer today. I see we'll be working on designing YouTube. Let's start with understanding the requirements. Can you tell me what you think are the core functionalities we need to support?",
        timestamp: "10:00 AM",
        phase: "Introduction",
      },
      {
        id: 2,
        sender: "user",
        content:
          "Hi! For YouTube, I think the core functionalities would include video upload, video streaming, user authentication, search functionality, recommendations, comments, and likes/dislikes.",
        timestamp: "10:01 AM",
        phase: "Introduction",
      },
      {
        id: 3,
        sender: "ai",
        content:
          "Excellent start! You've identified the key features. Now let's think about scale. YouTube serves billions of users and handles millions of video uploads daily. What are some of the main challenges we need to consider when designing at this scale?",
        timestamp: "10:02 AM",
        phase: "System Design",
      },
      {
        id: 4,
        sender: "user",
        content:
          "At this scale, we need to consider storage challenges for billions of videos, bandwidth for streaming, CDN for global distribution, database sharding for user data, caching for popular content, and load balancing across multiple servers.",
        timestamp: "10:04 AM",
        phase: "System Design",
      },
    ],
    diagrams: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=250&width=350"],
    feedback: {
      strengths: [
        "Strong understanding of system requirements",
        "Good grasp of scalability challenges",
        "Clear communication of design decisions",
        "Appropriate use of caching strategies",
      ],
      improvements: [
        "Could have discussed data consistency in more detail",
        "Missing discussion of monitoring and alerting",
        "Could explore more optimization techniques",
      ],
      overallComment:
        "John demonstrated a solid understanding of large-scale system design principles. His approach to breaking down the problem was methodical and he showed good awareness of scalability challenges. With more practice on advanced topics like data consistency and monitoring, he'll be well-prepared for senior-level interviews.",
    },
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container px-4 mx-auto max-w-screen-2xl">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/interviews" className="flex items-center text-muted-foreground hover:text-foreground mr-4">
                <LuArrowLeft className="w-5 h-5 mr-2" />
                Back to Interviews
              </Link>
              <h1 className="text-2xl font-bold text-foreground">Interview Details</h1>
            </div>
            <Button variant="outline" className="rounded-2xl bg-transparent">
              <LuDownload className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8 mx-auto max-w-screen-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interview Overview */}
            <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{interview.challenge}</CardTitle>
                    <CardDescription className="mt-2">Interview conducted on {interview.date}</CardDescription>
                  </div>
                  <div className={`text-3xl font-bold ${getScoreColor(interview.score)}`}>{interview.score}%</div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge
                    variant={
                      interview.difficulty === "Hard"
                        ? "destructive"
                        : interview.difficulty === "Medium"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {interview.difficulty}
                  </Badge>
                  <Badge variant="outline">{interview.profile} Interviewer</Badge>
                  <Badge variant="secondary">{interview.status}</Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Chat Transcript */}
            <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Interview Transcript</CardTitle>
                <CardDescription>Complete conversation history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {interview.messages.map((message) => (
                    <div key={message.id} className="flex items-start space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender === "user" ? "bg-primary" : "bg-muted"
                        }`}
                      >
                        {message.sender === "user" ? (
                          <LuUser className="w-4 h-4 text-primary-foreground" />
                        ) : (
                          <LuBot className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-foreground">
                            {message.sender === "user" ? interview.candidateName : "AI Interviewer"}
                          </span>
                          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                          <Badge variant="outline" className="text-xs">
                            {message.phase}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Diagrams */}
            <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>System Diagrams</CardTitle>
                <CardDescription>Diagrams uploaded during the interview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {interview.diagrams.map((diagram, index) => (
                    <div key={index} className="relative">
                      <img
                        src={diagram || "/placeholder.svg"}
                        alt={`System Diagram ${index + 1}`}
                        className="w-full rounded-lg border border-border/50"
                      />
                      <Badge className="absolute top-2 right-2 text-xs">Diagram {index + 1}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Interview Stats */}
            <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Interview Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <LuUser className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Candidate</span>
                  </div>
                  <span className="font-medium text-foreground">{interview.candidateName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <LuCalendar className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Date</span>
                  </div>
                  <span className="font-medium text-foreground">{interview.date}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <LuClock className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Duration</span>
                  </div>
                  <span className="font-medium text-foreground">{interview.duration}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <LuTarget className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Score</span>
                  </div>
                  <span className={`font-bold text-foreground ${getScoreColor(interview.score)}`}>{interview.score}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Phase Progress */}
            <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Interview Phases</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {interview.phases.map((phase, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${phase.completed ? "bg-green-500" : "bg-gray-300"}`} />
                      <span className="text-sm font-medium">{phase.name}</span>
                    </div>
                    <span className="text-xs text-gray-600">{phase.duration}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Feedback */}
            <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>AI Feedback</CardTitle>
                <CardDescription>Detailed performance analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-600 mb-2">Strengths</h4>
                  <ul className="space-y-1">
                    {interview.feedback.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-orange-600 mb-2">Areas for Improvement</h4>
                  <ul className="space-y-1">
                    {interview.feedback.improvements.map((improvement, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Overall Assessment</h4>
                  <p className="text-sm text-gray-700">{interview.feedback.overallComment}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
