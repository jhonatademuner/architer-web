"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { LuArrowLeft, LuSearch, LuEye, LuCalendar, LuClock, LuTarget, LuTrendingUp, LuFilter } from "react-icons/lu"
import Link from "next/link"

export default function InterviewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterSeniority, setFilterSeniority] = useState("all")

  // Mock interview data
  const interviews = [
    {
      id: 1,
      challenge: "Design YouTube",
      seniority: "Senior",
      behavior: "Socratic",
      score: 92,
      date: "2024-01-15",
      duration: "45 min",
      status: "completed",
      phase: "wrap-up",
    },
    {
      id: 2,
      challenge: "Design Rate Limiter",
      seniority: "Mid-level",
      behavior: "Friendly",
      score: 88,
      date: "2024-01-14",
      duration: "38 min",
      status: "completed",
      phase: "wrap-up",
    },
    {
      id: 3,
      challenge: "Design Twitter",
      seniority: "Senior",
      behavior: "Professional",
      score: 85,
      date: "2024-01-12",
      duration: "52 min",
      status: "completed",
      phase: "wrap-up",
    },
    {
      id: 4,
      challenge: "Design Chat System",
      seniority: "Mid-level",
      behavior: "Tough",
      score: 78,
      date: "2024-01-10",
      duration: "41 min",
      status: "completed",
      phase: "wrap-up",
    },
    {
      id: 5,
      challenge: "Design URL Shortener",
      seniority: "Junior",
      behavior: "Friendly",
      score: 95,
      date: "2024-01-08",
      duration: "32 min",
      status: "completed",
      phase: "wrap-up",
    },
  ]

  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch =
      interview.challenge.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.behavior.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || interview.status === filterStatus
    const matchesSeniority = filterSeniority === "all" || interview.seniority.toLowerCase() === filterSeniority

    return matchesSearch && matchesStatus && matchesSeniority
  })

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 80) return "text-blue-400"
    if (score >= 70) return "text-yellow-400"
    return "text-red-400"
  }

  const getSeniorityColor = (seniority: string) => {
    switch (seniority.toLowerCase()) {
      case "junior": return "bg-green-500/10 text-green-400 border-green-500/20"
      case "mid-level": return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "senior": return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "architect": return "bg-orange-500/10 text-orange-400 border-orange-500/20"
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  // Calculate stats
  const totalInterviews = interviews.length
  const averageScore = Math.round(interviews.reduce((sum, interview) => sum + interview.score, 0) / totalInterviews)
  const completedThisWeek = interviews.filter(interview => {
    const interviewDate = new Date(interview.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return interviewDate >= weekAgo
  }).length

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
            <h1 className="text-3xl font-bold">My Interviews</h1>
            <p className="text-muted-foreground">Review your interview history and track your progress</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Interviews</p>
                  <p className="text-2xl font-bold">{totalInterviews}</p>
                </div>
                <LuTarget className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>{averageScore}%</p>
                </div>
                <LuTrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">{completedThisWeek}</p>
                </div>
                <LuCalendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-border/50 bg-card/50 backdrop-blur mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <LuFilter className="w-5 h-5 mr-2 text-primary" />
              Filter Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <LuSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by challenge or behavior..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-48 bg-background/50">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterSeniority} onValueChange={setFilterSeniority}>
                <SelectTrigger className="w-full sm:w-48 bg-background/50">
                  <SelectValue placeholder="Filter by seniority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="mid-level">Mid-level</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="architect">Architect</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Interview List */}
        <div className="space-y-4">
          {filteredInterviews.map((interview) => (
            <Card key={interview.id} className="border-border/50 bg-card/50 backdrop-blur hover:bg-card/70 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-lg font-semibold">{interview.challenge}</h3>
                      <Badge variant="outline" className={getSeniorityColor(interview.seniority)}>
                        {interview.seniority}
                      </Badge>
                      <Badge variant="secondary">{interview.behavior}</Badge>
                      <Badge variant="outline" className="text-green-400 border-green-500/20">
                        Completed
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <LuCalendar className="w-4 h-4 mr-2" />
                        {interview.date}
                      </div>
                      <div className="flex items-center">
                        <LuClock className="w-4 h-4 mr-2" />
                        {interview.duration}
                      </div>
                      <div className="flex items-center">
                        <LuTarget className="w-4 h-4 mr-2" />
                        <span className={`font-medium ${getScoreColor(interview.score)}`}>
                          {interview.score}% Score
                        </span>
                      </div>
                      <div className="flex items-center">
                        <LuTrendingUp className="w-4 h-4 mr-2" />
                        Phase: {interview.phase}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Link href={`/interviews/${interview.id}`}>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <LuEye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInterviews.length === 0 && (
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="text-center py-12">
              <LuSearch className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No interviews found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
