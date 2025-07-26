"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Send, Inbox, Star, Shield, AlertTriangle } from "lucide-react"

interface Email {
  id: string
  from: string
  to: string
  subject: string
  content: string
  timestamp: Date
  read: boolean
  starred: boolean
  type: "inbox" | "sent" | "phishing" | "ransomware"
  encrypted: boolean
}

export default function MailApp() {
  const [emails, setEmails] = useState<Email[]>([])
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [currentView, setCurrentView] = useState<"inbox" | "sent" | "compose">("inbox")
  const [newEmail, setNewEmail] = useState({
    to: "",
    subject: "",
    content: "",
    type: "normal" as "normal" | "phishing" | "ransomware",
  })

  const userEmail = "hacker@darknet.onion"

  useEffect(() => {
    // Charger les emails de démonstration
    const demoEmails: Email[] = [
      {
        id: "1",
        from: "mission-control@hacksim.os",
        to: userEmail,
        subject: "🎯 Nouvelle Mission Disponible - Infiltration TechCorp",
        content: `Agent,

Une nouvelle mission de haute priorité est disponible :

OBJECTIF : Infiltrer la base de données employés de TechCorp
RÉCOMPENSE : 2500 crédits
DIFFICULTÉ : Moyen
DEADLINE : 48h

Utilisez vos compétences en SQL injection pour accéder aux données sensibles.
Tous les outils nécessaires sont disponibles dans le magasin.

Bonne chance,
Mission Control`,
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
        starred: true,
        type: "inbox",
        encrypted: true,
      },
      {
        id: "2",
        from: "payment@crypto-bank.onion",
        to: userEmail,
        subject: "💰 Paiement Ransomware Reçu - 15,000 BTC",
        content: `Transaction confirmée,

Nous avons reçu le paiement de votre dernière opération ransomware :

Montant : 15,000 BTC (~$450,000 USD)
Transaction ID : 7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c
Confirmations : 6/6

Les fonds ont été automatiquement convertis en crédits HackSim :
+ 45,000 crédits ajoutés à votre compte

Merci d'utiliser nos services de blanchiment sécurisé.

Crypto Bank Anonymous`,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        starred: false,
        type: "inbox",
        encrypted: true,
      },
      {
        id: "3",
        from: "victim@corporate.com",
        to: userEmail,
        subject: "RE: Urgent - Vérification de Compte",
        content: `Bonjour,

Merci pour votre email concernant la vérification de mon compte.
Voici mes informations comme demandé :

Nom d'utilisateur : admin_john
Mot de passe : Corporate123!
Code 2FA : 847392

J'espère que cela résoudra le problème avec mon compte.

Cordialement,
John Smith
Administrateur IT`,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        read: true,
        starred: true,
        type: "inbox",
        encrypted: false,
      },
      {
        id: "4",
        from: userEmail,
        to: "victim@corporate.com",
        subject: "Urgent - Vérification de Compte",
        content: `Bonjour,

Nous avons détecté une activité suspecte sur votre compte.
Pour des raisons de sécurité, nous devons vérifier votre identité.

Veuillez répondre avec :
- Votre nom d'utilisateur
- Votre mot de passe actuel  
- Votre code d'authentification à deux facteurs

Cette vérification est obligatoire dans les 24h pour éviter la suspension de votre compte.

Équipe Sécurité IT
Service Informatique`,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        read: true,
        starred: false,
        type: "sent",
        encrypted: false,
      },
    ]

    setEmails(demoEmails)
  }, [])

  const sendEmail = () => {
    if (!newEmail.to || !newEmail.subject || !newEmail.content) return

    const email: Email = {
      id: Date.now().toString(),
      from: userEmail,
      to: newEmail.to,
      subject: newEmail.subject,
      content: newEmail.content,
      timestamp: new Date(),
      read: true,
      starred: false,
      type: "sent",
      encrypted: newEmail.type !== "normal",
    }

    setEmails((prev) => [email, ...prev])
    setNewEmail({ to: "", subject: "", content: "", type: "normal" })
    setCurrentView("sent")
  }

  const getEmailTypeIcon = (email: Email) => {
    if (email.type === "sent" && email.to.includes("victim")) {
      return <AlertTriangle className="w-4 h-4 text-orange-400" />
    }
    if (email.from.includes("payment") || email.subject.includes("Paiement")) {
      return <span className="text-green-400">💰</span>
    }
    if (email.from.includes("mission")) {
      return <span className="text-blue-400">🎯</span>
    }
    return <Mail className="w-4 h-4" />
  }

  const filteredEmails = emails.filter((email) => {
    if (currentView === "inbox") return email.type === "inbox"
    if (currentView === "sent") return email.type === "sent"
    return true
  })

  if (currentView === "compose") {
    return (
      <div className="h-full bg-black text-green-400 p-4">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold font-mono flex items-center gap-2">
              <Send className="w-6 h-6" />
              COMPOSER UN EMAIL
            </h1>
            <Button
              onClick={() => setCurrentView("inbox")}
              variant="outline"
              className="border-green-500/30 text-green-400 hover:bg-green-500/20 font-mono bg-transparent"
            >
              RETOUR
            </Button>
          </div>
        </div>

        <Card className="bg-gray-900/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 font-mono">NOUVEAU MESSAGE</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-green-400 font-mono text-sm mb-2 block">De :</label>
              <Input value={userEmail} disabled className="bg-black/50 border-green-500/30 text-green-400 font-mono" />
            </div>

            <div>
              <label className="text-green-400 font-mono text-sm mb-2 block">À :</label>
              <Input
                value={newEmail.to}
                onChange={(e) => setNewEmail((prev) => ({ ...prev, to: e.target.value }))}
                placeholder="victim@target.com"
                className="bg-black/50 border-green-500/30 text-green-400 placeholder:text-green-400/50 font-mono"
              />
            </div>

            <div>
              <label className="text-green-400 font-mono text-sm mb-2 block">Sujet :</label>
              <Input
                value={newEmail.subject}
                onChange={(e) => setNewEmail((prev) => ({ ...prev, subject: e.target.value }))}
                placeholder="Urgent - Action Requise"
                className="bg-black/50 border-green-500/30 text-green-400 placeholder:text-green-400/50 font-mono"
              />
            </div>

            <div>
              <label className="text-green-400 font-mono text-sm mb-2 block">Type d'email :</label>
              <div className="flex gap-2">
                {[
                  { id: "normal", name: "Normal", color: "bg-gray-600" },
                  { id: "phishing", name: "Phishing", color: "bg-orange-600" },
                  { id: "ransomware", name: "Ransomware", color: "bg-red-600" },
                ].map((type) => (
                  <Button
                    key={type.id}
                    onClick={() => setNewEmail((prev) => ({ ...prev, type: type.id as any }))}
                    variant={newEmail.type === type.id ? "default" : "outline"}
                    className={`font-mono text-xs ${
                      newEmail.type === type.id
                        ? `${type.color} text-white`
                        : "border-green-500/30 text-green-400 hover:bg-green-500/20"
                    }`}
                  >
                    {type.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-green-400 font-mono text-sm mb-2 block">Message :</label>
              <Textarea
                value={newEmail.content}
                onChange={(e) => setNewEmail((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Rédigez votre message..."
                className="bg-black/50 border-green-500/30 text-green-400 placeholder:text-green-400/50 font-mono min-h-[200px]"
              />
            </div>

            <Button
              onClick={sendEmail}
              className="w-full bg-green-600 hover:bg-green-500 text-black font-mono font-bold"
            >
              <Send className="w-4 h-4 mr-2" />
              ENVOYER
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full bg-black text-green-400 flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-green-500/30 p-4">
        <div className="mb-6">
          <h1 className="text-xl font-bold font-mono flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5" />
            DARKMAIL
          </h1>
          <div className="text-green-300/70 font-mono text-xs">Service de messagerie anonyme</div>
        </div>

        <div className="space-y-2">
          <Button
            onClick={() => setCurrentView("inbox")}
            variant={currentView === "inbox" ? "default" : "ghost"}
            className={`w-full justify-start font-mono text-sm ${
              currentView === "inbox" ? "bg-green-600 text-black" : "text-green-400 hover:bg-green-500/20"
            }`}
          >
            <Inbox className="w-4 h-4 mr-2" />
            Boîte de réception ({emails.filter((e) => e.type === "inbox" && !e.read).length})
          </Button>

          <Button
            onClick={() => setCurrentView("sent")}
            variant={currentView === "sent" ? "default" : "ghost"}
            className={`w-full justify-start font-mono text-sm ${
              currentView === "sent" ? "bg-green-600 text-black" : "text-green-400 hover:bg-green-500/20"
            }`}
          >
            <Send className="w-4 h-4 mr-2" />
            Envoyés ({emails.filter((e) => e.type === "sent").length})
          </Button>

          <Button
            onClick={() => setCurrentView("compose")}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold"
          >
            <Send className="w-4 h-4 mr-2" />
            COMPOSER
          </Button>
        </div>

        <div className="mt-6 p-3 bg-gray-900/50 border border-green-500/30 rounded">
          <div className="text-green-400 font-mono text-xs font-bold mb-2">VOTRE ADRESSE</div>
          <div className="text-green-300 font-mono text-xs break-all">{userEmail}</div>
          <div className="flex items-center gap-1 mt-2">
            <Shield className="w-3 h-3 text-green-400" />
            <span className="text-green-400 text-xs">Chiffrement TOR</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Email List */}
        <div className="w-96 border-r border-green-500/30 overflow-y-auto">
          <div className="p-4 border-b border-green-500/30">
            <h2 className="font-mono font-bold">
              {currentView === "inbox" ? "BOÎTE DE RÉCEPTION" : "MESSAGES ENVOYÉS"}
            </h2>
          </div>

          <div className="divide-y divide-green-500/30">
            {filteredEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className={`p-4 cursor-pointer hover:bg-green-500/10 transition-colors ${
                  selectedEmail?.id === email.id ? "bg-green-500/20" : ""
                } ${!email.read ? "bg-green-900/20" : ""}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getEmailTypeIcon(email)}
                    <span className="font-mono text-sm font-bold">
                      {currentView === "inbox" ? email.from : email.to}
                    </span>
                    {email.encrypted && <Shield className="w-3 h-3 text-yellow-400" />}
                  </div>
                  <div className="text-xs text-green-300/70 font-mono">{email.timestamp.toLocaleTimeString()}</div>
                </div>
                <div className={`font-mono text-sm mb-1 ${!email.read ? "font-bold" : ""}`}>{email.subject}</div>
                <div className="text-green-300/70 text-xs font-mono truncate">{email.content.substring(0, 100)}...</div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Content */}
        <div className="flex-1 overflow-y-auto">
          {selectedEmail ? (
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-mono font-bold">{selectedEmail.subject}</h2>
                  <div className="flex items-center gap-2">
                    {selectedEmail.encrypted && (
                      <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30">
                        <Shield className="w-3 h-3 mr-1" />
                        CHIFFRÉ
                      </Badge>
                    )}
                    {selectedEmail.starred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                  </div>
                </div>

                <div className="text-green-300/70 font-mono text-sm space-y-1">
                  <div>
                    <strong>De :</strong> {selectedEmail.from}
                  </div>
                  <div>
                    <strong>À :</strong> {selectedEmail.to}
                  </div>
                  <div>
                    <strong>Date :</strong> {selectedEmail.timestamp.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 border border-green-500/30 rounded p-4">
                <div className="text-green-400 font-mono text-sm whitespace-pre-wrap">{selectedEmail.content}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-green-300/50">
                <Mail className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <div className="font-mono">Sélectionnez un email pour le lire</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
