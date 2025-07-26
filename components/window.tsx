"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WindowProps {
  id: string
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  isMinimized: boolean
  zIndex: number
  onClose: () => void
  onMinimize: () => void
  onFocus: () => void
}

export default function Window({
  id,
  title,
  icon,
  children,
  isMinimized,
  zIndex,
  onClose,
  onMinimize,
  onFocus,
}: WindowProps) {
  const [position, setPosition] = useState({ x: 100 + Math.random() * 200, y: 100 + Math.random() * 100 })
  const [size, setSize] = useState({ width: 800, height: 600 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest(".window-header")) {
      setIsDragging(true)
      const rect = windowRef.current?.getBoundingClientRect()
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
      onFocus()
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragOffset])

  if (isMinimized) return null

  return (
    <div
      ref={windowRef}
      className="absolute bg-gray-900/95 border border-green-500/30 rounded-lg shadow-2xl backdrop-blur-sm"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Window Header */}
      <div className="window-header flex items-center justify-between p-2 bg-gray-800/90 border-b border-green-500/30 rounded-t-lg cursor-move">
        <div className="flex items-center gap-2">
          <div className="text-green-400">{icon}</div>
          <span className="text-green-400 font-mono text-sm">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={onMinimize}
            className="w-6 h-6 p-0 hover:bg-yellow-500/20 text-yellow-400"
          >
            <Minus className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose} className="w-6 h-6 p-0 hover:bg-red-500/20 text-red-400">
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Window Content */}
      <div className="p-4 h-full overflow-auto" style={{ height: "calc(100% - 40px)" }}>
        {children}
      </div>
    </div>
  )
}
