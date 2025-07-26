"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, Users, Trophy, DollarSign, Target, UserPlus, Award, Clock } from "lucide-react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { DatabaseManager } from "@/lib/database"

interface ProfileAppProps {
  user: any
}

interface Friend {
  id: string
  hacker_id: string
  email: string
  level: number
  status: "online" | "offline"
}

interface Achievement {
  id: string
  name: string
  description: string
  unlockedAt: string
}

export default function ProfileApp({ user }: ProfileAppProps) {
  const [profile, setProfile] = useState({
    hacker_id: "",
    level: 1,
    credits: 5000,
    missions_completed: 0,
    rank: "Novice",
    total_playtime: 0,
    last_login: new Date(),
  })
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendCode, setFriendCode] = useState("")
  const [onlineUsers, setOnlineUsers] = useState<Friend[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [statistics, setStatistics] = useState<any>({})
  const [dbManager, setDbManager] = useState<DatabaseManager | null>(null)

  useEffect(() => {
    if (user?.id) {
      const manager = new DatabaseManager(user.id)
      setDbManager(manager)
      loadProfile()
      loadFriends()
      loadOnlineUsers()
      loadAchievements()
      loadStatistics()
    }

    // Set up real-time updates every 5 seconds
    const interval = setInterval(() => {
      loadOnlineUsers()
    }, 5000)

    return () => clearInterval(interval)
  }, [user])

  const loadProfile = async () => {
    if (!isSupabaseConfigured()) {
      // Demo data when Supabase is not configured
      setProfile({
        hacker_id: "DEMO#1337",
        level: 5,
        credits: 15000,
        missions_completed: 12,
        rank: getRank(5),
        total_playtime: 7200, // 2 hours in seconds
        last_login: new Date(),
      })
      return
    }

    try {
      const { data, error } = await supabase!.from("profiles").select("*").eq("id", user.id).single()

      if (error) throw error
      if (data) {
        setProfile({
          hacker_id: data.hacker_id || "",
          level: data.level || 1,
          credits: data.credits || 5000,
          missions_completed: data.missions_completed || 0,
          rank: getRank(data.level || 1),
          total_playtime: data.total_playtime || 0,
          last_login: new Date(data.last_seen || Date.now()),
        })
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    }
  }

  const loadFriends = async () => {
    if (!isSupabaseConfigured()) {
      setFriends([])
      return
    }

    try {
      const { data, error } = await supabase!
        .from("friends")
        .select(`
        friend_id,
        profiles!friends_friend_id_fkey(id, hacker_id, email, level)
      `)
        .eq("user_id", user.id)

      if (error) throw error
      if (data) {
        const friendsList = data.map((item: any) => ({
          id: item.profiles.id,
          hacker_id: item.profiles.hacker_id,
          email: item.profiles.email,
          level: item.profiles.level,
          status: "offline" as const,
        }))
        setFriends(friendsList)
      }
    } catch (error) {
      console.error("Error loading friends:", error)
    }
  }

  const loadOnlineUsers = async () => {
    if (!isSupabaseConfigured()) {
      // Demo online users when Supabase is not configured
      setOnlineUsers([
        {
          id: "demo-3",
          hacker_id: "CYBER#7777",
          email: "cyber@hacksim.os",
          level: 15,
          status: "online",
        },
        {
          id: "demo-4",
          hacker_id: "GHOST#0001",
          email: "ghost@hacksim.os",
          level: 30,
          status: "online",
        },
      ])
      return
    }

    try {
      const { data, error } = await supabase!
        .from("profiles")
        .select("id, hacker_id, email, level, last_seen")
        .neq("id", user.id)
        .order("last_seen", { ascending: false })
        .limit(10)

      if (error) throw error
      if (data) {
        const users = data.map((user: any) => ({
          id: user.id,
          hacker_id: user.hacker_id,
          email: user.email,
          level: user.level,
          status: isOnline(user.last_seen) ? ("online" as const) : ("offline" as const),
        }))
        setOnlineUsers(users)
      }
    } catch (error) {
      console.error("Error loading online users:", error)
    }
  }

  const loadAchievements = async () => {
    if (!dbManager) return

    try {
      const achievementsData = await dbManager.loadAchievements()
      setAchievements(achievementsData)
    } catch (error) {
      console.error("Error loading achievements:", error)
    }
  }

  const loadStatistics = async () => {
    if (!dbManager) return

    try {
      const statsData = await dbManager.loadStatistics()
      setStatistics(statsData)
    } catch (error) {
      console.error("Error loading statistics:", error)
    }
  }

  const isOnline = (lastSeen: string) => {
    if (!lastSeen) return false
    const lastSeenDate = new Date(lastSeen)
    const now = new Date()
    const diffMinutes = (now.getTime() - lastSeenDate.getTime()) / (1000 * 60)
    return diffMinutes < 5 // Consider online if active within 5 minutes
  }

  const addFriend = async () => {
    if (!friendCode.trim()) return

    if (!isSupabaseConfigured()) {
      alert("Le système d'amis nécessite la configuration de Supabase!")
      return
    }

    try {
      // Find user by hacker_id
      const { data: friendData, error: findError } = await supabase!
        .from("profiles")
        .select("id, hacker_id, email, level")
        .eq("hacker_id", friendCode.trim())
        .single()

      if (findError || !friendData) {
        alert("ID Hacker introuvable!")
        return
      }

      // Check if already friends
      const { data: existingFriend } = await supabase!
        .from("friends")
        .select("id")
        .eq("user_id", user.id)
        .eq("friend_id", friendData.id)
        .single()

      if (existingFriend) {
        alert("Déjà ami avec cet utilisateur!")
        return
      }

      // Add friend relationship
      const { error: addError } = await supabase!
        .from("friends")
        .insert([{ user_id: user.id, friend_id: friendData.id }])

      if (addError) throw addError

      // Add to local state
      setFriends((prev) => [
        ...prev,
        {
          id: friendData.id,
          hacker_id: friendData.hacker_id,
          email: friendData.email,
          level: friendData.level,
          status: "offline",
        },
      ])

      setFriendCode("")
      alert("Ami ajouté avec succès!")
    } catch (error) {
      console.error("Error adding friend:", error)
      alert("Échec de l'ajout d'ami")
    }
  }

  const getRank = (level: number) => {
    if (level >= 50) return "Hacker Elite"
    if (level >= 30) return "Expert"
    if (level >= 20) return "Avancé"
    if (level >= 10) return "Intermédiaire"
    if (level >= 5) return "Apprenti"
    return "Novice"
  }

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "Hacker Elite":
        return "text-red-400"
      case "Expert":
        return "text-purple-400"
      case "Avancé":
        return "text-blue-400"
      case "Intermédiaire":
        return "text-yellow-400"
      case "Apprenti":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  const formatPlaytime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const getNextLevelXP = (level: number) => {
    return level * 1000 // Simple XP calculation
  }

  const getCurrentXP = (level: number, missionsCompleted: number) => {
    return (level - 1) * 1000 + missionsCompleted * 100
  }

  return (
    <div className="h-full bg-black text-green-400 p-4 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-mono flex items-center gap-2 mb-4">
          <User className="w-6 h-6" />
          PROFIL HACKER
        </h1>
        <div className="text-green-300/70 font-mono text-sm">
          Gérez votre identité de hacker et suivez votre progression.
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Info */}
        <Card className="bg-gray-900/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 font-mono">IDENTITÉ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-green-300/70 font-mono text-sm mb-1">ID Hacker</div>
              <div className="text-green-400 font-mono text-lg font-bold">{profile.hacker_id || "Non défini"}</div>
            </div>
            <div>
              <div className="text-green-300/70 font-mono text-sm mb-1">Email</div>
              <div className="text-green-400 font-mono">{user.email}</div>
            </div>
            <div>
              <div className="text-green-300/70 font-mono text-sm mb-1">Rang</div>
              <Badge className={`${getRankColor(profile.rank)} bg-transparent border font-mono`}>{profile.rank}</Badge>
            </div>
            <div>
              <div className="text-green-300/70 font-mono text-sm mb-1">Dernière connexion</div>
              <div className="text-green-400 font-mono text-sm">{profile.last_login.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="bg-gray-900/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 font-mono">STATISTIQUES</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="font-mono text-sm">Niveau</span>
              </div>
              <span className="font-mono font-bold">{profile.level}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="font-mono text-sm">Crédits</span>
              </div>
              <span className="font-mono font-bold">{profile.credits.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="font-mono text-sm">Missions</span>
              </div>
              <span className="font-mono font-bold">{profile.missions_completed}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="font-mono text-sm">Temps de jeu</span>
              </div>
              <span className="font-mono font-bold">{formatPlaytime(profile.total_playtime)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Level Progress */}
        <Card className="bg-gray-900/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 font-mono">PROGRESSION</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-mono mb-2">
                <span>Niveau {profile.level}</span>
                <span>Niveau {profile.level + 1}</span>
              </div>
              <Progress value={(getCurrentXP(profile.level, profile.missions_completed) % 1000) / 10} className="h-2" />
              <div className="text-xs text-green-300/70 font-mono mt-1">
                {getCurrentXP(profile.level, profile.missions_completed) % 1000} / 1000 XP
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-gray-900/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 font-mono flex items-center gap-2">
              <Award className="w-4 h-4" />
              SUCCÈS ({achievements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {achievements.length === 0 ? (
                <div className="text-green-300/70 font-mono text-sm text-center py-4">Aucun succès débloqué</div>
              ) : (
                achievements.map((achievement) => (
                  <div key={achievement.id} className="p-2 bg-black/30 rounded">
                    <div className="font-mono text-sm text-green-400 font-bold">{achievement.name}</div>
                    <div className="font-mono text-xs text-green-300/70">{achievement.description}</div>
                    <div className="font-mono text-xs text-green-300/50">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Add Friend */}
        <Card className="bg-gray-900/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 font-mono">AJOUTER AMI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Entrez l'ID Hacker (ex: H4XX#2981)"
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value)}
                className="bg-black/50 border-green-500/30 text-green-400 placeholder:text-green-400/50 font-mono"
              />
              <Button onClick={addFriend} className="bg-green-600 hover:bg-green-500 text-black font-mono font-bold">
                <UserPlus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Friends List */}
        <Card className="bg-gray-900/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 font-mono flex items-center gap-2">
              <Users className="w-4 h-4" />
              AMIS ({friends.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {friends.length === 0 ? (
                <div className="text-green-300/70 font-mono text-sm text-center py-4">Aucun ami ajouté</div>
              ) : (
                friends.map((friend) => (
                  <div key={friend.id} className="flex items-center justify-between p-2 bg-black/30 rounded">
                    <div>
                      <div className="font-mono text-sm text-green-400">{friend.hacker_id}</div>
                      <div className="font-mono text-xs text-green-300/70">Niveau {friend.level}</div>
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full ${friend.status === "online" ? "bg-green-400" : "bg-gray-500"}`}
                    />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Online Users */}
      <Card className="mt-6 bg-gray-900/50 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 font-mono">HACKERS EN LIGNE</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {onlineUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-2 bg-black/30 rounded">
                <div>
                  <div className="font-mono text-sm text-green-400">{user.hacker_id}</div>
                  <div className="font-mono text-xs text-green-300/70">Niveau {user.level}</div>
                </div>
                <div
                  className={`w-2 h-2 rounded-full ${
                    user.status === "online" ? "bg-green-400 animate-pulse" : "bg-gray-500"
                  }`}
                />
              </div>
            ))}
          </div>
          {onlineUsers.length === 0 && (
            <div className="text-green-300/70 font-mono text-sm text-center py-4">Aucun autre hacker en ligne</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
