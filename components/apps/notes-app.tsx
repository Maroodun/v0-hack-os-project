"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Trash2, Edit, Save, X } from "lucide-react"
import { DatabaseManager } from "@/lib/database"

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  color: string
  createdAt: Date
  updatedAt: Date
}

interface NotesAppProps {
  user?: any
}

export default function NotesApp({ user }: NotesAppProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    tags: "",
    color: "green",
  })
  const [dbManager, setDbManager] = useState<DatabaseManager | null>(null)

  const colors = [
    { name: "green", class: "border-green-500/30 bg-green-900/20" },
    { name: "blue", class: "border-blue-500/30 bg-blue-900/20" },
    { name: "red", class: "border-red-500/30 bg-red-900/20" },
    { name: "yellow", class: "border-yellow-500/30 bg-yellow-900/20" },
    { name: "purple", class: "border-purple-500/30 bg-purple-900/20" },
  ]

  useEffect(() => {
    if (user?.id) {
      const manager = new DatabaseManager(user.id)
      setDbManager(manager)
      loadNotes(manager)
    } else {
      // Fallback to localStorage for demo mode
      loadNotesFromLocalStorage()
    }
  }, [user])

  const loadNotes = async (manager: DatabaseManager) => {
    try {
      const notesData = await manager.loadPlayerData("notes")
      if (notesData && notesData.notes) {
        const parsedNotes = notesData.notes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }))
        setNotes(parsedNotes)
      }
    } catch (error) {
      console.error("Error loading notes:", error)
    }
  }

  const loadNotesFromLocalStorage = () => {
    const savedNotes = localStorage.getItem("hacksim-notes")
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }))
      setNotes(parsedNotes)
    }
  }

  const saveNotes = async (updatedNotes: Note[]) => {
    if (dbManager) {
      try {
        await dbManager.savePlayerData("notes", "notes", updatedNotes)
      } catch (error) {
        console.error("Error saving notes:", error)
      }
    } else {
      // Fallback to localStorage
      localStorage.setItem("hacksim-notes", JSON.stringify(updatedNotes))
    }
  }

  const createNote = async () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        title: newNote.title,
        content: newNote.content,
        tags: newNote.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        color: newNote.color,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const updatedNotes = [note, ...notes]
      setNotes(updatedNotes)
      await saveNotes(updatedNotes)
      setNewNote({ title: "", content: "", tags: "", color: "green" })
      setIsCreating(false)
    }
  }

  const deleteNote = async (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id)
    setNotes(updatedNotes)
    await saveNotes(updatedNotes)
  }

  const startEditing = (note: Note) => {
    setEditingId(note.id)
    setNewNote({
      title: note.title,
      content: note.content,
      tags: note.tags.join(", "),
      color: note.color,
    })
  }

  const saveEdit = async () => {
    if (editingId && newNote.title.trim() && newNote.content.trim()) {
      const updatedNotes = notes.map((note) =>
        note.id === editingId
          ? {
              ...note,
              title: newNote.title,
              content: newNote.content,
              tags: newNote.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag),
              color: newNote.color,
              updatedAt: new Date(),
            }
          : note,
      )
      setNotes(updatedNotes)
      await saveNotes(updatedNotes)
      setEditingId(null)
      setNewNote({ title: "", content: "", tags: "", color: "green" })
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsCreating(false)
    setNewNote({ title: "", content: "", tags: "", color: "green" })
  }

  const getColorClass = (colorName: string) => {
    return colors.find((c) => c.name === colorName)?.class || colors[0].class
  }

  return (
    <div className="h-full bg-black text-green-400 p-4 overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold font-mono flex items-center gap-2">
            <FileText className="w-6 h-6" />
            NOTES SÉCURISÉES
          </h1>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-green-600 hover:bg-green-500 text-black font-mono font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            NOUVELLE NOTE
          </Button>
        </div>
        <div className="text-green-300/70 font-mono text-sm">
          Notes chiffrées sauvegardées {dbManager ? "dans la base de données" : "localement"}.
        </div>
      </div>

      {/* Create/Edit Note Form */}
      {(isCreating || editingId) && (
        <Card className="mb-6 bg-gray-900/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 font-mono">
              {isCreating ? "CRÉER NOUVELLE NOTE" : "MODIFIER NOTE"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Titre de la note..."
              value={newNote.title}
              onChange={(e) => setNewNote((prev) => ({ ...prev, title: e.target.value }))}
              className="bg-black/50 border-green-500/30 text-green-400 placeholder:text-green-400/50 font-mono"
            />
            <Textarea
              placeholder="Contenu de la note..."
              value={newNote.content}
              onChange={(e) => setNewNote((prev) => ({ ...prev, content: e.target.value }))}
              className="bg-black/50 border-green-500/30 text-green-400 placeholder:text-green-400/50 font-mono min-h-[120px]"
            />
            <Input
              placeholder="Tags (séparés par des virgules)..."
              value={newNote.tags}
              onChange={(e) => setNewNote((prev) => ({ ...prev, tags: e.target.value }))}
              className="bg-black/50 border-green-500/30 text-green-400 placeholder:text-green-400/50 font-mono"
            />
            <div className="flex items-center gap-2">
              <span className="text-green-400 font-mono text-sm">Couleur:</span>
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setNewNote((prev) => ({ ...prev, color: color.name }))}
                  className={`w-6 h-6 rounded border-2 ${
                    newNote.color === color.name ? "border-white" : "border-transparent"
                  } ${color.class}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={isCreating ? createNote : saveEdit}
                className="bg-green-600 hover:bg-green-500 text-black font-mono font-bold"
              >
                <Save className="w-4 h-4 mr-2" />
                SAUVEGARDER
              </Button>
              <Button
                onClick={cancelEdit}
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/20 font-mono bg-transparent"
              >
                <X className="w-4 h-4 mr-2" />
                ANNULER
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Card key={note.id} className={`${getColorClass(note.color)}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-green-400 font-mono text-lg">{note.title}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEditing(note)}
                    className="w-6 h-6 p-0 text-green-400 hover:bg-green-500/20"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteNote(note.id)}
                    className="w-6 h-6 p-0 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-green-300/80 font-mono text-sm mb-3 whitespace-pre-wrap">{note.content}</p>
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {note.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs font-mono border-green-500/30 text-green-400"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="text-green-300/50 font-mono text-xs">
                Créé: {note.createdAt.toLocaleDateString()}
                {note.updatedAt > note.createdAt && <div>Modifié: {note.updatedAt.toLocaleDateString()}</div>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notes.length === 0 && !isCreating && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-green-400/30 mx-auto mb-4" />
          <div className="text-green-400/70 font-mono">Aucune note trouvée. Créez votre première note sécurisée.</div>
        </div>
      )}
    </div>
  )
}
