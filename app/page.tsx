"use client"

import { useState, useEffect } from "react"
import BootScreen from "@/components/boot-screen"
import Desktop from "@/components/desktop"
import RootDesktop from "@/components/root-desktop"
import LoginScreen from "@/components/login-screen"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

export default function HackSimOS() {
  const [currentScreen, setCurrentScreen] = useState<"boot" | "login" | "desktop">("boot")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    // Check current session
    supabase!.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        setCurrentScreen("desktop")
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase!.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        setCurrentScreen("desktop")
      } else {
        setUser(null)
        setCurrentScreen("boot")
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleBootComplete = () => {
    // Check if root user was authenticated in boot screen
    const rootUserData = localStorage.getItem("hacksim-root-user")
    if (rootUserData) {
      const rootUser = JSON.parse(rootUserData)
      localStorage.removeItem("hacksim-root-user") // Clean up
      setUser(rootUser)
      setCurrentScreen("desktop")
      return
    }

    if (isSupabaseConfigured() && !user) {
      setCurrentScreen("login")
    } else {
      setCurrentScreen("desktop")
      if (!user) {
        setUser({ email: "demo@hacksim.os", id: "demo-user" })
      }
    }
  }

  const handleLogin = (loggedInUser: any) => {
    setUser(loggedInUser)
    setCurrentScreen("desktop")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-400 font-mono text-xl animate-pulse">INITIALIZING HACKSIM OS...</div>
      </div>
    )
  }

  switch (currentScreen) {
    case "boot":
      return <BootScreen onBootComplete={handleBootComplete} />
    case "login":
      return <LoginScreen onLogin={handleLogin} />
    case "desktop":
      // Check if user is root and render appropriate desktop
      if (user?.isRootUser || user?.hacker_id === "root") {
        return <RootDesktop user={user} />
      }
      return <Desktop user={user} />
    default:
      return <BootScreen onBootComplete={handleBootComplete} />
  }
}
