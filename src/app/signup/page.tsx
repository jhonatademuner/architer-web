"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Navigation } from "@/components/navigation"
import { LuArrowLeft, LuCircleCheckBig, LuGithub, LuEye, LuEyeOff } from "react-icons/lu";
import { IoLogoGoogle } from "react-icons/io5";

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Mock signup - in real app, you'd create account here
    setTimeout(() => {
      setIsLoading(false)
      router.push("/home")
    }, 1000)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.password &&
    formData.password === formData.confirmPassword &&
    formData.agreeToTerms

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container px-4 py-8 mx-auto max-w-md">
        <div className="space-y-6">
          {/* Back Link */}
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <LuArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>

          {/* Signup Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <div className="h-6 w-6 bg-white rounded" />
              </div>
              <CardTitle className="text-2xl">Create your account</CardTitle>
              <CardDescription>Start practicing system design interviews with AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Benefits */}
              <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <h4 className="font-medium text-sm">What you'll get:</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <LuCircleCheckBig className="w-3 h-3 text-green-400" />
                    <span>1 free interview credit</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <LuCircleCheckBig className="w-3 h-3 text-green-400" />
                    <span>AI-powered feedback</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <LuCircleCheckBig className="w-3 h-3 text-green-400" />
                    <span>Progress tracking</span>
                  </div>
                </div>
              </div>

              {/* Social Signup */}
              <div className="space-y-3">
                <Button variant="outline" className="w-full bg-transparent" disabled>
                  <LuGithub className="w-4 h-4 mr-2" />
                  Continue with GitHub
                </Button>
                <Button variant="outline" className="w-full bg-transparent" disabled>
                  <IoLogoGoogle className="w-4 h-4 mr-2" />
                  Continue with Google
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                      className="bg-background/50 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <LuEyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <LuEye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                      className="bg-background/50 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <LuEyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <LuEye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <Link href="/terms" className="text-foreground hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-foreground hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={!isFormValid || isLoading}>
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-foreground hover:underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
