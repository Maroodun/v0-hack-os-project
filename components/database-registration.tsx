"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Database, Shield, User, Key, FileText } from "lucide-react"

interface DatabaseRegistrationProps {
  onComplete: () => void
  onBack: () => void
}

export default function DatabaseRegistration({ onComplete, onBack }: DatabaseRegistrationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    hackerId: "",
    password: "",
    confirmPassword: "",
    securityQuestion: "",
    securityAnswer: "",
    bio: "",
    specialization: "network",
  })
  const [errors, setErrors] = useState<string[]>([])
  const [accessGranted, setAccessGranted] = useState(false)

  const steps = [
    "ACCESSING SECURE DATABASE...",
    "BYPASSING ENCRYPTION LAYERS...",
    "ESTABLISHING SECURE CONNECTION...",
    "LOADING RECRUITMENT INTERFACE...",
  ]

  const specializations = [
    { id: "network", name: "Network Infiltration", icon: "🌐" },
    { id: "database", name: "Database Exploitation", icon: "🗄️" },
    { id: "social", name: "Social Engineering", icon: "👥" },
    { id: "malware", name: "Malware Development", icon: "🦠" },
    { id: "crypto", name: "Cryptography", icon: "🔐" },
    { id: "forensics", name: "Digital Forensics", icon: "🔍" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1
        } else {
          clearInterval(timer)
          setTimeout(() => setAccessGranted(true), 1000)
          return prev
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const validateForm = () => {
    const newErrors: string[] = []

    if (!formData.email.includes("@")) {
      newErrors.push("Invalid email format")
    }
    if (formData.hackerId.length < 5) {
      newErrors.push("Hacker ID must be at least 5 characters")
    }
    if (formData.password.length < 6) {
      newErrors.push("Password must be at least 6 characters")
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.push("Passwords do not match")
    }
    if (!formData.securityAnswer.trim()) {
      newErrors.push("Security answer is required")
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    // Simulate database processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsProcessing(false)
    onComplete()
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors([]) // Clear errors when user types
  }

  if (!accessGranted) {
    return (
      <div className="min-h-screen bg-black text-red-400 font-mono flex flex-col justify-center items-center crt-screen">
        <div className="absolute inset-0 opacity-10">
          <div className="scanlines"></div>
        </div>

        <div className="w-full max-w-2xl relative z-10">
          <div className="mb-8 text-center">
            <div className="text-6xl mb-4">🗄️</div>
            <div className="text-3xl font-bold mb-4 glitch-text">RECRUITMENT DATABASE</div>
            <div className="text-sm opacity-70">CLASSIFIED ACCESS LEVEL: TOP SECRET</div>
          </div>

          <div className="space-y-2">
            {steps.slice(0, currentStep + 1).map((step, index) => (
              <div key={index} className="flex items-center">
                <span className="text-red-500 mr-2">[SECURE]</span>
                <span className={index === currentStep ? "animate-pulse" : ""}>{step}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          <div className="mt-8 text-center">
            <Button
              onClick={onBack}
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/20 font-mono bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              ABORT ACCESS
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900/20 via-black to-black text-red-400 font-mono flex items-center justify-center crt-screen p-4">
      <div className="absolute inset-0 opacity-10">
        <div className="scanlines"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Database className="w-8 h-8" />
            <div className="text-2xl font-bold glitch-text">OPERATIVE RECRUITMENT SYSTEM</div>
            <Shield className="w-8 h-8" />
          </div>
          <div className="text-sm opacity-70">CLASSIFIED DATABASE ACCESS | LEVEL 5 CLEARANCE</div>
          <Badge className="mt-2 bg-red-600/20 text-red-400 border-red-500/30">SECURE CONNECTION ESTABLISHED</Badge>
        </div>

        {/* Registration Form */}
        <div className="bg-black/80 border border-red-500/30 rounded p-6 backdrop-blur-sm">
          <div className="text-center mb-6">
            <div className="text-xl font-bold mb-2">NEW OPERATIVE REGISTRATION</div>
            <div className="text-sm opacity-70">Complete all fields to join the collective</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-300 font-bold text-sm">
                <User className="w-4 h-4" />
                PERSONAL IDENTIFICATION
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-1 block">EMAIL ADDRESS:</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="bg-gray-900/80 border-red-500/30 text-red-400 font-mono crt-input"
                    placeholder="operative@secure.net"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm mb-1 block">HACKER ID:</label>
                  <Input
                    value={formData.hackerId}
                    onChange={(e) => updateFormData("hackerId", e.target.value)}
                    className="bg-gray-900/80 border-red-500/30 text-red-400 font-mono crt-input"
                    placeholder="H4CK3R#1337"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Security Credentials */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-300 font-bold text-sm">
                <Key className="w-4 h-4" />
                SECURITY CREDENTIALS
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-1 block">PASSWORD:</label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    className="bg-gray-900/80 border-red-500/30 text-red-400 font-mono crt-input"
                    placeholder="Enter secure password"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm mb-1 block">CONFIRM PASSWORD:</label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                    className="bg-gray-900/80 border-red-500/30 text-red-400 font-mono crt-input"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm mb-1 block">SECURITY QUESTION:</label>
                <Input
                  value={formData.securityQuestion}
                  onChange={(e) => updateFormData("securityQuestion", e.target.value)}
                  className="bg-gray-900/80 border-red-500/30 text-red-400 font-mono crt-input"
                  placeholder="What was your first computer?"
                  required
                />
              </div>

              <div>
                <label className="text-sm mb-1 block">SECURITY ANSWER:</label>
                <Input
                  value={formData.securityAnswer}
                  onChange={(e) => updateFormData("securityAnswer", e.target.value)}
                  className="bg-gray-900/80 border-red-500/30 text-red-400 font-mono crt-input"
                  placeholder="Enter your answer"
                  required
                />
              </div>
            </div>

            {/* Specialization */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-300 font-bold text-sm">
                <Shield className="w-4 h-4" />
                SPECIALIZATION
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {specializations.map((spec) => (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => updateFormData("specialization", spec.id)}
                    className={`p-3 rounded border transition-all font-mono text-xs ${
                      formData.specialization === spec.id
                        ? "border-red-400 bg-red-500/20 text-red-300"
                        : "border-red-500/30 text-red-400 hover:bg-red-500/10"
                    }`}
                  >
                    <div className="text-lg mb-1">{spec.icon}</div>
                    <div>{spec.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-300 font-bold text-sm">
                <FileText className="w-4 h-4" />
                OPERATIVE PROFILE
              </div>

              <div>
                <label className="text-sm mb-1 block">BIO (OPTIONAL):</label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => updateFormData("bio", e.target.value)}
                  className="bg-gray-900/80 border-red-500/30 text-red-400 font-mono crt-input min-h-[80px]"
                  placeholder="Describe your hacking background and motivations..."
                />
              </div>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="bg-red-900/20 border border-red-500/30 rounded p-3">
                <div className="text-red-400 font-bold text-sm mb-2">VALIDATION ERRORS:</div>
                {errors.map((error, index) => (
                  <div key={index} className="text-red-400 text-xs">
                    • {error}
                  </div>
                ))}
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-4">
              <Button
                onClick={onBack}
                type="button"
                variant="outline"
                className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/20 font-mono bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                ABORT
              </Button>

              <Button
                type="submit"
                disabled={isProcessing}
                className="flex-1 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 font-mono font-bold retro-button"
              >
                {isProcessing ? "PROCESSING..." : "REGISTER OPERATIVE"}
              </Button>
            </div>
          </form>

          {isProcessing && (
            <div className="mt-4 text-center">
              <div className="text-xs animate-pulse space-y-1">
                <div>Encrypting personal data...</div>
                <div>Generating security tokens...</div>
                <div>Creating operative profile...</div>
                <div>Establishing secure channels...</div>
                <div>Finalizing registration...</div>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-4 text-xs opacity-50">
          RECRUITMENT DATABASE v3.2.1 | ALL ACTIVITIES MONITORED
        </div>
      </div>
    </div>
  )
}
