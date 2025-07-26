"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Terminal,
  Target,
  ShoppingCart,
  FileText,
  User,
  Settings,
  Shield,
  Database,
  Key,
  Wifi,
  Code,
  Zap,
} from "lucide-react"

interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
  onAppOpen: (appType: string) => void
  installedTools: string[]
  userProfile: any
}

export default function StartMenu({ isOpen, onClose, onAppOpen, installedTools, userProfile }: StartMenuProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")

  if (!isOpen) return null

  const toolCategories = {
    password: {
      name: "Password Cracking",
      icon: <Key className="w-4 h-4" />,
      tools: installedTools.filter(
        (tool) => tool.includes("brute") || tool.includes("crack") || tool.includes("hydra"),
      ),
    },
    database: {
      name: "Database Exploitation",
      icon: <Database className="w-4 h-4" />,
      tools: installedTools.filter((tool) => tool.includes("sql") || tool.includes("injection") || tool.includes("db")),
    },
    network: {
      name: "Network Tools",
      icon: <Wifi className="w-4 h-4" />,
      tools: installedTools.filter(
        (tool) => tool.includes("nmap") || tool.includes("scan") || tool.includes("network"),
      ),
    },
    exploit: {
      name: "Exploit Frameworks",
      icon: <Zap className="w-4 h-4" />,
      tools: installedTools.filter(
        (tool) => tool.includes("exploit") || tool.includes("payload") || tool.includes("metasploit"),
      ),
    },
    stealth: {
      name: "Stealth & Anonymity",
      icon: <Shield className="w-4 h-4" />,
      tools: installedTools.filter(
        (tool) => tool.includes("stealth") || tool.includes("vpn") || tool.includes("proxy"),
      ),
    },
  }

  const systemApps = [
    { id: "terminal", name: "Terminal", icon: <Terminal className="w-4 h-4" /> },
    { id: "missions", name: "Missions", icon: <Target className="w-4 h-4" /> },
    { id: "shop", name: "Shop", icon: <ShoppingCart className="w-4 h-4" /> },
    { id: "notes", name: "Notes", icon: <FileText className="w-4 h-4" /> },
    { id: "profile", name: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "settings", name: "Settings", icon: <Settings className="w-4 h-4" /> },
  ]

  const handleToolLaunch = (toolName: string) => {
    onAppOpen("terminal")
    onClose()
    // Could add specific tool initialization here
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose}>
      <div
        className="absolute bottom-12 left-4 w-96 bg-gray-900/95 border border-green-500/30 rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-black" />
            </div>
            <div>
              <div className="text-green-400 font-mono font-bold">{userProfile?.hacker_id || "HACKER"}</div>
              <div className="text-green-300/70 text-xs font-mono">Level {userProfile?.level || 1}</div>
            </div>
          </div>

          <div className="space-y-4">
            {/* System Applications */}
            <div>
              <div className="text-green-400 font-mono text-sm font-bold mb-2">SYSTEM</div>
              <div className="grid grid-cols-2 gap-2">
                {systemApps.map((app) => (
                  <Button
                    key={app.id}
                    variant="ghost"
                    onClick={() => {
                      onAppOpen(app.id)
                      onClose()
                    }}
                    className="justify-start text-green-400 hover:bg-green-500/20 font-mono"
                  >
                    {app.icon}
                    <span className="ml-2 text-xs">{app.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Hacking Tools */}
            <div>
              <div className="text-green-400 font-mono text-sm font-bold mb-2">HACKING TOOLS</div>
              {Object.entries(toolCategories).map(
                ([key, category]) =>
                  category.tools.length > 0 && (
                    <div key={key} className="mb-3">
                      <div className="flex items-center gap-2 text-green-300/80 text-xs font-mono mb-1">
                        {category.icon}
                        <span>{category.name}</span>
                        <Badge variant="outline" className="text-xs border-green-500/30 text-green-400">
                          {category.tools.length}
                        </Badge>
                      </div>
                      <div className="grid gap-1">
                        {category.tools.slice(0, 3).map((tool) => (
                          <Button
                            key={tool}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToolLaunch(tool)}
                            className="justify-start text-green-400 hover:bg-green-500/20 font-mono text-xs h-6"
                          >
                            <Code className="w-3 h-3 mr-2" />
                            {tool.replace(/-/g, " ").toUpperCase()}
                          </Button>
                        ))}
                        {category.tools.length > 3 && (
                          <div className="text-green-300/50 text-xs font-mono ml-5">
                            +{category.tools.length - 3} more tools...
                          </div>
                        )}
                      </div>
                    </div>
                  ),
              )}

              {installedTools.length === 0 && (
                <div className="text-green-300/50 text-xs font-mono text-center py-4">
                  No tools installed. Visit the Shop to purchase hacking tools.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
