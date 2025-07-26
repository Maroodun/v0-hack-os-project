"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Terminal,
  FileText,
  ShoppingCart,
  User,
  Target,
  Settings,
  MessageCircle,
  Mail,
  Banknote,
  Crown,
  Activity,
  Users,
} from "lucide-react"
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
import RootControlPanel from "@/components/apps/root-control-panel"
import SystemMonitor from "@/components/apps/system-monitor"
import UserManager from "@/components/apps/user-manager"
import StartMenu from "@/components/start-menu"
import RootWidgets from "@/components/root-widgets"

interface RootDesktopProps {
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

export default function RootDesktop({ user }: RootDesktopProps) {
  const [windows, setWindows] = useState<AppWindow[]>([])
  const [nextZIndex, setNextZIndex] = useState(1000)
  const [time, setTime] = useState(new Date())
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [installedTools, setInstalledTools] = useState<string[]>([
    "brutecracker-pro",
    "sql-injection-kit",
    "network-scanner-elite",
    "payload-generator",
    "stealth-mode-upgrade",
    "xss-exploitation-suite",
    "quantum-decryptor",
    "neural-network-cracker",
    "zero-day-exploiter",
    "god-mode-toolkit",
  ])
  const [userProfile, setUserProfile] = useState({
    hacker_id: "root",
    level: 999,
    credits: 999999,
    rank: "System Creator",
  })

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const openApp = (appType: string) => {
    const existingWindow = windows.find((w) => w.id === appType)
    if (existingWindow) {
      focusWindow(appType)
      return
    }

    const apps = {
      terminal: {
        title: "Root Terminal",
        icon: <Terminal className="w-4 h-4" />,
        component: <TerminalApp userProfile={userProfile} installedTools={installedTools} onToolInstall={() => {}} />,
      },
      missions: {
        title: "Mission Control",
        icon: <Target className="w-4 h-4" />,
        component: <MissionsApp />,
      },
      shop: {
        title: "Dev Shop",
        icon: <ShoppingCart className="w-4 h-4" />,
        component: <ShopApp onPurchase={(item) => console.log("Purchased:", item)} />,
      },
      notes: {
        title: "Creator Notes",
        icon: <FileText className="w-4 h-4" />,
        component: <NotesApp user={user} />,
      },
      profile: {
        title: "Root Profile",
        icon: <User className="w-4 h-4" />,
        component: <ProfileApp user={user} />,
      },
      settings: {
        title: "System Config",
        icon: <Settings className="w-4 h-4" />,
        component: <SettingsApp onSettingsChange={() => {}} />,
      },
      chat: {
        title: "Admin Chat",
        icon: <MessageCircle className="w-4 h-4" />,
        component: <ChatApp user={user} />,
      },
      mail: {
        title: "Root Mail",
        icon: <Mail className="w-4 h-4" />,
        component: <MailApp />,
      },
      bank: {
        title: "System Bank",
        icon: <Banknote className="w-4 h-4" />,
        component: <BankApp />,
      },
      // Root-specific apps
      control: {
        title: "Control Panel",
        icon: <Crown className="w-4 h-4" />,
        component: <RootControlPanel />,
      },
      monitor: {
        title: "System Monitor",
        icon: <Activity className="w-4 h-4" />,
        component: <SystemMonitor />,
      },
      users: {
        title: "User Manager",
        icon: <Users className="w-4 h-4" />,
        component: <UserManager />,
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

  // Réorganisation des icônes du desktop - Root Profile déplacé plus haut

  return (
    <div className="desktop-content min-h-screen bg-black relative overflow-hidden crt-screen">
      <div className="static-noise"></div>

      {/* Root-specific background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #dc2626 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, #fbbf24 1px, transparent 1px),
              linear-gradient(45deg, transparent 40%, rgba(220, 38, 38, 0.1) 50%, transparent 60%)
            `,
            backgroundSize: "60px 60px, 60px 60px, 120px 120px",
          }}
        />
      </div>

      {/* Root color overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(ellipse at center, #dc262620 0%, #fbbf2420 50%, transparent 70%)`,
        }}
      />

      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 pb-16">
        {/* Première ligne - Control Panel et Root Profile côte à côte */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <button
            onDoubleClick={() => openApp("control")}
            className="flex flex-col items-center gap-2 p-2 rounded hover:bg-red-500/10 transition-colors group"
          >
            <div className="text-red-400 group-hover:text-red-300 transition-colors phosphor-glow">
              <Crown className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono text-red-400 group-hover:text-red-300 phosphor-glow">Control Panel</span>
          </button>

          <button
            onDoubleClick={() => openApp("profile")}
            className="flex flex-col items-center gap-2 p-2 rounded hover:bg-red-500/10 transition-colors group"
          >
            <div className="text-red-400 group-hover:text-red-300 transition-colors phosphor-glow">
              <User className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono text-red-400 group-hover:text-red-300 phosphor-glow">Root Profile</span>
          </button>
        </div>

        {/* Reste des icônes en colonne simple */}
        <div className="grid gap-6">
          {[
            { id: "monitor", icon: <Activity className="w-8 h-8" />, label: "System Monitor" },
            { id: "users", icon: <Users className="w-8 h-8" />, label: "User Manager" },
            { id: "terminal", icon: <Terminal className="w-8 h-8" />, label: "Root Terminal" },
            { id: "missions", icon: <Target className="w-8 h-8" />, label: "Mission Control" },
            { id: "shop", icon: <ShoppingCart className="w-8 h-8" />, label: "Dev Shop" },
            { id: "notes", icon: <FileText className="w-8 h-8" />, label: "Creator Notes" },
            { id: "settings", icon: <Settings className="w-8 h-8" />, label: "System Config" },
          ].map((icon) => (
            <button
              key={icon.id}
              onDoubleClick={() => openApp(icon.id)}
              className="flex flex-col items-center gap-2 p-2 rounded hover:bg-red-500/10 transition-colors group"
            >
              <div className="text-red-400 group-hover:text-red-300 transition-colors phosphor-glow">{icon.icon}</div>
              <span className="text-xs font-mono text-red-400 group-hover:text-red-300 phosphor-glow">
                {icon.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Root Widgets */}
      <RootWidgets />

      {/* Root System Info */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 font-mono text-sm text-center phosphor-glow text-red-400">
        <div className="glitch-text flex items-center justify-center gap-2 mb-2">
          <Crown className="w-5 h-5 text-yellow-400" />
          <span>HACKSIM OS v2.1.0 - ROOT ACCESS</span>
          <Crown className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="text-yellow-400">{time.toLocaleTimeString()}</div>
        <div className="text-red-300">SYSTEM CREATOR: {user?.hacker_id}</div>
        <div className="text-xs text-red-300/70 mt-1">UNLIMITED PRIVILEGES ENABLED</div>
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

      {/* Root Taskbar */}
      <div className="taskbar-bottom h-12 bg-gradient-to-r from-red-900/90 via-gray-900/90 to-yellow-900/90 border-t border-red-500/30 backdrop-blur-sm flex items-center px-4 gap-2 crt-screen">
        {/* Root Start Button */}
        <button
          onClick={() => setShowStartMenu(!showStartMenu)}
          className="bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-500 hover:to-yellow-500 text-black font-mono font-bold px-3 py-1 rounded retro-button flex items-center gap-2"
        >
          <Crown className="w-4 h-4" />
          ROOT
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-red-500/30 mx-2" />

        {/* Root Quick Launch */}
        <div className="flex items-center gap-1">
          {[
            { id: "control", icon: <Crown className="w-4 h-4" /> },
            { id: "profile", icon: <User className="w-4 h-4" /> },
            { id: "monitor", icon: <Activity className="w-4 h-4" /> },
            { id: "users", icon: <Users className="w-4 h-4" /> },
            { id: "terminal", icon: <Terminal className="w-4 h-4" /> },
          ].map((app) => (
            <button
              key={app.id}
              onClick={() => openApp(app.id)}
              className="w-8 h-8 p-0 text-red-400 hover:bg-red-500/20 rounded phosphor-glow flex items-center justify-center"
            >
              {app.icon}
            </button>
          ))}
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-red-500/30 mx-2" />

        {/* Open Windows */}
        <div className="flex items-center gap-1 flex-1">
          {windows.map((window) => (
            <button
              key={window.id}
              onClick={() => focusWindow(window.id)}
              className={`flex items-center gap-2 px-3 h-8 text-red-400 hover:bg-red-500/20 retro-button rounded ${
                !window.isMinimized ? "bg-red-500/10" : ""
              }`}
            >
              {window.icon}
              <span className="text-xs font-mono">{window.title}</span>
            </button>
          ))}
        </div>

        {/* Root System Tray */}
        <div className="flex items-center gap-2 text-red-400 font-mono text-xs phosphor-glow">
          <Crown className="w-4 h-4 text-yellow-400 animate-pulse" />
          <div className="text-yellow-400">ROOT</div>
          <div className="text-xs opacity-70">{time.toLocaleTimeString()}</div>
        </div>
      </div>
    </div>
  )
}
