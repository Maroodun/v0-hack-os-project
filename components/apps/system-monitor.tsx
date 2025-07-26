"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Cpu, HardDrive, Wifi, Users, Database, Shield, Zap } from "lucide-react"

export default function SystemMonitor() {
  const [metrics, setMetrics] = useState({
    cpu: 15,
    memory: 68,
    disk: 45,
    network: 1250,
    users: 42,
    processes: 156,
    uptime: 2847,
    threats: 0,
  })

  const [processes, setProcesses] = useState([
    { id: 1, name: "hacksim-core", cpu: 12.5, memory: 256, user: "root" },
    { id: 2, name: "terminal-service", cpu: 8.2, memory: 128, user: "system" },
    { id: 3, name: "mission-handler", cpu: 5.1, memory: 64, user: "system" },
    { id: 4, name: "chat-server", cpu: 3.8, memory: 92, user: "system" },
    { id: 5, name: "database-engine", cpu: 15.6, memory: 512, user: "root" },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        cpu: Math.max(5, Math.min(95, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(90, prev.memory + (Math.random() - 0.5) * 5)),
        network: Math.max(500, Math.min(2000, prev.network + (Math.random() - 0.5) * 200)),
        users: 42 + Math.floor(Math.random() * 20),
        processes: 156 + Math.floor(Math.random() * 50),
        uptime: prev.uptime + 1,
      }))

      setProcesses((prev) =>
        prev.map((proc) => ({
          ...proc,
          cpu: Math.max(0.1, Math.min(25, proc.cpu + (Math.random() - 0.5) * 2)),
          memory: Math.max(32, Math.min(1024, proc.memory + (Math.random() - 0.5) * 20)),
        })),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return "text-red-400"
    if (value >= thresholds.warning) return "text-yellow-400"
    return "text-green-400"
  }

  return (
    <div className="h-full bg-black text-red-400 p-4 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-mono flex items-center gap-2 mb-4">
          <Activity className="w-6 h-6" />
          SYSTEM MONITOR
        </h1>
        <div className="text-red-300/70 font-mono text-sm">Surveillance système en temps réel - Accès root</div>
      </div>

      {/* System Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="bg-gray-900/50 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-red-400" />
                <span className="font-mono text-sm">CPU</span>
              </div>
              <Badge className={`${getStatusColor(metrics.cpu, { warning: 70, critical: 90 })} bg-transparent border`}>
                {metrics.cpu.toFixed(1)}%
              </Badge>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.cpu}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-red-400" />
                <span className="font-mono text-sm">RAM</span>
              </div>
              <Badge
                className={`${getStatusColor(metrics.memory, { warning: 80, critical: 95 })} bg-transparent border`}
              >
                {metrics.memory}%
              </Badge>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.memory}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-red-400" />
                <span className="font-mono text-sm">DISK</span>
              </div>
              <Badge className={`${getStatusColor(metrics.disk, { warning: 85, critical: 95 })} bg-transparent border`}>
                {metrics.disk}%
              </Badge>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.disk}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-red-400" />
                <span className="font-mono text-sm">NET</span>
              </div>
              <Badge className="text-green-400 bg-transparent border border-green-500/30">{metrics.network} MB/s</Badge>
            </div>
            <div className="text-xs font-mono text-red-300/70">Trafic réseau actuel</div>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="bg-gray-900/50 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400 font-mono text-lg">INFORMATIONS SYSTÈME</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">Uptime</span>
              <span className="font-mono text-sm text-green-400">{formatUptime(metrics.uptime)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">Utilisateurs connectés</span>
              <span className="font-mono text-sm text-red-400">{metrics.users}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">Processus actifs</span>
              <span className="font-mono text-sm text-red-400">{metrics.processes}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">Menaces détectées</span>
              <Badge
                className={`${metrics.threats === 0 ? "text-green-400 border-green-500/30" : "text-red-400 border-red-500/30"} bg-transparent border`}
              >
                {metrics.threats}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400 font-mono text-lg">SÉCURITÉ SYSTÈME</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="font-mono text-sm text-green-400">Firewall actif</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="font-mono text-sm text-green-400">Antivirus à jour</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-green-400" />
              <span className="font-mono text-sm text-green-400">Chiffrement actif</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-yellow-400" />
              <span className="font-mono text-sm text-yellow-400">Surveillance utilisateurs</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Process List */}
      <Card className="bg-gray-900/50 border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-400 font-mono text-lg">PROCESSUS SYSTÈME</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-4 text-xs font-mono text-red-300/70 border-b border-red-500/30 pb-2">
              <span>PID</span>
              <span>PROCESSUS</span>
              <span>CPU %</span>
              <span>RAM (MB)</span>
              <span>UTILISATEUR</span>
            </div>
            {processes.map((process) => (
              <div
                key={process.id}
                className="grid grid-cols-5 gap-4 text-xs font-mono text-red-400 py-1 hover:bg-red-500/10 rounded"
              >
                <span>{process.id}</span>
                <span>{process.name}</span>
                <span className={getStatusColor(process.cpu, { warning: 15, critical: 20 })}>
                  {process.cpu.toFixed(1)}%
                </span>
                <span>{process.memory}</span>
                <span className={process.user === "root" ? "text-yellow-400" : "text-red-400"}>{process.user}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
