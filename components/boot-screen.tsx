"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DatabaseRegistration from "@/components/database-registration"

interface BootScreenProps {
  onBootComplete: () => void
}

export default function BootScreen({ onBootComplete }: BootScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showLogin, setShowLogin] = useState(false)
  const [showDatabase, setShowDatabase] = useState(false)
  const [hackerId, setHackerId] = useState("")
  const [password, setPassword] = useState("")
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isHacking, setIsHacking] = useState(false)
  const [selectedAuthority, setSelectedAuthority] = useState("fbi")

  const authorities = {
    fbi: {
      name: "FBI CYBER DIVISION",
      logo: "🏛️",
      subtitle: "FEDERAL BUREAU OF INVESTIGATION",
      warning: "UNAUTHORIZED ACCESS IS A FEDERAL CRIME",
      color: "text-blue-400",
      bgColor: "from-blue-900/20",
    },
    cia: {
      name: "CIA CYBER COMMAND",
      logo: "🦅",
      subtitle: "CENTRAL INTELLIGENCE AGENCY",
      warning: "CLASSIFIED SYSTEM - AUTHORIZED PERSONNEL ONLY",
      color: "text-gray-300",
      bgColor: "from-gray-900/20",
    },
    nsa: {
      name: "NSA CYBER OPERATIONS",
      logo: "🔒",
      subtitle: "NATIONAL SECURITY AGENCY",
      warning: "TOP SECRET CLEARANCE REQUIRED",
      color: "text-purple-400",
      bgColor: "from-purple-900/20",
    },
    anonymous: {
      name: "ANONYMOUS COLLECTIVE",
      logo: "🎭",
      subtitle: "WE ARE LEGION",
      warning: "EXPECT US",
      color: "text-green-400",
      bgColor: "from-green-900/20",
    },
    interpol: {
      name: "INTERPOL CYBERCRIME",
      logo: "🌐",
      subtitle: "INTERNATIONAL CRIMINAL POLICE",
      warning: "GLOBAL SECURITY NETWORK",
      color: "text-yellow-400",
      bgColor: "from-yellow-900/20",
    },
    root: {
      name: "SYSTEM CREATOR ACCESS",
      logo: "👑",
      subtitle: "HACKSIM OS DEVELOPER PORTAL",
      warning: "CREATOR PRIVILEGES REQUIRED",
      color: "text-red-400",
      bgColor: "from-red-900/20",
    },
  }

  const bootSequence = [
    "INITIALIZING HACKSIM OS...",
    "LOADING KERNEL MODULES...",
    "MOUNTING ENCRYPTED FILESYSTEMS...",
    "STARTING NETWORK SERVICES...",
    "LOADING HACKING TOOLS...",
    "BYPASSING SECURITY PROTOCOLS...",
    "ESTABLISHING ANONYMOUS CONNECTIONS...",
    "SYSTEM READY",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < bootSequence.length - 1) {
          return prev + 1
        } else {
          clearInterval(timer)
          setTimeout(() => setShowLogin(true), 1000)
          return prev
        }
      })
    }, 800)

    return () => clearInterval(timer)
  }, [])

  // Auto-switch to root authority when root ID is entered
  useEffect(() => {
    if (hackerId.toLowerCase() === "root") {
      setSelectedAuthority("root")
    } else if (selectedAuthority === "root" && hackerId.toLowerCase() !== "root") {
      setSelectedAuthority("fbi")
    }
  }, [hackerId])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsHacking(true)
    setLoginAttempts((prev) => prev + 1)

    // Check for special root account FIRST
    if (hackerId.toLowerCase() === "root" && password === "toor") {
      // Special root login sequence
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsHacking(false)

      // Pass root user data to the main app
      const rootUser = {
        email: "root@hacksim.os",
        id: "root-admin",
        hacker_id: "root",
        isRootUser: true,
        level: 999,
        credits: 999999,
        rank: "System Creator",
      }

      // We need to pass this to the parent component
      // For now, we'll use localStorage to pass the root user data
      localStorage.setItem("hacksim-root-user", JSON.stringify(rootUser))
      onBootComplete()
      return
    }

    // Simulate hacking sequence for other accounts
    await new Promise((resolve) => setTimeout(resolve, 3000))

    if (loginAttempts >= 2 || (hackerId.toLowerCase().includes("admin") && password.length > 4)) {
      // Success after multiple attempts or correct credentials
      setIsHacking(false)
      setTimeout(onBootComplete, 1000)
    } else {
      setIsHacking(false)
    }
  }

  const handleDatabaseAccess = () => {
    setShowDatabase(true)
  }

  const handleDatabaseComplete = () => {
    setShowDatabase(false)
    onBootComplete()
  }

  const currentAuth = authorities[selectedAuthority as keyof typeof authorities]

  if (showDatabase) {
    return <DatabaseRegistration onComplete={handleDatabaseComplete} onBack={() => setShowDatabase(false)} />
  }

  if (!showLogin) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex flex-col justify-center items-center crt-screen">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <div className="text-4xl font-bold mb-4 animate-pulse glitch-text">HACKSIM OS</div>
            <div className="text-sm opacity-70">Unauthorized Access Detected</div>
          </div>

          <div className="space-y-2">
            {bootSequence.slice(0, currentStep + 1).map((step, index) => (
              <div key={index} className="flex items-center">
                <span className="text-green-500 mr-2">[OK]</span>
                <span className={index === currentStep ? "animate-pulse" : ""}>{step}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / bootSequence.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${currentAuth.bgColor} via-black to-black text-green-400 font-mono flex items-center justify-center crt-screen`}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="scanlines"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Authority Selection */}
        <div className="mb-6 flex justify-center gap-2">
          {Object.entries(authorities).map(([key, auth]) => (
            <button
              key={key}
              onClick={() => setSelectedAuthority(key)}
              className={`p-2 rounded border transition-all ${
                selectedAuthority === key
                  ? `border-current ${auth.color} bg-current/10`
                  : "border-gray-600 text-gray-400 hover:border-gray-400"
              }`}
            >
              <span className="text-2xl">{auth.logo}</span>
            </button>
          ))}
        </div>

        {/* Authority Header */}
        <div className={`text-center mb-8 ${currentAuth.color}`}>
          <div className="text-6xl mb-4">{currentAuth.logo}</div>
          <div className="text-2xl font-bold mb-2 glitch-text">{currentAuth.name}</div>
          <div className="text-sm opacity-80 mb-4">{currentAuth.subtitle}</div>
          <div className="text-xs text-red-400 animate-pulse border border-red-400/30 p-2 rounded">
            ⚠️ {currentAuth.warning} ⚠️
          </div>
        </div>

        <div className="bg-black/80 border border-current/30 rounded p-6 backdrop-blur-sm">
          <div className="text-center mb-6">
            <div className="text-xl font-bold mb-2">SYSTEM ACCESS</div>
            <div className="text-sm opacity-70">Enter credentials to bypass security</div>
            {loginAttempts > 0 && !isHacking && hackerId.toLowerCase() !== "root" && (
              <div className="text-red-400 text-xs mt-2 animate-pulse">
                ACCESS DENIED - ATTEMPTING BRUTE FORCE... ({loginAttempts}/3)
              </div>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="text-sm mb-1">ID HACKER:</div>
              <Input
                value={hackerId}
                onChange={(e) => setHackerId(e.target.value)}
                className="bg-gray-900/80 border-current/30 text-current font-mono crt-input"
                placeholder="Entrez votre ID..."
                required
              />
            </div>

            <div>
              <div className="text-sm mb-1">PASSWORD:</div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-900/80 border-current/30 text-current font-mono crt-input"
                placeholder="Enter password..."
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isHacking}
              className={`w-full ${currentAuth.color} bg-current/20 hover:bg-current/30 border border-current/50 text-current font-mono font-bold`}
            >
              {isHacking
                ? hackerId.toLowerCase() === "root"
                  ? "AUTHENTICATING ROOT..."
                  : "HACKING SYSTEM..."
                : hackerId.toLowerCase() === "root"
                  ? "AUTHENTICATE"
                  : "BREACH SECURITY"}
            </Button>
          </form>

          {/* Root Account Hint */}
          {hackerId.toLowerCase() === "root" && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded">
              <div className="text-red-400 font-mono text-xs text-center">
                <div className="mb-1">👑 CREATOR ACCESS DETECTED</div>
                <div>Authenticating system creator...</div>
              </div>
            </div>
          )}

          {/* Special Database Access Button */}
          <div className="mt-6 pt-4 border-t border-current/20">
            <div className="text-center mb-3">
              <div className="text-xs opacity-60">NEW OPERATIVE REGISTRATION</div>
            </div>
            <Button
              onClick={handleDatabaseAccess}
              className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 font-mono font-bold retro-button"
            >
              <span className="mr-2">🗄️</span>
              ACCESS RECRUITMENT DATABASE
            </Button>
            <div className="text-center mt-2">
              <div className="text-xs text-red-400/70">CLASSIFIED - AUTHORIZED PERSONNEL ONLY</div>
            </div>
          </div>

          {isHacking && (
            <div className="mt-4 text-center">
              <div className="text-xs animate-pulse space-y-1">
                {hackerId.toLowerCase() === "root" ? (
                  <>
                    <div>Verifying creator credentials...</div>
                    <div>Checking system privileges...</div>
                    <div>Granting root access...</div>
                    <div>Loading creator interface...</div>
                  </>
                ) : (
                  <>
                    <div>Attempting SQL injection...</div>
                    <div>Bypassing firewall...</div>
                    <div>Escalating privileges...</div>
                    <div>Decrypting database...</div>
                    <div>Installing backdoor...</div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-4 text-xs opacity-50">
          CLASSIFIED SYSTEM v2.1.0 | UNAUTHORIZED ACCESS MONITORED
        </div>
      </div>
    </div>
  )
}
