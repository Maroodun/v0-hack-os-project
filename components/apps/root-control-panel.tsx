"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Users, Database, Shield, Activity, Zap, Eye, Code } from "lucide-react"

export default function RootControlPanel() {
  const [systemStatus, setSystemStatus] = useState({
    uptime: "99.9%",
    totalUsers: 1337,
    activeUsers: 42,
    systemLoad: 15,
    memoryUsage: 68,
    diskUsage: 45,
    networkTraffic: 1250,
    securityLevel: 100,
  })

  const executeCommand = (command: string) => {
    console.log(`[ROOT] Executing: ${command}`)
    // Simulate command execution
  }

  return (
    <div className="h-full bg-black text-red-400 p-4 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-mono flex items-center gap-2 mb-4">
          <Crown className="w-6 h-6 text-yellow-400" />
          ROOT CONTROL PANEL
        </h1>
        <div className="text-red-300/70 font-mono text-sm">
          Panneau de contrôle système - Accès administrateur complet
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* System Overview */}
        <Card className="bg-gray-900/50 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400 font-mono flex items-center gap-2">
              <Activity className="w-5 h-5" />
              ÉTAT SYSTÈME
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">Uptime</span>
              <Badge className="bg-green-600/20 text-green-400 border-green-500/30">{systemStatus.uptime}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">Charge CPU</span>
              <span className="font-mono text-sm text-red-400">{systemStatus.systemLoad}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">Mémoire</span>
              <span className="font-mono text-sm text-red-400">{systemStatus.memoryUsage}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">Disque</span>
              <span className="font-mono text-sm text-red-400">{systemStatus.diskUsage}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">Trafic réseau</span>
              <span className="font-mono text-sm text-red-400">{systemStatus.networkTraffic} MB/s</span>
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card className="bg-gray-900/50 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400 font-mono flex items-center gap-2">
              <Users className="w-5 h-5" />
              GESTION UTILISATEURS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">Total utilisateurs</span>
              <span className="font-mono text-sm text-red-400">{systemStatus.totalUsers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">Utilisateurs actifs</span>
              <span className="font-mono text-sm text-green-400">{systemStatus.activeUsers}</span>
            </div>
            <div className="space-y-2">
              <Button
                onClick={() => executeCommand("user-list")}
                className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 font-mono"
              >
                <Users className="w-4 h-4 mr-2" />
                LISTER UTILISATEURS
              </Button>
              <Button
                onClick={() => executeCommand("user-ban")}
                className="w-full bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/50 text-yellow-400 font-mono"
              >
                <Shield className="w-4 h-4 mr-2" />
                BANNIR UTILISATEUR
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Database Control */}
        <Card className="bg-gray-900/50 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400 font-mono flex items-center gap-2">
              <Database className="w-5 h-5" />
              CONTRÔLE BASE DE DONNÉES
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => executeCommand("db-backup")}
                className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-400 font-mono text-xs"
              >
                BACKUP
              </Button>
              <Button
                onClick={() => executeCommand("db-restore")}
                className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 text-green-400 font-mono text-xs"
              >
                RESTORE
              </Button>
              <Button
                onClick={() => executeCommand("db-optimize")}
                className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 text-purple-400 font-mono text-xs"
              >
                OPTIMIZE
              </Button>
              <Button
                onClick={() => executeCommand("db-clean")}
                className="bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/50 text-orange-400 font-mono text-xs"
              >
                CLEAN
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Control */}
        <Card className="bg-gray-900/50 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400 font-mono flex items-center gap-2">
              <Shield className="w-5 h-5" />
              CONTRÔLE SÉCURITÉ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-sm">Niveau sécurité</span>
              <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
                {systemStatus.securityLevel}%
              </Badge>
            </div>
            <div className="space-y-2">
              <Button
                onClick={() => executeCommand("security-scan")}
                className="w-full bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 text-green-400 font-mono"
              >
                <Eye className="w-4 h-4 mr-2" />
                SCAN SÉCURITÉ
              </Button>
              <Button
                onClick={() => executeCommand("firewall-update")}
                className="w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-400 font-mono"
              >
                <Shield className="w-4 h-4 mr-2" />
                MAJ FIREWALL
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Commands */}
        <Card className="bg-gray-900/50 border-red-500/30 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-red-400 font-mono flex items-center gap-2">
              <Code className="w-5 h-5" />
              COMMANDES SYSTÈME
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                onClick={() => executeCommand("system-restart")}
                className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 font-mono text-xs"
              >
                <Zap className="w-4 h-4 mr-1" />
                RESTART
              </Button>
              <Button
                onClick={() => executeCommand("system-shutdown")}
                className="bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/50 text-gray-400 font-mono text-xs"
              >
                SHUTDOWN
              </Button>
              <Button
                onClick={() => executeCommand("clear-logs")}
                className="bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/50 text-yellow-400 font-mono text-xs"
              >
                CLEAR LOGS
              </Button>
              <Button
                onClick={() => executeCommand("maintenance-mode")}
                className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 text-purple-400 font-mono text-xs"
              >
                MAINTENANCE
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Root Privileges Notice */}
      <Card className="mt-6 bg-gradient-to-r from-red-900/20 to-yellow-900/20 border-yellow-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2 text-yellow-400 font-mono text-sm">
            <Crown className="w-5 h-5" />
            <span>PRIVILÈGES ROOT ACTIFS - ACCÈS SYSTÈME COMPLET</span>
            <Crown className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
