"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Terminal, FileText, ShoppingCart, User, Target, Settings, MessageCircle, Mail, Banknote } from "lucide-react"
import Window from "@/components/window"
import TerminalApp from "@/components/apps/terminal-app"
import MissionsApp from "@/components/apps/missions-app"
import ShopApp from "@/components/apps/shop-app"
import NotesApp from "@/components/apps/notes-app"
import ProfileApp from "@/components/apps/profile-app"
import SettingsApp from "@/components/settings-app"
import ChatApp from "@/components/apps/chat-app"
import MailApp from "@/components/apps/mail-app"
import BankApp from "@/components/apps/bank-app"
import Taskbar from "@/components/taskbar"
import StartMenu from "@/components/start-menu"
import DesktopWidgets from "@/components/desktop-widgets"
import { DatabaseManager } from "@/lib/database"

interface DesktopProps {
  user: any
}

interface AppWindow {
  id: string
  title: string
  icon: React.ReactNode
  component: React.ReactNode
  isMinimized: boolean
  zIndex: number
}

export default function Desktop({ user }: DesktopProps) {
  const [windows, setWindows] = useState<AppWindow[]>([])
  const [nextZIndex, setNextZIndex] = useState(1000)
  const [time, setTime] = useState(new Date())
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [installedTools, setInstalledTools] = useState<string[]>([])
  const [userProfile, setUserProfile] = useState({
    hacker_id: "H4CK3R#1337",
    level: 1,
    credits: 5000,
  })
  const [settings, setSettings] = useState({
    theme: "matrix",
    wallpaper: "default",
    customWallpaperUrl: "",
    terminalOpacity: 95,
    soundEnabled: true,
    colorPreset: "green",
  })
  const [dbManager, setDbManager] = useState<DatabaseManager | null>(null)
  const [gameSessionId, setGameSessionId] = useState<string | null>(null)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (user?.id) {
      const manager = new DatabaseManager(user.id)
      setDbManager(manager)
      initializePlayerData(manager)
      startGameSession(manager)
    } else {
      // Load settings from localStorage for demo mode
      const savedSettings = localStorage.getItem("hacksim-settings")
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    }

    // Cleanup on unmount
    return () => {
      if (dbManager && gameSessionId) {
        endGameSession()
      }
    }
  }, [user])

  const initializePlayerData = async (manager: DatabaseManager) => {
    try {
      // Load player settings
      const playerSettings = await manager.loadPlayerData("settings", "main")
      if (playerSettings) {
        setSettings(playerSettings)
      }

      // Load installed tools
      const inventory = await manager.loadInventory()
      const tools = inventory.filter((item: any) => item.type === "tool").map((item: any) => item.id)
      setInstalledTools(tools)

      // Load user profile data
      const profileData = await manager.loadPlayerData("profile", "main")
      if (profileData) {
        setUserProfile(profileData)
      }
    } catch (error) {
      console.error("Error initializing player data:", error)
    }
  }

  const startGameSession = async (manager: DatabaseManager) => {
    try {
      const sessionId = await manager.startGameSession()
      setGameSessionId(sessionId)
    } catch (error) {
      console.error("Error starting game session:", error)
    }
  }

  const endGameSession = async () => {
    if (dbManager && gameSessionId) {
      try {
        const sessionStats = {
          playtime: Math.floor((Date.now() - Date.now()) / 1000), // This would be calculated properly
          missionsCompleted: userProfile.level - 1, // Example calculation
          creditsEarned: userProfile.credits - 5000, // Example calculation
        }
        await dbManager.endGameSession(gameSessionId, sessionStats)
      } catch (error) {
        console.error("Error ending game session:", error)
      }
    }
  }

  const saveSettings = async (newSettings: any) => {
    setSettings(newSettings)
    if (dbManager) {
      try {
        await dbManager.savePlayerData("settings", "main", newSettings)
      } catch (error) {
        console.error("Error saving settings:", error)
      }
    } else {
      localStorage.setItem("hacksim-settings", JSON.stringify(newSettings))
    }
  }

  const handleToolInstall = async (toolName: string) => {
    const updatedTools = [...installedTools, toolName]
    setInstalledTools(updatedTools)

    if (dbManager) {
      try {
        await dbManager.saveInventoryItem(toolName, {
          name: toolName,
          type: "tool",
          quantity: 1,
          purchasedAt: new Date().toISOString(),
        })
      } catch (error) {
        console.error("Error saving tool:", error)
      }
    }
  }

  const openApp = (appType: string) => {
    const existingWindow = windows.find((w) => w.id === appType)
    if (existingWindow) {
      focusWindow(appType)
      return
    }

    const apps = {
      terminal: {
        title: "Terminal",
        icon: <Terminal className="w-4 h-4" />,
        component: (
          <TerminalApp userProfile={userProfile} installedTools={installedTools} onToolInstall={handleToolInstall} />
        ),
      },
      missions: {
        title: "Missions",
        icon: <Target className="w-4 h-4" />,
        component: <MissionsApp />,
      },
      shop: {
        title: "Magasin",
        icon: <ShoppingCart className="w-4 h-4" />,
        component: <ShopApp onPurchase={(item) => console.log("Purchased:", item)} />,
      },
      notes: {
        title: "Notes",
        icon: <FileText className="w-4 h-4" />,
        component: <NotesApp user={user} />,
      },
      profile: {
        title: "Profil",
        icon: <User className="w-4 h-4" />,
        component: <ProfileApp user={user} />,
      },
      settings: {
        title: "Paramètres",
        icon: <Settings className="w-4 h-4" />,
        component: <SettingsApp onSettingsChange={saveSettings} />,
      },
      chat: {
        title: "Chat Sécurisé",
        icon: <MessageCircle className="w-4 h-4" />,
        component: <ChatApp user={user} />,
      },
      mail: {
        title: "DarkMail",
        icon: <Mail className="w-4 h-4" />,
        component: <MailApp />,
      },
      bank: {
        title: "Crypto Bank",
        icon: <Banknote className="w-4 h-4" />,
        component: <BankApp />,
      },
    }

    const app = apps[appType as keyof typeof apps]
    if (app) {
      const newWindow: AppWindow = {
        id: appType,
        title: app.title,
        icon: app.icon,
        component: app.component,
        isMinimized: false,
        zIndex: nextZIndex,
      }
      setWindows((prev) => [...prev, newWindow])
      setNextZIndex((prev) => prev + 1)
    }
  }

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
  }

  const minimizeWindow = (id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: !w.isMinimized } : w)))
  }

  const focusWindow = (id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, zIndex: nextZIndex, isMinimized: false } : w)))
    setNextZIndex((prev) => prev + 1)
  }

  const desktopIcons = [
    { id: "terminal", icon: <Terminal className="w-8 h-8" />, label: "Terminal" },
    { id: "missions", icon: <Target className="w-8 h-8" />, label: "Missions" },
    { id: "shop", icon: <ShoppingCart className="w-8 h-8" />, label: "Magasin" },
    { id: "notes", icon: <FileText className="w-8 h-8" />, label: "Notes" },
    { id: "profile", icon: <User className="w-8 h-8" />, label: "Profil" },
    { id: "settings", icon: <Settings className="w-8 h-8" />, label: "Paramètres" },
    { id: "chat", icon: <MessageCircle className="w-8 h-8" />, label: "Chat" },
    { id: "mail", icon: <Mail className="w-8 h-8" />, label: "DarkMail" },
    { id: "bank", icon: <Banknote className="w-8 h-8" />, label: "Banque" },
  ]

  const getWallpaperStyle = () => {
    if (settings.wallpaper === "custom" && settings.customWallpaperUrl) {
      return {
        backgroundImage: `url(${settings.customWallpaperUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    }

    switch (settings.wallpaper) {
      case "circuit":
        return {
          backgroundImage: `radial-gradient(circle at 25% 25%, #10b981 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, #10b981 1px, transparent 1px),
                           linear-gradient(45deg, transparent 40%, rgba(16, 185, 129, 0.1) 50%, transparent 60%)`,
          backgroundSize: "50px 50px, 50px 50px, 100px 100px",
        }
      case "code":
        return {
          backgroundImage: `linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                           linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }
      case "cyber":
        return {
          backgroundImage: `radial-gradient(ellipse at top, rgba(16, 185, 129, 0.2) 0%, transparent 50%),
                           radial-gradient(ellipse at bottom, rgba(16, 185, 129, 0.1) 0%, transparent 50%)`,
        }
      default:
        return {
          backgroundImage: `radial-gradient(ellipse at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%)`,
        }
    }
  }

  const getColorPreset = () => {
    const presets = {
      green: { primary: "#10b981", secondary: "#065f46" },
      blue: { primary: "#3b82f6", secondary: "#1e40af" },
      purple: { primary: "#8b5cf6", secondary: "#6d28d9" },
      red: { primary: "#ef4444", secondary: "#dc2626" },
      orange: { primary: "#f97316", secondary: "#ea580c" },
      yellow: { primary: "#eab308", secondary: "#ca8a04" },
      pink: { primary: "#ec4899", secondary: "#db2777" },
      cyan: { primary: "#06b6d4", secondary: "#0891b2" },
    }
    return presets[settings.colorPreset as keyof typeof presets] || presets.green
  }

  const colorPreset = getColorPreset()

  return (
    <div className="desktop-content min-h-screen bg-black relative overflow-hidden crt-screen">
      <div className="static-noise"></div>

      {/* Wallpaper */}
      <div className="absolute inset-0 opacity-20" style={getWallpaperStyle()}></div>

      {/* Color overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background: `radial-gradient(ellipse at center, ${colorPreset.primary}20 0%, transparent 70%)`,
        }}
      ></div>

      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 grid gap-6 pb-16">
        {desktopIcons.map((icon) => (
          <button
            key={icon.id}
            onDoubleClick={() => openApp(icon.id)}
            className="flex flex-col items-center gap-2 p-2 rounded hover:bg-green-500/10 transition-colors group"
          >
            <div
              className="group-hover:text-green-300 transition-colors phosphor-glow"
              style={{ color: colorPreset.primary }}
            >
              {icon.icon}
            </div>
            <span
              className="text-xs font-mono group-hover:text-green-300 phosphor-glow"
              style={{ color: colorPreset.primary }}
            >
              {icon.label}
            </span>
          </button>
        ))}
      </div>

      {/* Desktop Widgets */}
      <DesktopWidgets />

      {/* System Info */}
      <div
        className="absolute top-4 left-1/2 transform -translate-x-1/2 font-mono text-sm text-center phosphor-glow"
        style={{ color: colorPreset.primary }}
      >
        <div className="glitch-text">HACKSIM OS v2.1.0</div>
        <div>{time.toLocaleTimeString()}</div>
        <div>UTILISATEUR: {user?.email}</div>
      </div>

      {/* Windows */}
      {windows.map((window) => (
        <Window
          key={window.id}
          id={window.id}
          title={window.title}
          icon={window.icon}
          isMinimized={window.isMinimized}
          zIndex={window.zIndex}
          onClose={() => closeWindow(window.id)}
          onMinimize={() => minimizeWindow(window.id)}
          onFocus={() => focusWindow(window.id)}
        >
          {window.component}
        </Window>
      ))}

      {/* Start Menu */}
      <StartMenu
        isOpen={showStartMenu}
        onClose={() => setShowStartMenu(false)}
        onAppOpen={openApp}
        installedTools={installedTools}
        userProfile={userProfile}
      />

      {/* Taskbar - Always at bottom */}
      <Taskbar
        windows={windows}
        onWindowClick={focusWindow}
        onAppOpen={openApp}
        onStartMenuToggle={() => setShowStartMenu(!showStartMenu)}
      />
    </div>
  )
}
