"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Cpu, HardDrive, Wifi, Shield } from "lucide-react"

export default function DesktopWidgets() {
  const [systemStats, setSystemStats] = useState({
    cpu: 0,
    memory: 0,
    network: 0,
    security: 100,
  })

  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())

      // Simulate system stats
      setSystemStats({
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 80) + 20,
        network: Math.floor(Math.random() * 100),
        security: Math.floor(Math.random() * 20) + 80,
      })
    }, 2000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="absolute top-4 right-4 space-y-4">
      {/* Clock Widget */}
      <Card className="bg-gray-900/80 border-green-500/30 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <div className="text-green-400 font-mono text-2xl font-bold">{time.toLocaleTimeString()}</div>
          <div className="text-green-300/70 font-mono text-sm">{time.toLocaleDateString()}</div>
        </CardContent>
      </Card>

      {/* System Monitor Widget */}
      <Card className="bg-gray-900/80 border-green-500/30 backdrop-blur-sm">
        <CardContent className="p-4 space-y-3">
          <div className="text-green-400 font-mono text-sm font-bold mb-2">SYSTEM</div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-green-400" />
              <span className="font-mono text-xs">CPU</span>
            </div>
            <span className="font-mono text-xs text-green-400">{systemStats.cpu}%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-green-400" />
              <span className="font-mono text-xs">RAM</span>
            </div>
            <span className="font-mono text-xs text-green-400">{systemStats.memory}%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-green-400" />
              <span className="font-mono text-xs">NET</span>
            </div>
            <span className="font-mono text-xs text-green-400">{systemStats.network}%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="font-mono text-xs">SEC</span>
            </div>
            <span className="font-mono text-xs text-green-400">{systemStats.security}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Network Status Widget */}
      <Card className="bg-gray-900/80 border-green-500/30 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="text-green-400 font-mono text-sm font-bold mb-2">NETWORK</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-mono text-xs text-green-400">VPN ACTIVE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="font-mono text-xs text-green-400">TOR CONNECTED</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="font-mono text-xs text-yellow-400">PROXY ENABLED</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
