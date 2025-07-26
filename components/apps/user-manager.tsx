"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Crown, Ban, Eye, UserCheck } from "lucide-react"

interface User {
  id: string
  hackerId: string
  email: string
  level: number
  credits: number
  status: "online" | "offline" | "banned"
  lastSeen: Date
  joinDate: Date
  rank: string
}

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      hackerId: "CYBER#7777",
      email: "cyber@hacksim.os",
      level: 15,
      credits: 25000,
      status: "online",
      lastSeen: new Date(),
      joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      rank: "Intermédiaire",
    },
    {
      id: "2",
      hackerId: "GHOST#0001",
      email: "ghost@hacksim.os",
      level: 30,
      credits: 75000,
      status: "online",
      lastSeen: new Date(),
      joinDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      rank: "Avancé",
    },
    {
      id: "3",
      hackerId: "NOOB#1234",
      email: "noob@hacksim.os",
      level: 3,
      credits: 1500,
      status: "offline",
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      joinDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      rank: "Novice",
    },
    {
      id: "4",
      hackerId: "BANNED#666",
      email: "banned@hacksim.os",
      level: 8,
      credits: 0,
      status: "banned",
      lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000),
      joinDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      rank: "Apprenti",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const filteredUsers = users.filter(
    (user) =>
      user.hackerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const banUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, status: "banned" as const, credits: 0 } : user)),
    )
  }

  const unbanUser = (userId: string) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, status: "offline" as const } : user)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-400 border-green-500/30"
      case "offline":
        return "text-gray-400 border-gray-500/30"
      case "banned":
        return "text-red-400 border-red-500/30"
      default:
        return "text-gray-400 border-gray-500/30"
    }
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

  return (
    <div className="h-full bg-black text-red-400 p-4 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-mono flex items-center gap-2 mb-4">
          <Users className="w-6 h-6" />
          USER MANAGER
        </h1>
        <div className="text-red-300/70 font-mono text-sm">Gestion des utilisateurs - Privilèges administrateur</div>
      </div>

      {/* Search and Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="bg-gray-900/50 border-red-500/30">
          <CardContent className="p-4">
            <Input
              placeholder="Rechercher utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/50 border-red-500/30 text-red-400 placeholder:text-red-400/50 font-mono"
            />
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-red-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold font-mono text-red-400">{users.length}</div>
            <div className="text-xs font-mono text-red-300/70">Total utilisateurs</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-red-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold font-mono text-green-400">
              {users.filter((u) => u.status === "online").length}
            </div>
            <div className="text-xs font-mono text-red-300/70">En ligne</div>
          </CardContent>
        </Card>
      </div>

      {/* User List */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* User Table */}
        <Card className="bg-gray-900/50 border-red-500/30 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-red-400 font-mono">LISTE DES UTILISATEURS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-7 gap-4 text-xs font-mono text-red-300/70 border-b border-red-500/30 pb-2">
                <span>ID HACKER</span>
                <span>EMAIL</span>
                <span>NIVEAU</span>
                <span>CRÉDITS</span>
                <span>STATUT</span>
                <span>RANG</span>
                <span>ACTIONS</span>
              </div>
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-7 gap-4 text-xs font-mono text-red-400 py-2 hover:bg-red-500/10 rounded cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <span className="font-bold">{user.hackerId}</span>
                  <span className="truncate">{user.email}</span>
                  <span>{user.level}</span>
                  <span>{user.credits.toLocaleString()}</span>
                  <Badge className={`${getStatusColor(user.status)} bg-transparent border text-xs`}>
                    {user.status.toUpperCase()}
                  </Badge>
                  <span className={getRankColor(user.rank)}>{user.rank}</span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedUser(user)
                      }}
                      className="w-6 h-6 p-0 text-blue-400 hover:bg-blue-500/20"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    {user.status === "banned" ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          unbanUser(user.id)
                        }}
                        className="w-6 h-6 p-0 text-green-400 hover:bg-green-500/20"
                      >
                        <UserCheck className="w-3 h-3" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          banUser(user.id)
                        }}
                        className="w-6 h-6 p-0 text-red-400 hover:bg-red-500/20"
                      >
                        <Ban className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setSelectedUser(null)}
        >
          <Card className="bg-gray-900/95 border-red-500/30 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle className="text-red-400 font-mono flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                DÉTAILS UTILISATEUR - {selectedUser.hackerId}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-red-300/70 font-mono text-sm mb-1">ID Hacker</div>
                  <div className="text-red-400 font-mono font-bold">{selectedUser.hackerId}</div>
                </div>
                <div>
                  <div className="text-red-300/70 font-mono text-sm mb-1">Email</div>
                  <div className="text-red-400 font-mono">{selectedUser.email}</div>
                </div>
                <div>
                  <div className="text-red-300/70 font-mono text-sm mb-1">Niveau</div>
                  <div className="text-red-400 font-mono font-bold">{selectedUser.level}</div>
                </div>
                <div>
                  <div className="text-red-300/70 font-mono text-sm mb-1">Crédits</div>
                  <div className="text-red-400 font-mono font-bold">{selectedUser.credits.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-red-300/70 font-mono text-sm mb-1">Statut</div>
                  <Badge className={`${getStatusColor(selectedUser.status)} bg-transparent border`}>
                    {selectedUser.status.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <div className="text-red-300/70 font-mono text-sm mb-1">Rang</div>
                  <div className={`font-mono font-bold ${getRankColor(selectedUser.rank)}`}>{selectedUser.rank}</div>
                </div>
                <div>
                  <div className="text-red-300/70 font-mono text-sm mb-1">Dernière connexion</div>
                  <div className="text-red-400 font-mono text-sm">{selectedUser.lastSeen.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-red-300/70 font-mono text-sm mb-1">Date d'inscription</div>
                  <div className="text-red-400 font-mono text-sm">{selectedUser.joinDate.toLocaleDateString()}</div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-red-500/30">
                {selectedUser.status === "banned" ? (
                  <Button
                    onClick={() => {
                      unbanUser(selectedUser.id)
                      setSelectedUser(null)
                    }}
                    className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 text-green-400 font-mono"
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    DÉBANNIR
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      banUser(selectedUser.id)
                      setSelectedUser(null)
                    }}
                    className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 font-mono"
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    BANNIR
                  </Button>
                )}
                <Button
                  onClick={() => setSelectedUser(null)}
                  className="bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/50 text-gray-400 font-mono"
                >
                  FERMER
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Admin Actions */}
      <Card className="mt-6 bg-gradient-to-r from-red-900/20 to-yellow-900/20 border-yellow-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2 text-yellow-400 font-mono text-sm">
            <Crown className="w-5 h-5" />
            <span>PRIVILÈGES ADMINISTRATEUR - GESTION UTILISATEURS COMPLÈTE</span>
            <Crown className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
