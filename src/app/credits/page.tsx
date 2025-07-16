"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { LuArrowLeft, LuZap, LuCheck, LuCreditCard, LuStar, LuGift } from "react-icons/lu"
import Link from "next/link"

export default function CreditsPage() {
  const [selectedPlan, setSelectedPlan] = useState("")

  const creditBundles = [
    {
      id: "starter",
      name: "Starter Pack",
      credits: 5,
      price: 9.99,
      pricePerCredit: 2.0,
      popular: false,
      description: "Perfect for trying out the platform",
      features: ["5 AI interview sessions", "Basic feedback reports", "Progress tracking", "Email support"],
    },
    {
      id: "professional",
      name: "Professional",
      credits: 15,
      price: 24.99,
      pricePerCredit: 1.67,
      popular: true,
      description: "Most popular choice for serious practice",
      features: [
        "15 AI interview sessions",
        "Detailed feedback reports",
        "Advanced analytics",
        "Priority support",
        "Custom difficulty settings",
      ],
    },
    {
      id: "expert",
      name: "Expert Bundle",
      credits: 30,
      price: 44.99,
      pricePerCredit: 1.5,
      popular: false,
      description: "For intensive interview preparation",
      features: [
        "30 AI interview sessions",
        "Comprehensive feedback",
        "Performance insights",
        "1-on-1 consultation call",
        "Custom challenge creation",
        "Priority support",
      ],
    },
    {
      id: "unlimited",
      name: "Unlimited Monthly",
      credits: "∞",
      price: 79.99,
      pricePerCredit: 0,
      popular: false,
      description: "Unlimited interviews for one month",
      features: [
        "Unlimited AI interviews",
        "All premium features",
        "Advanced analytics",
        "Weekly progress reports",
        "Custom challenges",
        "Direct mentor access",
      ],
    },
  ]

  const individualCredits = [
    { credits: 1, price: 2.99 },
    { credits: 3, price: 7.99 },
    { credits: 5, price: 12.99 },
  ]

  const handlePurchase = (bundleId: string) => {
    setSelectedPlan(bundleId)
    // Mock purchase - in real app, integrate with Stripe/payment processor
    alert(`Purchasing ${bundleId} bundle...`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} userCredits={12} />

      <main className="container px-4 py-8 mx-auto max-w-screen-xl">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/home">
            <Button variant="ghost" size="sm">
              <LuArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Buy Interview Credits</h1>
            <p className="text-muted-foreground">Choose the perfect plan for your interview preparation</p>
          </div>
        </div>

        {/* Current Credits */}
        <Card className="border-border/50 bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <LuZap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Current Balance</h3>
                  <p className="text-sm text-muted-foreground">Available interview credits</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">12 Credits</div>
                <p className="text-sm text-muted-foreground">≈ 12 interviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Bundles */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Credit Bundles</h2>
            <p className="text-muted-foreground mb-6">Save more with our bundled packages</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {creditBundles.map((bundle) => (
                <Card
                  key={bundle.id}
                  className={`relative border-border/50 bg-card/50 backdrop-blur transition-all duration-200 hover:scale-[1.02] ${
                    bundle.popular ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  {bundle.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        <LuStar className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-xl">{bundle.name}</CardTitle>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold">
                        {typeof bundle.credits === "number" ? bundle.credits : bundle.credits}
                        <span className="text-sm font-normal text-muted-foreground ml-1">
                          {typeof bundle.credits === "number" ? "credits" : ""}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        ${bundle.price}
                        {bundle.id === "unlimited" && <span className="text-sm font-normal">/month</span>}
                      </div>
                      {bundle.pricePerCredit > 0 && (
                        <p className="text-xs text-muted-foreground">${bundle.pricePerCredit.toFixed(2)} per credit</p>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{bundle.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {bundle.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <LuCheck className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full"
                      variant={bundle.popular ? "default" : "outline"}
                      onClick={() => handlePurchase(bundle.id)}
                    >
                      <LuCreditCard className="w-4 h-4 mr-2" />
                      Purchase Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Individual Credits */}
          <div>
            <h2 className="text-2xl font-bold mb-2">Individual Credits</h2>
            <p className="text-muted-foreground mb-6">Need just a few more credits? Buy them individually</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
              {individualCredits.map((option, index) => (
                <Card key={index} className="border-border/50 bg-card/50 backdrop-blur">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">{option.credits}</div>
                      <div className="text-sm text-muted-foreground">{option.credits === 1 ? "Credit" : "Credits"}</div>
                    </div>

                    <div className="text-xl font-bold text-primary">${option.price}</div>

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => handlePurchase(`individual-${option.credits}`)}
                    >
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LuGift className="w-5 h-5 mr-2 text-primary" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">How do credits work?</h4>
                  <p className="text-sm text-muted-foreground">
                    Each credit allows you to complete one full AI interview session. Credits don't expire and can be
                    used anytime.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Can I get a refund?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes! We offer a 30-day money-back guarantee if you're not satisfied with your purchase.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Do credits expire?</h4>
                  <p className="text-sm text-muted-foreground">
                    No, your credits never expire. Use them at your own pace whenever you're ready to practice.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">What payment methods do you accept?</h4>
                  <p className="text-sm text-muted-foreground">
                    We accept all major credit cards, PayPal, and Apple Pay for your convenience.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
