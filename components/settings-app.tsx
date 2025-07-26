"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Settings, Palette, Monitor, Volume2 } from "lucide-react"

interface SettingsAppProps {
  onSettingsChange: (settings: any) => void
}

export default function SettingsApp({ onSettingsChange }: SettingsAppProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [settings, setSettings] = useState({
    theme: "matrix",
    wallpaper: "default",
    customWallpaperUrl: "",
    terminalOpacity: 95,
    soundEnabled: true,
    keyboardSounds: true,
    animationsEnabled: true,
    fontSize: 14,
    colorPreset: "green",
  })

  const colorPresets = [
    { id: "green", name: "Matrix Green", primary: "#10b981", secondary: "#065f46" },
    { id: "blue", name: "Cyber Blue", primary: "#3b82f6", secondary: "#1e40af" },
    { id: "purple", name: "Neon Purple", primary: "#8b5cf6", secondary: "#6d28d9" },
    { id: "red", name: "Danger Red", primary: "#ef4444", secondary: "#dc2626" },
    { id: "orange", name: "Hacker Orange", primary: "#f97316", secondary: "#ea580c" },
    { id: "yellow", name: "Warning Yellow", primary: "#eab308", secondary: "#ca8a04" },
    { id: "pink", name: "Neon Pink", primary: "#ec4899", secondary: "#db2777" },
    { id: "cyan", name: "Electric Cyan", primary: "#06b6d4", secondary: "#0891b2" },
    { id: "lime", name: "Toxic Lime", primary: "#84cc16", secondary: "#65a30d" },
    { id: "indigo", name: "Deep Indigo", primary: "#6366f1", secondary: "#4f46e5" },
    { id: "teal", name: "Cyber Teal", primary: "#14b8a6", secondary: "#0f766e" },
    { id: "emerald", name: "Emerald Hack", primary: "#10b981", secondary: "#047857" },
    { id: "rose", name: "Rose Gold", primary: "#f43f5e", secondary: "#e11d48" },
    { id: "violet", name: "Violet Storm", primary: "#7c3aed", secondary: "#6d28d9" },
    { id: "amber", name: "Amber Alert", primary: "#f59e0b", secondary: "#d97706" },
    { id: "slate", name: "Slate Gray", primary: "#64748b", secondary: "#475569" },
    { id: "zinc", name: "Zinc Metal", primary: "#71717a", secondary: "#52525b" },
    { id: "neutral", name: "Neutral Tone", primary: "#737373", secondary: "#525252" },
    { id: "stone", name: "Stone Cold", primary: "#78716c", secondary: "#57534e" },
    { id: "sky", name: "Sky Blue", primary: "#0ea5e9", secondary: "#0284c7" },
  ]

  const themes = [
    { id: "matrix", name: "Matrix Green" },
    { id: "cyber", name: "Cyber Blue" },
    { id: "neon", name: "Neon Purple" },
    { id: "hacker", name: "Classic Hacker" },
  ]

  const wallpapers = [
    { id: "default", name: "Default Matrix", preview: "🟢" },
    { id: "circuit", name: "Circuit Board", preview: "⚡" },
    { id: "code", name: "Code Rain", preview: "💻" },
    { id: "cyber", name: "Cyberpunk City", preview: "🌃" },
    { id: "custom", name: "Custom Upload", preview: "🖼️" },
  ]

  useEffect(() => {
    const savedSettings = localStorage.getItem("hacksim-settings")
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      setSettings(parsed)
      onSettingsChange(parsed)
    } else {
      // Paramètres par défaut sans taskbarPosition
      const defaultSettings = {
        theme: "matrix",
        wallpaper: "default",
        customWallpaperUrl: "",
        terminalOpacity: 95,
        soundEnabled: true,
        keyboardSounds: true,
        animationsEnabled: true,
        fontSize: 14,
        colorPreset: "green",
      }
      setSettings(defaultSettings)
      onSettingsChange(defaultSettings)
    }
  }, [])

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem("hacksim-settings", JSON.stringify(newSettings))
    onSettingsChange(newSettings)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        updateSetting("customWallpaperUrl", result)
        updateSetting("wallpaper", "custom")
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="h-full bg-black text-green-400 p-4 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-mono flex items-center gap-2 mb-4">
          <Settings className="w-6 h-6" />
          PARAMÈTRES SYSTÈME
        </h1>
        <div className="text-green-300/70 font-mono text-sm">Personnalisez votre expérience HackSim OS</div>
      </div>

      <div className="space-y-6">
        {/* Color Presets */}
        <Card className="bg-gray-900/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 font-mono flex items-center gap-2">
              <Palette className="w-5 h-5" />
              PRESETS DE COULEURS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {colorPresets.map((preset) => (
                <Button
                  key={preset.id}
                  variant={settings.colorPreset === preset.id ? "default" : "outline"}
                  onClick={() => updateSetting("colorPreset", preset.id)}
                  className={`font-mono text-xs h-12 flex flex-col items-center justify-center ${
                    settings.colorPreset === preset.id
                      ? "text-black"
                      : "border-green-500/30 text-green-400 hover:bg-green-500/20"
                  }`}
                  style={{
                    backgroundColor: settings.colorPreset === preset.id ? preset.primary : undefined,
                    borderColor: preset.primary,
                  }}
                >
                  <div className="w-4 h-4 rounded-full mb-1" style={{ backgroundColor: preset.primary }} />
                  <span className="text-xs">{preset.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card className="bg-gray-900/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 font-mono flex items-center gap-2">
              <Palette className="w-5 h-5" />
              APPARENCE
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-green-400 font-mono text-sm">Thème</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {themes.map((theme) => (
                  <Button
                    key={theme.id}
                    variant={settings.theme === theme.id ? "default" : "outline"}
                    onClick={() => updateSetting("theme", theme.id)}
                    className={`font-mono text-xs ${
                      settings.theme === theme.id
                        ? "bg-green-600 text-black"
                        : "border-green-500/30 text-green-400 hover:bg-green-500/20"
                    }`}
                  >
                    {theme.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-green-400 font-mono text-sm">Fond d'écran</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {wallpapers.map((wallpaper) => (
                  <Button
                    key={wallpaper.id}
                    variant={settings.wallpaper === wallpaper.id ? "default" : "outline"}
                    onClick={() => {
                      if (wallpaper.id === "custom") {
                        fileInputRef.current?.click()
                      } else {
                        updateSetting("wallpaper", wallpaper.id)
                      }
                    }}
                    className={`font-mono text-xs ${
                      settings.wallpaper === wallpaper.id
                        ? "bg-green-600 text-black"
                        : "border-green-500/30 text-green-400 hover:bg-green-500/20"
                    }`}
                  >
                    <span className="mr-2">{wallpaper.preview}</span>
                    {wallpaper.name}
                  </Button>
                ))}
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

              {settings.wallpaper === "custom" && settings.customWallpaperUrl && (
                <div className="mt-2 p-2 border border-green-500/30 rounded">
                  <div className="text-xs text-green-400 font-mono">Fond d'écran personnalisé chargé</div>
                </div>
              )}
            </div>

            <div>
              <Label className="text-green-400 font-mono text-sm">Opacité Terminal: {settings.terminalOpacity}%</Label>
              <Slider
                value={[settings.terminalOpacity]}
                onValueChange={(value) => updateSetting("terminalOpacity", value[0])}
                max={100}
                min={50}
                step={5}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-green-400 font-mono text-sm">Taille Police: {settings.fontSize}px</Label>
              <Slider
                value={[settings.fontSize]}
                onValueChange={(value) => updateSetting("fontSize", value[0])}
                max={20}
                min={10}
                step={1}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Audio Settings */}
        <Card className="bg-gray-900/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 font-mono flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              AUDIO
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-green-400 font-mono text-sm">Effets Sonores</Label>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => updateSetting("soundEnabled", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-green-400 font-mono text-sm">Sons Clavier</Label>
              <Switch
                checked={settings.keyboardSounds}
                onCheckedChange={(checked) => updateSetting("keyboardSounds", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="bg-gray-900/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 font-mono flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              SYSTÈME
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-green-400 font-mono text-sm">Animations</Label>
              <Switch
                checked={settings.animationsEnabled}
                onCheckedChange={(checked) => updateSetting("animationsEnabled", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Reset Settings */}
        <Card className="bg-gray-900/50 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400 font-mono">ZONE DANGEREUSE</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                localStorage.removeItem("hacksim-settings")
                window.location.reload()
              }}
              className="bg-red-600 hover:bg-red-500 text-white font-mono font-bold"
            >
              Réinitialiser Tous les Paramètres
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
