import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { LuZap, LuArrowRight, LuCircleCheckBig, LuMessageSquare, LuTarget, LuChartColumn, LuShield, LuStar } from "react-icons/lu";

export default function LandingPage() {
  const features = [
    {
      icon: LuMessageSquare,
      title: "AI-Powered Interviews",
      description:
        "Practice with our advanced AI interviewer that adapts to your responses and provides real-time feedback.",
    },
    {
      icon: LuTarget,
      title: "Real System Design Challenges",
      description:
        "Work on actual problems from top tech companies like designing YouTube, Twitter, or distributed systems.",
    },
    {
      icon: LuChartColumn,
      title: "Detailed Performance Analytics",
      description: "Get comprehensive feedback on your performance with actionable insights to improve your skills.",
    },
    {
      icon: LuShield,
      title: "Multiple Difficulty Levels",
      description: "From junior to architect level - practice at your current level and gradually increase difficulty.",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Engineer at Google",
      content:
        "Architer helped me prepare for my system design interviews. The AI feedback was incredibly detailed and helped me identify my weak spots.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Tech Lead at Meta",
      content:
        "The variety of challenges and different interviewer behaviors made my practice sessions feel like real interviews. Highly recommend!",
      rating: 5,
    },
    {
      name: "Emily Johnson",
      role: "Software Engineer at Netflix",
      content:
        "I went from struggling with system design to confidently tackling any architecture problem. The progress tracking is amazing.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="container px-4 py-24 mx-auto max-w-screen-xl">
        <div className="text-center space-y-8">
          <Badge variant="secondary" className="px-4 py-1">
            <LuZap className="w-3 h-3 mr-1 text-yellow-300" />
            AI-Powered Interview Practice
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Master System Design
            <span className="block bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Interviews with AI
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Practice system design interviews with our intelligent AI interviewer. Get personalized feedback, work on
            real challenges, and build the confidence you need to land your dream job.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-base px-8" asChild>
              <Link href="/signup">
                Start Practicing Free
                <LuArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8 bg-transparent" asChild>
              <Link href="/demo">Watch Demo</Link>
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <LuCircleCheckBig className="w-4 h-4 mr-2 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center">
              <LuCircleCheckBig className="w-4 h-4 mr-2 text-green-500" />1 free interview
            </div>
            <div className="flex items-center">
              <LuCircleCheckBig className="w-4 h-4 mr-2 text-green-500" />
              Personalized feedback
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-24 mx-auto max-w-screen-xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Everything you need to ace your interviews</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform provides comprehensive tools and insights to help you master system design interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container px-4 py-24 mx-auto max-w-screen-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">10,000+</div>
            <div className="text-muted-foreground">Interviews Completed</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">95%</div>
            <div className="text-muted-foreground">Success Rate</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">50+</div>
            <div className="text-muted-foreground">System Design Challenges</div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container px-4 py-24 mx-auto max-w-screen-xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Loved by developers worldwide</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of developers who have successfully landed their dream jobs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="p-6 space-y-4">
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <LuStar key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-24 mx-auto max-w-screen-xl">
        <Card className="border-border/50 bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to ace your next interview?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of developers who have successfully prepared for their system design interviews with
              Architer.
            </p>
            <Button size="lg" className="text-base px-8" asChild>
              <Link href="/signup">
                Get Started for Free
                <LuArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/95 backdrop-blur">
        <div className="container px-4 py-12 mx-auto max-w-screen-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded" />
                <span className="font-bold">Architer</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Master system design interviews with AI-powered practice sessions.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>
                  <Link href="/features">Features</Link>
                </div>
                <div>
                  <Link href="/pricing">Pricing</Link>
                </div>
                <div>
                  <Link href="/demo">Demo</Link>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>
                  <Link href="/about">About</Link>
                </div>
                <div>
                  <Link href="/blog">Blog</Link>
                </div>
                <div>
                  <Link href="/careers">Careers</Link>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>
                  <Link href="/help">Help Center</Link>
                </div>
                <div>
                  <Link href="/contact">Contact</Link>
                </div>
                <div>
                  <Link href="/privacy">Privacy</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border/40 mt-12 pt-8 text-center text-sm text-muted-foreground">
            © 2024 Architer. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
