"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Crown, Users, Activity, Database, Shield, Zap } from "lucide-react"

export default function RootWidgets() {
  const [systemStats, setSystemStats] = useState({
    totalUsers: 1337,
    activeUsers: 42,
    systemLoad: 15,
    security: 100,
    uptime: "99.9%",
    threats: 0,
  })

  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())

      // Simulate system stats for root
      setSystemStats({
        totalUsers: 1337 + Math.floor(Math.random() * 10),
        activeUsers: 42 + Math.floor(Math.random() * 20),
        systemLoad: Math.floor(Math.random() * 30) + 10,
        security: 100,
        uptime: "99.9%",
        threats: Math.floor(Math.random() * 3),
      })
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="absolute top-4 right-4 space-y-4">
      {/* Root Clock Widget */}
      <Card className="bg-gradient-to-br from-red-900/80 to-yellow-900/80 border-red-500/30 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className="text-red-400 font-mono text-sm font-bold">ROOT ACCESS</span>
          </div>
          <div className="text-red-400 font-mono text-2xl font-bold">{time.toLocaleTimeString()}</div>
          <div className="text-red-300/70 font-mono text-sm">{time.toLocaleDateString()}</div>
        </CardContent>
      </Card>

      {/* System Control Widget */}
      <Card className="bg-gradient-to-br from-red-900/80 to-gray-900/80 border-red-500/30 backdrop-blur-sm">
        <CardContent className="p-4 space-y-3">
          <div className="text-red-400 font-mono text-sm font-bold mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            SYSTEM CONTROL
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-red-400" />
              <span className="font-mono text-xs">Users</span>
            </div>
            <span className="font-mono text-xs text-red-400">{systemStats.totalUsers}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-400" />
              <span className="font-mono text-xs">Active</span>
            </div>
            <span className="font-mono text-xs text-red-400">{systemStats.activeUsers}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-red-400" />
              <span className="font-mono text-xs">Load</span>
            </div>
            <span className="font-mono text-xs text-red-400">{systemStats.systemLoad}%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" />
              <span className="font-mono text-xs">Security</span>
            </div>
            <span className="font-mono text-xs text-red-400">{systemStats.security}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Creator Status Widget */}
      <Card className="bg-gradient-to-br from-yellow-900/80 to-red-900/80 border-yellow-500/30 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="text-yellow-400 font-mono text-sm font-bold mb-2 flex items-center gap-2">
            <Crown className="w-4 h-4" />
            CREATOR STATUS
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="font-mono text-xs text-yellow-400">GOD MODE ACTIVE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="font-mono text-xs text-red-400">UNLIMITED ACCESS</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="font-mono text-xs text-green-400">SYSTEM STABLE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="font-mono text-xs text-purple-400">UPTIME: {systemStats.uptime}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Threat Monitor Widget */}
      <Card className="bg-gradient-to-br from-gray-900/80 to-red-900/80 border-gray-500/30 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="text-gray-400 font-mono text-sm font-bold mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            THREAT MONITOR
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-green-400">{systemStats.threats}</div>
            <div className="text-xs font-mono text-green-400">Active Threats</div>
            <div className="text-xs font-mono text-gray-400 mt-1">All systems secure</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
