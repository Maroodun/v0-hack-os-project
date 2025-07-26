"use client"

import {
  Terminal,
  Target,
  ShoppingCart,
  FileText,
  User,
  Settings,
  Menu,
  MessageCircle,
  Mail,
  Banknote,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface TaskbarProps {
  windows: any[]
  onWindowClick: (id: string) => void
  onAppOpen: (appType: string) => void
  onStartMenuToggle: () => void
}

export default function Taskbar({ windows, onWindowClick, onAppOpen, onStartMenuToggle }: TaskbarProps) {
  const quickLaunchApps = [
    { id: "terminal", icon: <Terminal className="w-4 h-4" /> },
    { id: "missions", icon: <Target className="w-4 h-4" /> },
    { id: "shop", icon: <ShoppingCart className="w-4 h-4" /> },
    { id: "notes", icon: <FileText className="w-4 h-4" /> },
    { id: "profile", icon: <User className="w-4 h-4" /> },
    { id: "settings", icon: <Settings className="w-4 h-4" /> },
    { id: "chat", icon: <MessageCircle className="w-4 h-4" /> },
    { id: "mail", icon: <Mail className="w-4 h-4" /> },
    { id: "bank", icon: <Banknote className="w-4 h-4" /> },
  ]

  return (
    <div className="taskbar-bottom h-12 bg-gray-900/90 border-t border-green-500/30 backdrop-blur-sm flex items-center px-4 gap-2 crt-screen">
      {/* Start Button */}
      <Button
        onClick={onStartMenuToggle}
        className="bg-green-600 hover:bg-green-500 text-black font-mono font-bold px-3 retro-button"
      >
        <Menu className="w-4 h-4 mr-2" />
        START
      </Button>

      {/* Separator */}
      <div className="w-px h-6 bg-green-500/30 mx-2" />

      {/* Quick Launch */}
      <div className="flex items-center gap-1">
        {quickLaunchApps.map((app) => (
          <Button
            key={app.id}
            size="sm"
            variant="ghost"
            onClick={() => onAppOpen(app.id)}
            className="w-8 h-8 p-0 text-green-400 hover:bg-green-500/20 phosphor-glow"
          >
            {app.icon}
          </Button>
        ))}
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-green-500/30 mx-2" />

      {/* Open Windows */}
      <div className="flex items-center gap-1 flex-1">
        {windows.map((window) => (
          <Button
            key={window.id}
            size="sm"
            variant="ghost"
            onClick={() => onWindowClick(window.id)}
            className={`flex items-center gap-2 px-3 h-8 text-green-400 hover:bg-green-500/20 retro-button ${
              !window.isMinimized ? "bg-green-500/10" : ""
            }`}
          >
            {window.icon}
            <span className="text-xs font-mono">{window.title}</span>
          </Button>
        ))}
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-2 text-green-400 font-mono text-xs phosphor-glow">
        <div className="animate-pulse">●</div>
        <div>ONLINE</div>
        <div className="text-xs opacity-70">{new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  )
}
