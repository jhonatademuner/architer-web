"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/navigation"
import { LuSearch, LuArrowLeft, LuPlay, LuClock, LuUsers, LuZap, LuTarget, LuMessageSquare, LuBrain, LuShield, LuRocket } from "react-icons/lu"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CreateInterviewPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedChallenge, setSelectedChallenge] = useState("")
  const [selectedBehavior, setSelectedBehavior] = useState("")
  const [selectedSeniority, setSelectedSeniority] = useState("")

  const challenges = [
    {
      id: "youtube",
      title: "Design YouTube",
      description: "Build a video streaming platform with upload, playback, and recommendations",
      category: "Video Streaming",
      difficulty: "Hard",
      estimatedTime: "45-60 min",
      icon: "🎥",
    },
    {
      id: "twitter",
      title: "Design Twitter",
      description: "Create a social media platform with tweets, timeline, and real-time updates",
      category: "Social Media",
      difficulty: "Hard",
      estimatedTime: "45-60 min",
      icon: "🐦",
    },
    {
      id: "rate-limiter",
      title: "Design Rate Limiter",
      description: "Implement a distributed rate limiting system to control API usage",
      category: "System Components",
      difficulty: "Medium",
      estimatedTime: "30-45 min",
      icon: "⚡",
    },
    {
      id: "chat-system",
      title: "Design Chat System",
      description: "Build a real-time messaging platform with group chats and notifications",
      category: "Real-time Systems",
      difficulty: "Medium",
      estimatedTime: "40-50 min",
      icon: "💬",
    },
    {
      id: "url-shortener",
      title: "Design URL Shortener",
      description: "Create a service like bit.ly with custom URLs and analytics",
      category: "Web Services",
      difficulty: "Easy",
      estimatedTime: "25-35 min",
      icon: "🔗",
    },
    {
      id: "notification",
      title: "Design Notification System",
      description: "Build a multi-channel notification service with preferences and delivery",
      category: "System Components",
      difficulty: "Medium",
      estimatedTime: "35-45 min",
      icon: "🔔",
    },
    {
      id: "search-engine",
      title: "Design Search Engine",
      description: "Create a web search engine with crawling, indexing, and ranking",
      category: "Search Systems",
      difficulty: "Hard",
      estimatedTime: "50-70 min",
      icon: "🔍",
    },
    {
      id: "cache-system",
      title: "Design Distributed Cache",
      description: "Implement a high-performance caching layer with consistency guarantees",
      category: "System Components",
      difficulty: "Medium",
      estimatedTime: "30-40 min",
      icon: "⚡",
    },
  ]

  const behaviors = [
    {
      id: "friendly",
      title: "Friendly",
      description: "Encouraging and supportive, helps guide you through the process",
      icon: LuMessageSquare,
      color: "from-green-500/20 to-emerald-500/20 border-green-500/30",
    },
    {
      id: "socratic",
      title: "Socratic",
      description: "Asks probing questions to help you discover solutions yourself",
      icon: LuBrain,
      color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    },
    {
      id: "tough",
      title: "Tough",
      description: "Challenging and direct, pushes you to think deeper and justify decisions",
      icon: LuTarget,
      color: "from-red-500/20 to-orange-500/20 border-red-500/30",
    },
    {
      id: "neutral",
      title: "Professional",
      description: "Balanced and objective, focuses on technical accuracy and best practices",
      icon: LuShield,
      color: "from-purple-500/20 to-violet-500/20 border-purple-500/30",
    },
  ]

  const seniorities = [
    {
      id: "junior",
      title: "Junior",
      description: "Entry-level questions focusing on basic concepts and simple architectures",
      experience: "0-2 years",
      icon: "🌱",
      color: "from-green-500/20 to-emerald-500/20 border-green-500/30",
    },
    {
      id: "mid-level",
      title: "Mid-Level",
      description: "Intermediate complexity with trade-offs and moderate scale considerations",
      experience: "2-5 years",
      icon: "🚀",
      color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    },
    {
      id: "senior",
      title: "Senior",
      description: "Advanced topics including scalability, reliability, and complex trade-offs",
      experience: "5-8 years",
      icon: "⭐",
      color: "from-purple-500/20 to-violet-500/20 border-purple-500/30",
    },
    {
      id: "architect",
      title: "Architect",
      description: "Expert-level design with enterprise scale, multiple systems integration",
      experience: "8+ years",
      icon: "👑",
      color: "from-orange-500/20 to-red-500/20 border-orange-500/30",
    },
  ]

  const filteredChallenges = challenges.filter(
    (challenge) =>
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "hard":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const isFormValid = selectedChallenge && selectedBehavior && selectedSeniority

  const handleStartInterview = () => {
    if (isFormValid) {
      router.push(
        `/interview/active?challenge=${selectedChallenge}&behavior=${selectedBehavior}&seniority=${selectedSeniority}`,
      )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} userCredits={12} />

      <main className="container px-4 py-8 mx-auto max-w-screen-2xl">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/home">
            <Button variant="ghost" size="sm">
              <LuArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Create New Interview</h1>
            <p className="text-muted-foreground">Configure your AI-powered system design interview</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Challenge Selection */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LuRocket className="w-5 h-5 mr-2 text-primary" />
                  Choose Your Challenge
                </CardTitle>
                <div className="relative">
                  <LuSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search challenges..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredChallenges.map((challenge) => (
                    <Card
                      key={challenge.id}
                      className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${selectedChallenge === challenge.id
                          ? "border-primary bg-primary/5"
                          : "border-border/50 bg-card/30 hover:bg-card/50"
                        }`}
                      onClick={() => setSelectedChallenge(challenge.id)}
                    >
                      <CardContent className="p-6 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="text-2xl">{challenge.icon}</div>
                          <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                            {challenge.difficulty}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{challenge.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <LuClock className="w-3 h-3 mr-1" />
                            {challenge.estimatedTime}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {challenge.category}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Interviewer Behavior */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LuUsers className="w-5 h-5 mr-2 text-primary" />
                  Interviewer Behavior
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {behaviors.map((behavior) => (
                    <Card
                      key={behavior.id}
                      className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${selectedBehavior === behavior.id
                          ? "border-primary bg-primary/5"
                          : "border-border/50 bg-card/30 hover:bg-card/50"
                        }`}
                      onClick={() => setSelectedBehavior(behavior.id)}
                    >
                      <CardContent className={`p-6 space-y-3 bg-gradient-to-br ${behavior.color} rounded-lg border`}>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-background/50 rounded-lg">
                            <behavior.icon className="w-5 h-5" />
                          </div>
                          <h3 className="font-semibold">{behavior.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{behavior.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Seniority Level */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LuTarget className="w-5 h-5 mr-2 text-primary" />
                  Seniority Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {seniorities.map((seniority) => (
                    <Card
                      key={seniority.id}
                      className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${selectedSeniority === seniority.id
                          ? "border-primary bg-primary/5"
                          : "border-border/50 bg-card/30 hover:bg-card/50"
                        }`}
                      onClick={() => setSelectedSeniority(seniority.id)}
                    >
                      <CardContent className={`p-6 space-y-3 bg-gradient-to-br ${seniority.color} rounded-lg border`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{seniority.icon}</div>
                            <div>
                              <h3 className="font-semibold">{seniority.title}</h3>
                              <p className="text-xs text-muted-foreground">{seniority.experience}</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{seniority.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Interview Summary */}
          <div className="xl:col-span-1">
            <Card className="border-border/50 bg-card/50 backdrop-blur sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LuZap className="w-5 h-5 mr-2 text-primary" />
                  Interview Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Challenge</label>
                    <p className="text-sm mt-1">
                      {selectedChallenge ? challenges.find((c) => c.id === selectedChallenge)?.title : "Not selected"}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Interviewer</label>
                    <p className="text-sm mt-1">
                      {selectedBehavior ? behaviors.find((b) => b.id === selectedBehavior)?.title : "Not selected"}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Seniority</label>
                    <p className="text-sm mt-1">
                      {selectedSeniority ? seniorities.find((s) => s.id === selectedSeniority)?.title : "Not selected"}
                    </p>
                  </div>

                  {selectedChallenge && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Estimated Time</label>
                      <p className="text-sm mt-1">
                        {challenges.find((c) => c.id === selectedChallenge)?.estimatedTime}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Cost</span>
                    <div className="flex items-center space-x-2">
                      <LuZap className="w-4 h-4 text-primary" />
                      <span className="font-semibold">1 Credit</span>
                    </div>
                  </div>

                  <Button onClick={handleStartInterview} disabled={!isFormValid} className="w-full" size="lg">
                    <LuPlay className="w-4 h-4 mr-2" />
                    Start Interview
                  </Button>

                  {!isFormValid && (
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Please select all options to continue
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
