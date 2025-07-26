"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Banknote, TrendingUp, TrendingDown, Shield, Eye, EyeOff, History } from "lucide-react"

interface Transaction {
  id: string
  type: "credit" | "debit"
  amount: number
  description: string
  from: string
  timestamp: Date
  mission_id?: string
  status: "completed" | "pending" | "failed"
}

export default function BankApp() {
  const [balance, setBalance] = useState(47500)
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month" | "all">("week")

  useEffect(() => {
    // Charger les transactions de démonstration
    const demoTransactions: Transaction[] = [
      {
        id: "1",
        type: "credit",
        amount: 15000,
        description: "Mission Ransomware - TechCorp",
        from: "Mission Control",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        mission_id: "MISSION_001",
        status: "completed",
      },
      {
        id: "2",
        type: "credit",
        amount: 2500,
        description: "Infiltration Base de Données",
        from: "Mission Control",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        mission_id: "MISSION_002",
        status: "completed",
      },
      {
        id: "3",
        type: "debit",
        amount: 3200,
        description: "Achat Network Scanner Elite",
        from: "HackShop",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        status: "completed",
      },
      {
        id: "4",
        type: "credit",
        amount: 5000,
        description: "Attaque DDoS Coordonnée",
        from: "Mission Control",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        mission_id: "MISSION_003",
        status: "completed",
      },
      {
        id: "5",
        type: "debit",
        amount: 2500,
        description: "Achat BruteCracker Pro",
        from: "HackShop",
        timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000),
        status: "completed",
      },
      {
        id: "6",
        type: "credit",
        amount: 1000,
        description: "Ingénierie Sociale - PhishCorp",
        from: "Mission Control",
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        mission_id: "MISSION_004",
        status: "completed",
      },
      {
        id: "7",
        type: "credit",
        amount: 25000,
        description: "Paiement Ransomware Bitcoin",
        from: "Crypto Exchange",
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
        status: "completed",
      },
      {
        id: "8",
        type: "debit",
        amount: 1800,
        description: "Achat SQL Injection Kit",
        from: "HackShop",
        timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000),
        status: "completed",
      },
    ]

    setTransactions(demoTransactions)
  }, [])

  const getFilteredTransactions = () => {
    const now = new Date()
    return transactions.filter((transaction) => {
      switch (selectedPeriod) {
        case "today":
          return transaction.timestamp.toDateString() === now.toDateString()
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return transaction.timestamp >= weekAgo
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          return transaction.timestamp >= monthAgo
        default:
          return true
      }
    })
  }

  const getTotalIncome = () => {
    return getFilteredTransactions()
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const getTotalExpenses = () => {
    return getFilteredTransactions()
      .filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.description.includes("Mission") || transaction.description.includes("Ransomware")) {
      return "🎯"
    }
    if (transaction.description.includes("Achat")) {
      return "🛒"
    }
    if (transaction.description.includes("Bitcoin") || transaction.description.includes("Crypto")) {
      return "₿"
    }
    return transaction.type === "credit" ? "💰" : "💸"
  }

  return (
    <div className="h-full bg-black text-green-400 p-4 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-mono flex items-center gap-2 mb-4">
          <Banknote className="w-6 h-6" />
          CRYPTO BANK ANONYMOUS
        </h1>
        <div className="text-green-300/70 font-mono text-sm">Banque offshore sécurisée pour hackers professionnels</div>
      </div>

      {/* Balance Card */}
      <Card className="mb-6 bg-gray-900/50 border-green-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-green-400 font-mono">SOLDE PRINCIPAL</CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
              className="text-green-400 hover:bg-green-500/20"
            >
              {isBalanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold font-mono text-green-400">
                {isBalanceVisible ? `${balance.toLocaleString()} CRÉDITS` : "••••••••"}
              </div>
              <div className="text-green-300/70 font-mono text-sm">
                ≈ ${isBalanceVisible ? (balance * 0.1).toLocaleString() : "••••••"} USD
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              <Badge className="bg-green-600/20 text-green-400 border-green-500/30">SÉCURISÉ</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-900/20 rounded border border-green-500/30">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="font-mono text-sm">REVENUS</span>
              </div>
              <div className="font-mono font-bold text-green-400">+{getTotalIncome().toLocaleString()}</div>
            </div>
            <div className="text-center p-3 bg-red-900/20 rounded border border-red-500/30">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingDown className="w-4 h-4 text-red-400" />
                <span className="font-mono text-sm">DÉPENSES</span>
              </div>
              <div className="font-mono font-bold text-red-400">-{getTotalExpenses().toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Period Filter */}
      <div className="mb-6">
        <div className="flex gap-2">
          {[
            { id: "today", name: "Aujourd'hui" },
            { id: "week", name: "7 jours" },
            { id: "month", name: "30 jours" },
            { id: "all", name: "Tout" },
          ].map((period) => (
            <Button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id as any)}
              variant={selectedPeriod === period.id ? "default" : "outline"}
              className={`font-mono text-sm ${
                selectedPeriod === period.id
                  ? "bg-green-600 text-black"
                  : "border-green-500/30 text-green-400 hover:bg-green-500/20"
              }`}
            >
              {period.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <Card className="bg-gray-900/50 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 font-mono flex items-center gap-2">
            <History className="w-5 h-5" />
            HISTORIQUE DES TRANSACTIONS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getFilteredTransactions().map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-black/30 rounded border border-green-500/20 hover:border-green-500/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getTransactionIcon(transaction)}</div>
                  <div>
                    <div className="font-mono text-sm font-bold text-green-400">{transaction.description}</div>
                    <div className="font-mono text-xs text-green-300/70">
                      {transaction.from} • {transaction.timestamp.toLocaleString()}
                    </div>
                    {transaction.mission_id && (
                      <Badge className="mt-1 bg-blue-600/20 text-blue-400 border-blue-500/30 text-xs">
                        {transaction.mission_id}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-mono font-bold ${
                      transaction.type === "credit" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {transaction.type === "credit" ? "+" : "-"}
                    {transaction.amount.toLocaleString()}
                  </div>
                  <Badge
                    className={`text-xs ${
                      transaction.status === "completed"
                        ? "bg-green-600/20 text-green-400 border-green-500/30"
                        : transaction.status === "pending"
                          ? "bg-yellow-600/20 text-yellow-400 border-yellow-500/30"
                          : "bg-red-600/20 text-red-400 border-red-500/30"
                    }`}
                  >
                    {transaction.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {getFilteredTransactions().length === 0 && (
            <div className="text-center py-8">
              <History className="w-16 h-16 text-green-400/30 mx-auto mb-4" />
              <div className="text-green-400/70 font-mono">Aucune transaction pour cette période</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
