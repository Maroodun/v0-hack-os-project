"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Shield, Lock, Wifi, Send, Users } from "lucide-react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

interface ChatAppProps {
  user: any
}

interface Message {
  id: string
  sender_id: string
  content: string
  timestamp: Date
  encrypted: boolean
}

interface OnlineUser {
  id: string
  hacker_id: string
  last_seen: Date
}

export default function ChatApp({ user }: ChatAppProps) {
  const [isConnecting, setIsConnecting] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStep, setConnectionStep] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [serverInfo, setServerInfo] = useState({
    name: "DARKNET_SECURE_CHAT",
    ip: "192.168.0.1",
    port: "9999",
    encryption: "AES-256",
    users: 0,
  })

  const connectionSteps = [
    "Initialisation du client de chat sécurisé...",
    "Connexion au serveur darknet...",
    "Établissement du tunnel VPN...",
    "Négociation des clés de chiffrement...",
    "Authentification de l'utilisateur...",
    "Vérification de l'identité...",
    "Connexion au canal sécurisé établie!",
  ]

  useEffect(() => {
    if (isConnecting) {
      const timer = setInterval(() => {
        setConnectionStep((prev) => {
          if (prev < connectionSteps.length - 1) {
            return prev + 1
          } else {
            clearInterval(timer)
            setIsConnecting(false)
            setIsConnected(true)
            loadOnlineUsers()
            loadMessages()
            return prev
          }
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isConnecting])

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        loadOnlineUsers()
        loadMessages()
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [isConnected])

  const loadOnlineUsers = async () => {
    if (!isSupabaseConfigured()) {
      // Mode démo avec utilisateurs fictifs
      const demoUsers = [
        { id: "demo-1", hacker_id: "GHOST#0001", last_seen: new Date() },
        { id: "demo-2", hacker_id: "CYBER#7777", last_seen: new Date() },
        { id: "demo-3", hacker_id: "ANON#1337", last_seen: new Date() },
      ]
      setOnlineUsers(demoUsers)
      setServerInfo((prev) => ({ ...prev, users: demoUsers.length + 1 }))
      return
    }

    try {
      // Mettre à jour notre statut en ligne
      await supabase!.from("profiles").update({ last_seen: new Date() }).eq("id", user.id)

      // Récupérer les utilisateurs en ligne (actifs dans les 5 dernières minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      const { data, error } = await supabase!
        .from("profiles")
        .select("id, hacker_id, last_seen")
        .neq("id", user.id)
        .gte("last_seen", fiveMinutesAgo.toISOString())
        .order("last_seen", { ascending: false })

      if (error) throw error

      const users = data.map((u) => ({
        id: u.id,
        hacker_id: u.hacker_id,
        last_seen: new Date(u.last_seen),
      }))

      setOnlineUsers(users)
      setServerInfo((prev) => ({ ...prev, users: users.length + 1 }))
    } catch (error) {
      console.error("Error loading online users:", error)
    }
  }

  const loadMessages = async () => {
    if (!isSupabaseConfigured()) {
      // Messages de démo
      if (messages.length === 0) {
        setMessages([
          {
            id: "1",
            sender_id: "SYSTÈME",
            content: `Bienvenue ${getUserHackerId()} sur le canal sécurisé. Toutes les communications sont chiffrées.`,
            timestamp: new Date(),
            encrypted: true,
          },
        ])
      }
      return
    }

    try {
      // Charger les messages récents (dernière heure)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      const { data, error } = await supabase!
        .from("chat_messages")
        .select(`
          id,
          sender_id,
          content,
          created_at,
          profiles!chat_messages_sender_id_fkey(hacker_id)
        `)
        .gte("created_at", oneHourAgo.toISOString())
        .order("created_at", { ascending: true })
        .limit(50)

      if (error) throw error

      const formattedMessages = data.map((msg: any) => ({
        id: msg.id,
        sender_id: msg.profiles?.hacker_id || "INCONNU",
        content: msg.content,
        timestamp: new Date(msg.created_at),
        encrypted: true,
      }))

      setMessages(formattedMessages)
    } catch (error) {
      console.error("Error loading messages:", error)
    }
  }

  const getUserHackerId = () => {
    return user?.hacker_id || user?.email?.split("@")[0] || "HACKER"
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !isConnected) return

    const userHackerId = getUserHackerId()

    if (!isSupabaseConfigured()) {
      // Mode démo
      const message: Message = {
        id: Date.now().toString(),
        sender_id: userHackerId,
        content: newMessage,
        timestamp: new Date(),
        encrypted: true,
      }

      setMessages((prev) => [...prev, message])
      setNewMessage("")

      // Simuler une réponse du système
      setTimeout(() => {
        const systemMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender_id: "SYSTÈME",
          content: "Message reçu et déchiffré avec succès.",
          timestamp: new Date(),
          encrypted: true,
        }
        setMessages((prev) => [...prev, systemMessage])
      }, 2000)
      return
    }

    try {
      // Envoyer le message à la base de données
      const { error } = await supabase!.from("chat_messages").insert([
        {
          sender_id: user.id,
          content: newMessage,
        },
      ])

      if (error) throw error

      // Ajouter le message localement
      const message: Message = {
        id: Date.now().toString(),
        sender_id: userHackerId,
        content: newMessage,
        timestamp: new Date(),
        encrypted: true,
      }

      setMessages((prev) => [...prev, message])
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  if (isConnecting) {
    return (
      <div className="h-full bg-black text-green-400 p-4 flex flex-col justify-center items-center crt-screen">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <div className="text-2xl font-bold mb-2 glitch-text">CONNEXION SÉCURISÉE</div>
            <div className="text-sm opacity-70">Établissement du canal crypté</div>
          </div>

          <div className="space-y-2 mb-6">
            {connectionSteps.slice(0, connectionStep + 1).map((step, index) => (
              <div key={index} className="flex items-center">
                <span className="text-green-500 mr-2">[SECURE]</span>
                <span className={index === connectionStep ? "animate-pulse" : ""}>{step}</span>
              </div>
            ))}
          </div>

          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((connectionStep + 1) / connectionSteps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-black text-green-400 flex flex-col font-mono">
      {/* Header */}
      <div className="p-3 border-b border-green-500/30 bg-gray-900/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span className="font-bold text-sm">CHAT SÉCURISÉ</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-600/20 text-green-400 border-green-500/30 text-xs">
              <Shield className="w-3 h-3 mr-1" />
              CHIFFRÉ
            </Badge>
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 text-xs">
              <Wifi className="w-3 h-3 mr-1" />
              CONNECTÉ
            </Badge>
          </div>
        </div>
        <div className="text-xs text-green-300/70">
          Serveur: {serverInfo.name} | Utilisateurs: {serverInfo.users} | Chiffrement: {serverInfo.encryption}
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Chat Messages */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((message) => (
              <div key={message.id} className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-green-300/70">
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                  {message.encrypted && <Lock className="w-3 h-3 text-yellow-400" />}
                </div>
                <div className="text-green-400 text-sm">
                  <span className="text-green-300 font-bold">{message.sender_id}</span>
                  <span className="text-green-300 mx-2">:</span>
                  <span>{message.content}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-3 border-t border-green-500/30 bg-gray-900/30">
            <form onSubmit={sendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Tapez votre message chiffré..."
                className="bg-black/50 border-green-500/30 text-green-400 placeholder:text-green-400/50 font-mono text-sm"
              />
              <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-500 text-black font-mono">
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <div className="text-xs text-green-300/50 mt-1">🔒 Tous les messages sont chiffrés avec AES-256</div>
          </div>
        </div>

        {/* Online Users Sidebar */}
        <div className="w-56 border-l border-green-500/30 bg-gray-900/30">
          <div className="p-3 border-b border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4" />
              <span className="font-bold text-sm">UTILISATEURS EN LIGNE</span>
            </div>
          </div>
          <div className="p-3 space-y-2 overflow-y-auto">
            {/* Current user */}
            <div className="flex items-center gap-2 p-2 bg-green-900/20 rounded">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-bold">{getUserHackerId()}</span>
              <span className="text-xs text-green-300/50">(vous)</span>
            </div>

            {/* Other users */}
            {onlineUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-2 p-2 bg-gray-800/30 rounded">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">{user.hacker_id}</span>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-green-500/30">
            <div className="text-xs text-green-300/50">Total: {onlineUsers.length + 1} utilisateurs connectés</div>
          </div>
        </div>
      </div>
    </div>
  )
}
