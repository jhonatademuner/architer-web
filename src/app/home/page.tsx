"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { LuPlus, LuZap, LuChartColumn, LuTarget, LuAward, LuClock, LuArrowRight, LuTrendingUp, LuCircleCheckBig, LuCalendar} from "react-icons/lu";

import Link from "next/link"

export default function HomePage() {
  // Mock user data
  const user = {
    name: "Alex Chen",
    credits: 12,
    totalInterviews: 24,
    averageScore: 87,
    streak: 7,
    level: "Senior",
    nextLevel: "Architect",
    progressToNext: 75,
  }

  const recentInterviews = [
    {
      id: 1,
      challenge: "Design YouTube",
      seniority: "Senior",
      behavior: "Socratic",
      score: 92,
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: 2,
      challenge: "Design Rate Limiter",
      seniority: "Mid-level",
      behavior: "Friendly",
      score: 88,
      date: "2024-01-14",
      status: "completed",
    },
    {
      id: 3,
      challenge: "Design Twitter",
      seniority: "Senior",
      behavior: "Tough",
      score: 85,
      date: "2024-01-12",
      status: "completed",
    },
  ]

  const weeklyStats = [
    { day: "Mon", interviews: 2 },
    { day: "Tue", interviews: 1 },
    { day: "Wed", interviews: 3 },
    { day: "Thu", interviews: 0 },
    { day: "Fri", interviews: 2 },
    { day: "Sat", interviews: 1 },
    { day: "Sun", interviews: 1 },
  ]

  const maxInterviews = Math.max(...weeklyStats.map((stat) => stat.interviews))

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 80) return "text-blue-400"
    if (score >= 70) return "text-yellow-400"
    return "text-red-400"
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
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} userCredits={user.credits} />

      <main className="container px-4 py-8 mx-auto max-w-screen-2xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground">Ready to practice your next system design interview?</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LuZap className="w-5 h-5 mr-2 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/interview/create">
                    <Card className="border-border/50 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group">
                      <CardContent className="p-6 text-center space-y-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                          <LuPlus className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Start New Interview</h3>
                          <p className="text-sm text-muted-foreground">Practice with AI interviewer</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/interviews">
                    <Card className="border-border/50 bg-card hover:bg-accent/50 transition-colors cursor-pointer group">
                      <CardContent className="p-6 text-center space-y-3">
                        <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto group-hover:bg-accent/80 transition-colors">
                          <LuChartColumn className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">View Past Interviews</h3>
                          <p className="text-sm text-muted-foreground">Review your progress</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Interviews */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <LuClock className="w-5 h-5 mr-2 text-primary" />
                    Recent Interviews
                  </CardTitle>
                  <Link href="/interviews">
                    <Button variant="ghost" size="sm">
                      View All
                      <LuArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex items-center justify-between p-4 bg-accent/20 rounded-lg border border-border/50"
                  >
                    <div className="space-y-1">
                      <h4 className="font-medium">{interview.challenge}</h4>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className={getSeniorityColor(interview.seniority)}>
                          {interview.seniority}
                        </Badge>
                        <span>•</span>
                        <span>{interview.behavior}</span>
                        <span>•</span>
                        <span>{interview.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`text-lg font-bold ${getScoreColor(interview.score)}`}>{interview.score}%</div>
                      <LuCircleCheckBig className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weekly Activity */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LuCalendar className="w-5 h-5 mr-2 text-primary" />
                  This Week's Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between space-x-2 h-32">
                  {weeklyStats.map((stat, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                      <div
                        className="w-full bg-primary/20 rounded-t-sm transition-all duration-300 hover:bg-primary/30"
                        style={{
                          height: `${(stat.interviews / maxInterviews) * 80}px`,
                          minHeight: stat.interviews > 0 ? "8px" : "2px",
                        }}
                      />
                      <span className="text-xs text-muted-foreground">{stat.day}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Total interviews this week: {weeklyStats.reduce((sum, stat) => sum + stat.interviews, 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Overview */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LuTarget className="w-5 h-5 mr-2 text-primary" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center space-y-1">
                    <div className="text-2xl font-bold text-primary">{user.totalInterviews}</div>
                    <div className="text-xs text-muted-foreground">Total Interviews</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-2xl font-bold text-green-400">{user.averageScore}%</div>
                    <div className="text-xs text-muted-foreground">Avg Score</div>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <LuAward className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-medium">{user.streak} day streak</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Keep it up!</p>
                </div>
              </CardContent>
            </Card>

            {/* Level Progress */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LuTrendingUp className="w-5 h-5 mr-2 text-primary" />
                  Level Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <Badge variant="outline" className={getSeniorityColor(user.level)}>
                    {user.level} Level
                  </Badge>
                  <p className="text-sm text-muted-foreground">Progress to {user.nextLevel}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{user.progressToNext}%</span>
                    <span className="text-muted-foreground">100%</span>
                  </div>
                  <Progress value={user.progressToNext} className="h-2" />
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Complete more interviews to reach {user.nextLevel} level
                </p>
              </CardContent>
            </Card>

            {/* Credits */}
            <Card className="border-border/50 bg-gradient-to-br from-blue-500/10 to-purple-600/10 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LuZap className="w-5 h-5 mr-2 text-primary" />
                  Interview Credits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">{user.credits}</div>
                  <p className="text-sm text-muted-foreground">Credits remaining</p>
                </div>

                <Button className="w-full bg-transparent" variant="outline">
                  Buy More Credits
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Each credit allows one complete interview session
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
