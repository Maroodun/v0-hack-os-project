"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

interface LoginScreenProps {
  onLogin: (user: any) => void
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [hackerId, setHackerId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Check for special root account
    if (hackerId.toLowerCase() === "root" && password === "toor") {
      onLogin({
        email: "root@hacksim.os",
        id: "root-admin",
        hacker_id: "root",
        isRootUser: true,
        level: 999,
        credits: 999999,
        rank: "System Creator",
      })
      setLoading(false)
      return
    }

    if (!isSupabaseConfigured()) {
      // Mode démo - accepter n'importe quel ID avec un mot de passe
      if (hackerId.trim() && password.length >= 4) {
        onLogin({
          email: `${hackerId}@hacksim.os`,
          id: `demo-${hackerId}`,
          hacker_id: hackerId,
          isRootUser: false,
        })
      } else {
        setError("ID Hacker requis et mot de passe minimum 4 caractères")
      }
      setLoading(false)
      return
    }

    try {
      // Rechercher l'utilisateur par hacker_id
      const { data: profileData, error: profileError } = await supabase!
        .from("profiles")
        .select("email")
        .eq("hacker_id", hackerId)
        .single()

      if (profileError || !profileData) {
        throw new Error("ID Hacker introuvable")
      }

      // Connexion avec l'email trouvé
      const { data, error } = await supabase!.auth.signInWithPassword({
        email: profileData.email,
        password,
      })
      if (error) throw error
      onLogin(data.user)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured. Please set up your environment variables.")
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase!.auth.signUp({
        email,
        password,
      })
      if (error) throw error

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase!.from("profiles").insert([
          {
            id: data.user.id,
            hacker_id: hackerId,
            email: email,
            credits: 1000,
            level: 1,
          },
        ])
        if (profileError) throw profileError
        onLogin(data.user)
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black flex items-center justify-center p-4 crt-screen">
      <div className="absolute inset-0 opacity-10">
        <div className="scanlines"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-transparent to-green-500/10"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, #10b981 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <Card className="w-full max-w-md bg-gray-900/90 border-green-500/30 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-mono text-green-400 mb-2 glitch-text">HACKSIM OS</CardTitle>
          <div className="text-green-300/70 font-mono text-sm">SECURE ACCESS PORTAL</div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border border-green-500/30">
              <TabsTrigger
                value="login"
                className="font-mono text-green-400 data-[state=active]:bg-green-600 data-[state=active]:text-black"
              >
                LOGIN
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="font-mono text-green-400 data-[state=active]:bg-green-600 data-[state=active]:text-black"
              >
                CREATE ACCOUNT
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="ID Hacker"
                    value={hackerId}
                    onChange={(e) => setHackerId(e.target.value)}
                    className="bg-black/50 border-green-500/30 text-green-400 placeholder:text-green-400/50 font-mono crt-input"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/50 border-green-500/30 text-green-400 placeholder:text-green-400/50 font-mono crt-input"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-500 text-black font-mono font-bold"
                >
                  {loading ? "ACCESSING..." : "LOGIN"}
                </Button>
              </form>

              {/* Root Account Hint */}
              <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded">
                <div className="text-red-400 font-mono text-xs text-center">
                  <div className="mb-1">👑 COMPTE CRÉATEUR</div>
                  <div>ID: root | MDP: toor</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/50 border-green-500/30 text-green-400 placeholder:text-green-400/50 font-mono crt-input"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="Hacker ID (ex: H4XX#2981)"
                    value={hackerId}
                    onChange={(e) => setHackerId(e.target.value)}
                    className="bg-black/50 border-green-500/30 text-green-400 placeholder:text-green-400/50 font-mono crt-input"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/50 border-green-500/30 text-green-400 placeholder:text-green-400/50 font-mono crt-input"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-black/50 border-green-500/30 text-green-400 placeholder:text-green-400/50 font-mono crt-input"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-500 text-black font-mono font-bold"
                >
                  {loading ? "CREATING..." : "CREATE ACCOUNT"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {error && (
            <div className="mt-4 text-red-400 text-sm font-mono bg-red-900/20 p-2 rounded border border-red-500/30">
              ERROR: {error}
            </div>
          )}

          <div className="mt-4 text-center text-xs text-green-300/50 font-mono">ENCRYPTED CONNECTION | SSL SECURED</div>
        </CardContent>
      </Card>
    </div>
  )
}
