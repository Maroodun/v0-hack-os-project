"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, DollarSign, Download, Zap, Shield, Code } from "lucide-react"

interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  category: "Tools" | "Exploits" | "Upgrades" | "Scripts"
  icon: React.ReactNode
  owned: boolean
  version?: string
}

export default function ShopApp() {
  const [credits, setCredits] = useState(5000)
  const [items, setItems] = useState<ShopItem[]>([
    {
      id: "1",
      name: "BruteCracker Pro",
      description: "Advanced password cracking tool with GPU acceleration and rainbow tables.",
      price: 2500,
      category: "Tools",
      icon: <Shield className="w-6 h-6" />,
      owned: false,
      version: "v3.2.1",
    },
    {
      id: "2",
      name: "SQL Injection Kit",
      description: "Complete toolkit for SQL injection attacks with automated payload generation.",
      price: 1800,
      category: "Exploits",
      icon: <Code className="w-6 h-6" />,
      owned: false,
      version: "v2.1.0",
    },
    {
      id: "3",
      name: "Network Scanner Elite",
      description: "Professional network scanning with stealth mode and vulnerability detection.",
      price: 3200,
      category: "Tools",
      icon: <Zap className="w-6 h-6" />,
      owned: false,
      version: "v4.0.2",
    },
    {
      id: "4",
      name: "Payload Generator",
      description: "Generate custom payloads for various exploit frameworks and platforms.",
      price: 1500,
      category: "Scripts",
      icon: <Download className="w-6 h-6" />,
      owned: false,
      version: "v1.8.3",
    },
    {
      id: "5",
      name: "Stealth Mode Upgrade",
      description: "Reduces detection probability by 75% during all hacking operations.",
      price: 5000,
      category: "Upgrades",
      icon: <Shield className="w-6 h-6" />,
      owned: false,
    },
    {
      id: "6",
      name: "XSS Exploitation Suite",
      description: "Complete cross-site scripting toolkit with automated payload injection.",
      price: 2200,
      category: "Exploits",
      icon: <Code className="w-6 h-6" />,
      owned: false,
      version: "v2.5.1",
    },
  ])

  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const categories = ["All", "Tools", "Exploits", "Upgrades", "Scripts"]

  const purchaseItem = (itemId: string) => {
    const item = items.find((i) => i.id === itemId)
    if (item && credits >= item.price && !item.owned) {
      setCredits((prev) => prev - item.price)
      setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, owned: true } : i)))
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Tools":
        return "bg-blue-500"
      case "Exploits":
        return "bg-red-500"
      case "Upgrades":
        return "bg-purple-500"
      case "Scripts":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const filteredItems = selectedCategory === "All" ? items : items.filter((item) => item.category === selectedCategory)

  return (
    <div className="h-full bg-black text-green-400 p-4 overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold font-mono flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            HACKER MARKETPLACE
          </h1>
          <div className="flex items-center gap-2 bg-green-900/30 px-4 py-2 rounded border border-green-500/30">
            <DollarSign className="w-4 h-4" />
            <span className="font-mono font-bold">{credits.toLocaleString()} CREDITS</span>
          </div>
        </div>
        <div className="text-green-300/70 font-mono text-sm mb-4">
          Purchase advanced tools and exploits to enhance your hacking capabilities.
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`font-mono text-sm ${
                selectedCategory === category
                  ? "bg-green-600 text-black"
                  : "border-green-500/30 text-green-400 hover:bg-green-500/20"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredItems.map((item) => (
          <Card key={item.id} className="bg-gray-900/50 border-green-500/30">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-green-400">{item.icon}</div>
                  <div>
                    <CardTitle className="text-green-400 font-mono text-lg">
                      {item.name}
                      {item.version && <span className="text-green-300/70 text-sm ml-2">{item.version}</span>}
                    </CardTitle>
                    <Badge className={`${getCategoryColor(item.category)} text-black font-mono text-xs mt-1`}>
                      {item.category}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-400 font-mono">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-bold">{item.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-green-300/80 font-mono text-sm mb-4">{item.description}</p>

              <div className="flex items-center justify-between">
                <div className="font-mono text-sm">
                  {item.owned ? (
                    <span className="text-blue-400">OWNED</span>
                  ) : credits >= item.price ? (
                    <span className="text-green-400">AVAILABLE</span>
                  ) : (
                    <span className="text-red-400">INSUFFICIENT CREDITS</span>
                  )}
                </div>
                <Button
                  onClick={() => purchaseItem(item.id)}
                  disabled={item.owned || credits < item.price}
                  className="bg-green-600 hover:bg-green-500 text-black font-mono font-bold disabled:bg-gray-600 disabled:text-gray-400"
                >
                  {item.owned ? "OWNED" : "PURCHASE"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
