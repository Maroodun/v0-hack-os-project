import { supabase, isSupabaseConfigured } from "@/lib/supabase"

export interface PlayerData {
  notes: any[]
  settings: any
  installedTools: string[]
  gameState: any
  missionProgress: any[]
  inventory: any[]
  statistics: any
  achievements: any[]
}

export class DatabaseManager {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  // Save player data
  async savePlayerData(dataType: string, dataKey: string, dataValue: any) {
    if (!isSupabaseConfigured()) {
      // Fallback to localStorage in demo mode
      const key = `hacksim-${dataType}-${dataKey}`
      localStorage.setItem(key, JSON.stringify(dataValue))
      return
    }

    try {
      const { error } = await supabase!.from("player_data").upsert({
        user_id: this.userId,
        data_type: dataType,
        data_key: dataKey,
        data_value: dataValue,
      })

      if (error) throw error
    } catch (error) {
      console.error("Error saving player data:", error)
    }
  }

  // Load player data
  async loadPlayerData(dataType: string, dataKey?: string) {
    if (!isSupabaseConfigured()) {
      // Fallback to localStorage in demo mode
      if (dataKey) {
        const key = `hacksim-${dataType}-${dataKey}`
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : null
      } else {
        const allData: any = {}
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key?.startsWith(`hacksim-${dataType}-`)) {
            const dataKey = key.replace(`hacksim-${dataType}-`, "")
            const data = localStorage.getItem(key)
            if (data) {
              allData[dataKey] = JSON.parse(data)
            }
          }
        }
        return allData
      }
    }

    try {
      let query = supabase!
        .from("player_data")
        .select("data_key, data_value")
        .eq("user_id", this.userId)
        .eq("data_type", dataType)

      if (dataKey) {
        query = query.eq("data_key", dataKey).single()
      }

      const { data, error } = await query

      if (error && error.code !== "PGRST116") throw error

      if (dataKey) {
        return data?.data_value || null
      } else {
        const result: any = {}
        if (data && Array.isArray(data)) {
          data.forEach((item: any) => {
            result[item.data_key] = item.data_value
          })
        }
        return result
      }
    } catch (error) {
      console.error("Error loading player data:", error)
      return dataKey ? null : {}
    }
  }

  // Save mission progress
  async saveMissionProgress(missionId: string, progress: any) {
    if (!isSupabaseConfigured()) {
      const missions = JSON.parse(localStorage.getItem("hacksim-missions") || "{}")
      missions[missionId] = progress
      localStorage.setItem("hacksim-missions", JSON.stringify(missions))
      return
    }

    try {
      const { error } = await supabase!.from("mission_progress").upsert({
        user_id: this.userId,
        mission_id: missionId,
        mission_type: progress.type,
        status: progress.status,
        progress_percentage: progress.progress || 0,
        attempts: progress.attempts || 0,
        best_time: progress.bestTime,
        reward_earned: progress.rewardEarned || 0,
        started_at: progress.startedAt,
        completed_at: progress.completedAt,
        last_attempt_at: new Date().toISOString(),
      })

      if (error) throw error
    } catch (error) {
      console.error("Error saving mission progress:", error)
    }
  }

  // Load mission progress
  async loadMissionProgress() {
    if (!isSupabaseConfigured()) {
      return JSON.parse(localStorage.getItem("hacksim-missions") || "{}")
    }

    try {
      const { data, error } = await supabase!.from("mission_progress").select("*").eq("user_id", this.userId)

      if (error) throw error

      const progress: any = {}
      data?.forEach((mission: any) => {
        progress[mission.mission_id] = {
          type: mission.mission_type,
          status: mission.status,
          progress: mission.progress_percentage,
          attempts: mission.attempts,
          bestTime: mission.best_time,
          rewardEarned: mission.reward_earned,
          startedAt: mission.started_at,
          completedAt: mission.completed_at,
        }
      })

      return progress
    } catch (error) {
      console.error("Error loading mission progress:", error)
      return {}
    }
  }

  // Save inventory item
  async saveInventoryItem(itemId: string, item: any) {
    if (!isSupabaseConfigured()) {
      const inventory = JSON.parse(localStorage.getItem("hacksim-inventory") || "[]")
      const existingIndex = inventory.findIndex((i: any) => i.id === itemId)
      if (existingIndex >= 0) {
        inventory[existingIndex] = { ...inventory[existingIndex], ...item }
      } else {
        inventory.push({ id: itemId, ...item })
      }
      localStorage.setItem("hacksim-inventory", JSON.stringify(inventory))
      return
    }

    try {
      const { error } = await supabase!.from("player_inventory").upsert({
        user_id: this.userId,
        item_id: itemId,
        item_name: item.name,
        item_type: item.type,
        quantity: item.quantity || 1,
        purchase_price: item.purchasePrice,
        purchased_at: item.purchasedAt || new Date().toISOString(),
        last_used_at: item.lastUsedAt,
      })

      if (error) throw error
    } catch (error) {
      console.error("Error saving inventory item:", error)
    }
  }

  // Load inventory
  async loadInventory() {
    if (!isSupabaseConfigured()) {
      return JSON.parse(localStorage.getItem("hacksim-inventory") || "[]")
    }

    try {
      const { data, error } = await supabase!.from("player_inventory").select("*").eq("user_id", this.userId)

      if (error) throw error

      return (
        data?.map((item: any) => ({
          id: item.item_id,
          name: item.item_name,
          type: item.item_type,
          quantity: item.quantity,
          purchasePrice: item.purchase_price,
          purchasedAt: item.purchased_at,
          lastUsedAt: item.last_used_at,
        })) || []
      )
    } catch (error) {
      console.error("Error loading inventory:", error)
      return []
    }
  }

  // Update player statistics
  async updateStatistic(statName: string, value: number) {
    if (!isSupabaseConfigured()) {
      const stats = JSON.parse(localStorage.getItem("hacksim-stats") || "{}")
      stats[statName] = value
      localStorage.setItem("hacksim-stats", JSON.stringify(stats))
      return
    }

    try {
      const { error } = await supabase!.from("player_statistics").upsert({
        user_id: this.userId,
        stat_name: statName,
        stat_value: value,
      })

      if (error) throw error
    } catch (error) {
      console.error("Error updating statistic:", error)
    }
  }

  // Load statistics
  async loadStatistics() {
    if (!isSupabaseConfigured()) {
      return JSON.parse(localStorage.getItem("hacksim-stats") || "{}")
    }

    try {
      const { data, error } = await supabase!
        .from("player_statistics")
        .select("stat_name, stat_value")
        .eq("user_id", this.userId)

      if (error) throw error

      const stats: any = {}
      data?.forEach((stat: any) => {
        stats[stat.stat_name] = stat.stat_value
      })

      return stats
    } catch (error) {
      console.error("Error loading statistics:", error)
      return {}
    }
  }

  // Start game session
  async startGameSession() {
    if (!isSupabaseConfigured()) return null

    try {
      const { data, error } = await supabase!
        .from("game_sessions")
        .insert({
          user_id: this.userId,
          ip_address: await this.getClientIP(),
          user_agent: navigator.userAgent,
        })
        .select()
        .single()

      if (error) throw error
      return data.id
    } catch (error) {
      console.error("Error starting game session:", error)
      return null
    }
  }

  // End game session
  async endGameSession(sessionId: string, stats: any) {
    if (!isSupabaseConfigured()) return

    try {
      const { error } = await supabase!
        .from("game_sessions")
        .update({
          session_end: new Date().toISOString(),
          total_playtime: stats.playtime || 0,
          missions_completed_in_session: stats.missionsCompleted || 0,
          credits_earned_in_session: stats.creditsEarned || 0,
        })
        .eq("id", sessionId)

      if (error) throw error
    } catch (error) {
      console.error("Error ending game session:", error)
    }
  }

  // Unlock achievement
  async unlockAchievement(achievementId: string, name: string, description: string) {
    if (!isSupabaseConfigured()) {
      const achievements = JSON.parse(localStorage.getItem("hacksim-achievements") || "[]")
      if (!achievements.find((a: any) => a.id === achievementId)) {
        achievements.push({
          id: achievementId,
          name,
          description,
          unlockedAt: new Date().toISOString(),
        })
        localStorage.setItem("hacksim-achievements", JSON.stringify(achievements))
      }
      return
    }

    try {
      const { error } = await supabase!.from("achievements").insert({
        user_id: this.userId,
        achievement_id: achievementId,
        achievement_name: name,
        achievement_description: description,
      })

      if (error && error.code !== "23505") throw error // Ignore duplicate key error
    } catch (error) {
      console.error("Error unlocking achievement:", error)
    }
  }

  // Load achievements
  async loadAchievements() {
    if (!isSupabaseConfigured()) {
      return JSON.parse(localStorage.getItem("hacksim-achievements") || "[]")
    }

    try {
      const { data, error } = await supabase!.from("achievements").select("*").eq("user_id", this.userId)

      if (error) throw error

      return (
        data?.map((achievement: any) => ({
          id: achievement.achievement_id,
          name: achievement.achievement_name,
          description: achievement.achievement_description,
          unlockedAt: achievement.unlocked_at,
        })) || []
      )
    } catch (error) {
      console.error("Error loading achievements:", error)
      return []
    }
  }

  // Get client IP (for session tracking)
  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch("https://api.ipify.org?format=json")
      const data = await response.json()
      return data.ip
    } catch {
      return "unknown"
    }
  }

  // Load complete player profile
  async loadCompleteProfile() {
    const [playerData, missionProgress, inventory, statistics, achievements] = await Promise.all([
      this.loadPlayerData("settings"),
      this.loadMissionProgress(),
      this.loadInventory(),
      this.loadStatistics(),
      this.loadAchievements(),
    ])

    return {
      settings: playerData,
      missionProgress,
      inventory,
      statistics,
      achievements,
    }
  }
}
