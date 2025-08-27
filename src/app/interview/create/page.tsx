"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/navigation"
import { LuSearch, LuArrowLeft, LuPlay, LuUsers, LuZap, LuTarget, LuRocket } from "react-icons/lu"
import Link from "next/link"
import { useRouter } from "next/navigation"
import api from '@/lib/axios'
import { iconConverter } from '@/utils/icons';
import { Challenge } from '@/types/challenge'
import { Behavior } from "@/types/behavior"
import { SimplifiedInterview } from "@/types/interview"

export default function CreateInterviewPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedChallenge, setSelectedChallenge] = useState("")
  const [selectedBehavior, setSelectedBehavior] = useState("")
  const [selectedSeniority, setSelectedSeniority] = useState("")
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [behaviors, setBehaviors] = useState<Behavior[]>([])

  // Fetch challenges from API 
  useEffect(() => {
    const fetchChallenges = async () => {
      const response = await api.get<Challenge[]>("/v1/challenges")
      setChallenges(response.data)
    }
    fetchChallenges()
  }, [])

  // Fetch behaviors from API
  useEffect(() => {
    const fetchBehaviors = async () => {
      const response = await api.get<Behavior[]>("/v1/behaviors")
      setBehaviors(response.data)
    }
    fetchBehaviors()
  }, [])

  const getColorFromId = (id: string) => {
    const colors = [
      'from-green-500/20 to-emerald-500/20 border-green-500/30',
      'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
      'from-purple-500/20 to-violet-500/20 border-purple-500/30',
      'from-red-500/20 to-orange-500/20 border-red-500/30',
    ]
    const hash = [...id].reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  const filteredChallenges = challenges.filter(
    (challenge) =>
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.overview.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.difficulty.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const seniorities = [
    {
      id: "JUNIOR",
      title: "Junior",
      description: "Entry-level questions focusing on basic concepts and simple architectures",
      experience: "0-2 years",
      icon: "🌱",
      color: "from-green-500/20 to-emerald-500/20 border-green-500/30",
    },
    {
      id: "MID",
      title: "Mid-Level",
      description: "Intermediate complexity with trade-offs and moderate scale considerations",
      experience: "2-5 years",
      icon: "🚀",
      color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    },
    {
      id: "SENIOR",
      title: "Senior",
      description: "Advanced topics including scalability, reliability, and complex trade-offs",
      experience: "5-8 years",
      icon: "⭐",
      color: "from-purple-500/20 to-violet-500/20 border-purple-500/30",
    },
    {
      id: "ARCHITECT",
      title: "Architect",
      description: "Expert-level design with enterprise scale, multiple systems integration",
      experience: "8+ years",
      icon: "👑",
      color: "from-orange-500/20 to-red-500/20 border-orange-500/30",
    },
  ]

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

  const handleStartInterview = async () => {
    if (isFormValid) {
      const response = await api.post<SimplifiedInterview>("/v1/interviews", {
        challenge: selectedChallenge,
        behavior: selectedBehavior,
        seniority: selectedSeniority,
      })
      router.push(
        `/interview/active/${response.data.id}`,
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
                          <div className="text-2xl">
                            {iconConverter(challenge.icon)}
                          </div>
                          <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                            {challenge.difficulty}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{challenge.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{challenge.overview}</p>
                        </div>
                        <div className="flex items-center justify-end text-xs text-muted-foreground">
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
                      <CardContent className={`p-6 space-y-3 bg-gradient-to-br ${getColorFromId(behavior.id)} rounded-lg border`}>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-background/50 rounded-lg">
                            {iconConverter(behavior.icon)}
                          </div>
                          <h3 className="font-semibold">{behavior.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{behavior.overview}</p>
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
