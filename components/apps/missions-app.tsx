"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, DollarSign, Target, BookOpen } from "lucide-react"

interface Mission {
  id: string
  title: string
  description: string
  difficulty: "Facile" | "Moyen" | "Difficile" | "Expert"
  reward: number
  duration: number
  type: string
  status: "available" | "in-progress" | "completed" | "cooldown"
  progress?: number
  cooldownEnd?: Date
}

export default function MissionsApp() {
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: "1",
      title: "Infiltration Base de Données Corporative",
      description: "Infiltrez la base de données employés de TechCorp et extrayez les informations sensibles.",
      difficulty: "Moyen",
      reward: 2500,
      duration: 300,
      type: "Vol de Données",
      status: "available",
    },
    {
      id: "2",
      title: "Attaque DDoS Coordonnée",
      description: "Lancez une attaque DDoS coordonnée contre les serveurs de la concurrence.",
      difficulty: "Difficile",
      reward: 5000,
      duration: 600,
      type: "Attaque Réseau",
      status: "available",
    },
    {
      id: "3",
      title: "Campagne d'Ingénierie Sociale",
      description: "Créez de faux profils pour collecter des renseignements sur l'organisation cible.",
      difficulty: "Facile",
      reward: 1000,
      duration: 180,
      type: "Ingénierie Sociale",
      status: "available",
    },
    {
      id: "4",
      title: "Déploiement de Ransomware",
      description: "Déployez un ransomware personnalisé pour chiffrer les fichiers critiques de la cible.",
      difficulty: "Expert",
      reward: 10000,
      duration: 900,
      type: "Malware",
      status: "available",
    },
    {
      id: "5",
      title: "Piratage de Système Bancaire",
      description: "Accédez aux systèmes bancaires sécurisés et transférez des fonds anonymement.",
      difficulty: "Expert",
      reward: 15000,
      duration: 1200,
      type: "Finance",
      status: "available",
    },
    {
      id: "6",
      title: "Espionnage Industriel",
      description: "Volez les secrets commerciaux d'une entreprise concurrente via leur réseau interne.",
      difficulty: "Difficile",
      reward: 7500,
      duration: 800,
      type: "Espionnage",
      status: "available",
    },
    {
      id: "7",
      title: "Manipulation de Médias Sociaux",
      description: "Créez une campagne de désinformation virale sur les plateformes sociales.",
      difficulty: "Moyen",
      reward: 3000,
      duration: 400,
      type: "Manipulation",
      status: "available",
    },
    {
      id: "8",
      title: "Sabotage d'Infrastructure",
      description: "Perturbez les systèmes de contrôle industriel d'une usine de production.",
      difficulty: "Expert",
      reward: 20000,
      duration: 1500,
      type: "Sabotage",
      status: "available",
    },
  ])

  const [credits, setCredits] = useState(5000)
  const [showGuide, setShowGuide] = useState(false)

  const startMission = (missionId: string) => {
    setMissions((prev) =>
      prev.map((mission) => {
        if (mission.id === missionId) {
          return { ...mission, status: "in-progress", progress: 0 }
        }
        return mission
      }),
    )

    // Simulate mission progress
    const mission = missions.find((m) => m.id === missionId)
    if (mission) {
      const interval = setInterval(() => {
        setMissions((prev) =>
          prev.map((m) => {
            if (m.id === missionId && m.status === "in-progress") {
              const newProgress = (m.progress || 0) + 100 / (mission.duration / 10)
              if (newProgress >= 100) {
                clearInterval(interval)
                setCredits((prev) => prev + mission.reward)
                return {
                  ...m,
                  status: "cooldown",
                  progress: 100,
                  cooldownEnd: new Date(Date.now() + 30000), // 30 second cooldown
                }
              }
              return { ...m, progress: newProgress }
            }
            return m
          }),
        )
      }, 1000)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Facile":
        return "bg-green-500"
      case "Moyen":
        return "bg-yellow-500"
      case "Difficile":
        return "bg-orange-500"
      case "Expert":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-green-400"
      case "in-progress":
        return "text-yellow-400"
      case "completed":
        return "text-blue-400"
      case "cooldown":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setMissions((prev) =>
        prev.map((mission) => {
          if (mission.status === "cooldown" && mission.cooldownEnd) {
            if (new Date() > mission.cooldownEnd) {
              return { ...mission, status: "available", progress: undefined, cooldownEnd: undefined }
            }
          }
          return mission
        }),
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (showGuide) {
    return (
      <div className="h-full bg-black text-green-400 p-4 overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold font-mono flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              GUIDE COMPLET DU HACKER
            </h1>
            <Button
              onClick={() => setShowGuide(false)}
              className="bg-green-600 hover:bg-green-500 text-black font-mono font-bold"
            >
              RETOUR AUX MISSIONS
            </Button>
          </div>
          <div className="text-green-300/70 font-mono text-sm">
            Manuel complet pour maîtriser l'art du hacking éthique dans HackSim OS
          </div>
        </div>

        <div className="space-y-6">
          {/* Introduction */}
          <Card className="bg-gray-900/50 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400 font-mono">🎯 BIENVENUE DANS HACKSIM OS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-green-400/80 text-sm space-y-2">
                <p>
                  <strong>HackSim OS</strong> est un simulateur de hacking éthique qui vous permet d'apprendre les bases
                  de la cybersécurité dans un environnement sûr et contrôlé.
                </p>
                <p>
                  Ce guide vous expliquera toutes les commandes, outils et stratégies disponibles pour devenir un expert
                  en sécurité informatique.
                </p>
                <div className="bg-yellow-900/20 border border-yellow-500/30 p-3 rounded">
                  <strong className="text-yellow-400">⚠️ IMPORTANT :</strong> Toutes les activités dans ce simulateur
                  sont à des fins éducatives uniquement. N'utilisez jamais ces techniques sur des systèmes réels sans
                  autorisation explicite.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commandes de Base */}
          <Card className="bg-gray-900/50 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400 font-mono">💻 COMMANDES DE BASE DU TERMINAL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-green-300 font-mono font-bold mb-2 flex items-center gap-2">
                  <span className="bg-gray-800 px-2 py-1 rounded">help</span>
                </div>
                <div className="text-green-400/80 text-sm ml-4">
                  <strong>Description :</strong> Affiche la liste de toutes les commandes disponibles.
                  <br />
                  <strong>Utilisation :</strong> <code className="bg-gray-800 px-1 rounded">help</code>
                  <br />
                  <strong>Conseil :</strong> Utilisez cette commande quand vous oubliez une syntaxe.
                </div>
              </div>

              <div>
                <div className="text-green-300 font-mono font-bold mb-2 flex items-center gap-2">
                  <span className="bg-gray-800 px-2 py-1 rounded">whoami</span>
                </div>
                <div className="text-green-400/80 text-sm ml-4">
                  <strong>Description :</strong> Affiche votre identité actuelle sur le système.
                  <br />
                  <strong>Utilisation :</strong> <code className="bg-gray-800 px-1 rounded">whoami</code>
                  <br />
                  <strong>Conseil :</strong> Utile pour vérifier sous quelle identité vous opérez.
                </div>
              </div>

              <div>
                <div className="text-green-300 font-mono font-bold mb-2 flex items-center gap-2">
                  <span className="bg-gray-800 px-2 py-1 rounded">ipconfig</span>
                </div>
                <div className="text-green-400/80 text-sm ml-4">
                  <strong>Description :</strong> Affiche votre configuration réseau complète, y compris votre adresse
                  IP, masque de sous-réseau et passerelle par défaut.
                  <br />
                  <strong>Utilisation :</strong> <code className="bg-gray-800 px-1 rounded">ipconfig</code>
                  <br />
                  <strong>Informations affichées :</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Adresse IPv4 locale</li>
                    <li>Masque de sous-réseau</li>
                    <li>Passerelle par défaut</li>
                    <li>Statut des adaptateurs réseau</li>
                    <li>Configuration VPN anonyme</li>
                  </ul>
                  <strong>Conseil :</strong> Première commande à exécuter pour connaître votre position sur le réseau.
                </div>
              </div>

              <div>
                <div className="text-green-300 font-mono font-bold mb-2 flex items-center gap-2">
                  <span className="bg-gray-800 px-2 py-1 rounded">ls</span>
                </div>
                <div className="text-green-400/80 text-sm ml-4">
                  <strong>Description :</strong> Liste le contenu du répertoire courant.
                  <br />
                  <strong>Utilisation :</strong> <code className="bg-gray-800 px-1 rounded">ls</code>
                  <br />
                  <strong>Affiche :</strong> Dossiers d'exploits, payloads, outils, et fichiers de configuration.
                  <br />
                  <strong>Conseil :</strong> Explorez vos ressources disponibles avant de lancer une attaque.
                </div>
              </div>

              <div>
                <div className="text-green-300 font-mono font-bold mb-2 flex items-center gap-2">
                  <span className="bg-gray-800 px-2 py-1 rounded">clear</span>
                </div>
                <div className="text-green-400/80 text-sm ml-4">
                  <strong>Description :</strong> Efface l'écran du terminal.
                  <br />
                  <strong>Utilisation :</strong> <code className="bg-gray-800 px-1 rounded">clear</code>
                  <br />
                  <strong>Conseil :</strong> Utilisez pour nettoyer votre terminal et garder une vue claire.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commandes de Reconnaissance */}
          <Card className="bg-gray-900/50 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400 font-mono">🔍 COMMANDES DE RECONNAISSANCE</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-blue-300 font-mono font-bold mb-2 flex items-center gap-2">
                  <span className="bg-gray-800 px-2 py-1 rounded">nmap &lt;cible&gt;</span>
                </div>
                <div className="text-green-400/80 text-sm ml-4">
                  <strong>Description :</strong> Nmap (Network Mapper) est l'outil de reconnaissance le plus important.
                  Il scanne les ports ouverts et identifie les services en cours d'exécution.
                  <br />
                  <strong>Utilisation :</strong> <code className="bg-gray-800 px-1 rounded">nmap google.com</code>
                  <br />
                  <strong>Informations obtenues :</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                      <strong>Port 21 (FTP) :</strong> Transfert de fichiers
                    </li>
                    <li>
                      <strong>Port 22 (SSH) :</strong> Accès sécurisé distant
                    </li>
                    <li>
                      <strong>Port 80 (HTTP) :</strong> Serveur web non sécurisé
                    </li>
                    <li>
                      <strong>Port 443 (HTTPS) :</strong> Serveur web sécurisé
                    </li>
                    <li>
                      <strong>Port 3306 (MySQL) :</strong> Base de données
                    </li>
                    <li>
                      <strong>Port 5432 (PostgreSQL) :</strong> Base de données
                    </li>
                  </ul>
                  <strong>Stratégie :</strong> Toujours commencer par nmap pour identifier les points d'entrée
                  potentiels.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commandes d'Attaque */}
          <Card className="bg-gray-900/50 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-red-400 font-mono">⚔️ COMMANDES D'ATTAQUE</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-red-300 font-mono font-bold mb-2 flex items-center gap-2">
                  <span className="bg-gray-800 px-2 py-1 rounded">hydra &lt;cible&gt;</span>
                </div>
                <div className="text-green-400/80 text-sm ml-4">
                  <strong>Description :</strong> Hydra est un outil de force brute ultra-rapide pour casser les mots de
                  passe.
                  <br />
                  <strong>Utilisation :</strong> <code className="bg-gray-800 px-1 rounded">hydra target.com</code>
                  <br />
                  <strong>Fonctionnement :</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Teste des milliers de combinaisons login/mot de passe</li>
                    <li>Utilise des dictionnaires de mots de passe courants</li>
                    <li>Supporte SSH, FTP, HTTP, et bien d'autres protocoles</li>
                  </ul>
                  <strong>Efficacité :</strong> Très efficace contre les mots de passe faibles comme "admin/admin",
                  "root/password".
                  <br />
                  <strong>Conseil :</strong> Utilisez après avoir identifié un service de connexion avec nmap.
                </div>
              </div>

              <div>
                <div className="text-red-300 font-mono font-bold mb-2 flex items-center gap-2">
                  <span className="bg-gray-800 px-2 py-1 rounded">sqlmap &lt;url&gt;</span>
                </div>
                <div className="text-green-400/80 text-sm ml-4">
                  <strong>Description :</strong> SQLMap est l'outil de référence pour détecter et exploiter les
                  vulnérabilités d'injection SQL.
                  <br />
                  <strong>Utilisation :</strong>{" "}
                  <code className="bg-gray-800 px-1 rounded">sqlmap http://target.com/login.php</code>
                  <br />
                  <strong>Processus d'attaque :</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Teste la stabilité de la cible</li>
                    <li>Identifie les paramètres vulnérables</li>
                    <li>Détermine le type de base de données</li>
                    <li>Extrait les noms des bases de données</li>
                    <li>Peut récupérer des tables et des données sensibles</li>
                  </ul>
                  <strong>Bases de données détectées :</strong> MySQL, PostgreSQL, Oracle, SQL Server.
                  <br />
                  <strong>Conseil :</strong> Ciblez les pages avec des formulaires de connexion ou de recherche.
                </div>
              </div>

              <div>
                <div className="text-red-300 font-mono font-bold mb-2 flex items-center gap-2">
                  <span className="bg-gray-800 px-2 py-1 rounded">hack &lt;cible&gt;</span>
                </div>
                <div className="text-green-400/80 text-sm ml-4">
                  <strong>Description :</strong> Commande de hacking automatisé qui combine plusieurs techniques
                  d'attaque.
                  <br />
                  <strong>Utilisation :</strong>{" "}
                  <code className="bg-gray-800 px-1 rounded">hack corporate-server.com</code>
                  <br />
                  <strong>Séquence d'attaque :</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Scan automatique des vulnérabilités</li>
                    <li>Exploitation des failles SQL</li>
                    <li>Détection des vulnérabilités XSS</li>
                    <li>Analyse des politiques de mots de passe</li>
                    <li>Contournement de l'authentification</li>
                    <li>Escalade de privilèges vers root</li>
                  </ul>
                  <strong>Conseil :</strong> Commande avancée à utiliser quand vous maîtrisez les bases.
                </div>
              </div>

              <div>
                <div className="text-red-300 font-mono font-bold mb-2 flex items-center gap-2">
                  <span className="bg-gray-800 px-2 py-1 rounded">metasploit</span>
                </div>
                <div className="text-green-400/80 text-sm ml-4">
                  <strong>Description :</strong> Framework d'exploitation le plus puissant au monde, contenant des
                  milliers d'exploits.
                  <br />
                  <strong>Utilisation :</strong> <code className="bg-gray-800 px-1 rounded">metasploit</code>
                  <br />
                  <strong>Composants :</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                      <strong>2230 exploits :</strong> Failles de sécurité connues
                    </li>
                    <li>
                      <strong>1177 auxiliaires :</strong> Outils de reconnaissance et de test
                    </li>
                    <li>
                      <strong>398 post-exploitation :</strong> Actions après compromission
                    </li>
                    <li>
                      <strong>867 payloads :</strong> Code malveillant à exécuter
                    </li>
                    <li>
                      <strong>45 encodeurs :</strong> Contournement d'antivirus
                    </li>
                  </ul>
                  <strong>Configuration automatique :</strong> Configure un handler pour recevoir les connexions
                  inverses.
                  <br />
                  <strong>Conseil :</strong> L'outil ultime pour les hackers expérimentés.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commandes Utilitaires */}
          <Card className="bg-gray-900/50 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-yellow-400 font-mono">🛠️ COMMANDES UTILITAIRES</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-yellow-300 font-mono font-bold mb-2 flex items-center gap-2">
                  <span className="bg-gray-800 px-2 py-1 rounded">wget &lt;url&gt;</span>
                </div>
                <div className="text-green-400/80 text-sm ml-4">
                  <strong>Description :</strong> Télécharge des fichiers depuis Internet de manière discrète.
                  <br />
                  <strong>Utilisation :</strong>{" "}
                  <code className="bg-gray-800 px-1 rounded">wget http://target.com/secret-file.txt</code>
                  <br />
                  <strong>Fonctionnalités :</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Résolution DNS automatique</li>
                    <li>Connexion HTTP/HTTPS</li>
                    <li>Affichage de la progression</li>
                    <li>Sauvegarde locale du fichier</li>
                  </ul>
                  <strong>Conseil :</strong> Utile pour récupérer des fichiers de configuration ou des listes de mots de
                  passe.
                </div>
              </div>

              <div>
                <div className="text-yellow-300 font-mono font-bold mb-2 flex items-center gap-2">
                  <span className="bg-gray-800 px-2 py-1 rounded">install &lt;outil&gt;</span>
                </div>
                <div className="text-green-400/80 text-sm ml-4">
                  <strong>Description :</strong> Installe les outils achetés dans le magasin sur votre système.
                  <br />
                  <strong>Utilisation :</strong>{" "}
                  <code className="bg-gray-800 px-1 rounded">install brutecracker-pro</code>
                  <br />
                  <strong>Processus d'installation :</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Connexion au dépôt darknet sécurisé</li>
                    <li>Téléchargement du package chiffré</li>
                    <li>Vérification de la signature numérique</li>
                    <li>Extraction et configuration</li>
                  </ul>
                  <strong>Conseil :</strong> Installez vos outils avant de commencer une mission complexe.
                </div>
              </div>

              <div>
                <div className="text-yellow-300 font-mono font-bold mb-2 flex items-center gap-2">
                  <span className="bg-gray-800 px-2 py-1 rounded">tools</span>
                </div>
                <div className="text-green-400/80 text-sm ml-4">
                  <strong>Description :</strong> Affiche la liste de tous vos outils installés.
                  <br />
                  <strong>Utilisation :</strong> <code className="bg-gray-800 px-1 rounded">tools</code>
                  <br />
                  <strong>Informations affichées :</strong> Nom de l'outil, version, statut d'installation.
                  <br />
                  <strong>Conseil :</strong> Vérifiez régulièrement vos outils disponibles pour optimiser vos attaques.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Outils du Magasin */}
          <Card className="bg-gray-900/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-400 font-mono">🛒 OUTILS DISPONIBLES AU MAGASIN</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-purple-300 font-mono font-bold mb-2">🔓 OUTILS DE CRAQUAGE DE MOTS DE PASSE</div>
                <div className="text-green-400/80 text-sm ml-4 space-y-2">
                  <div>
                    <strong>BruteCracker Pro (2500 crédits) :</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Accélération GPU pour un craquage ultra-rapide</li>
                      <li>Tables arc-en-ciel pré-calculées</li>
                      <li>Support des hashes MD5, SHA1, SHA256</li>
                      <li>Dictionnaires de mots de passe étendus</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-purple-300 font-mono font-bold mb-2">💉 OUTILS D'EXPLOITATION</div>
                <div className="text-green-400/80 text-sm ml-4 space-y-2">
                  <div>
                    <strong>SQL Injection Kit (1800 crédits) :</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Génération automatique de payloads SQL</li>
                      <li>Contournement des WAF (Web Application Firewall)</li>
                      <li>Extraction automatisée de données</li>
                      <li>Support de toutes les bases de données</li>
                    </ul>
                  </div>
                  <div>
                    <strong>XSS Exploitation Suite (2200 crédits) :</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Détection automatique des vulnérabilités XSS</li>
                      <li>Injection de payloads JavaScript avancés</li>
                      <li>Vol de cookies et sessions</li>
                      <li>Redirection malveillante</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-purple-300 font-mono font-bold mb-2">🌐 OUTILS RÉSEAU</div>
                <div className="text-green-400/80 text-sm ml-4 space-y-2">
                  <div>
                    <strong>Network Scanner Elite (3200 crédits) :</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Scan furtif pour éviter la détection</li>
                      <li>Détection automatique des vulnérabilités</li>
                      <li>Cartographie complète du réseau</li>
                      <li>Identification des systèmes d'exploitation</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-purple-300 font-mono font-bold mb-2">📜 GÉNÉRATEURS ET SCRIPTS</div>
                <div className="text-green-400/80 text-sm ml-4 space-y-2">
                  <div>
                    <strong>Payload Generator (1500 crédits) :</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Création de payloads personnalisés</li>
                      <li>Encodage pour contourner les antivirus</li>
                      <li>Support multi-plateformes (Windows, Linux, Mac)</li>
                      <li>Intégration avec Metasploit</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-purple-300 font-mono font-bold mb-2">🛡️ AMÉLIORATIONS SYSTÈME</div>
                <div className="text-green-400/80 text-sm ml-4 space-y-2">
                  <div>
                    <strong>Stealth Mode Upgrade (5000 crédits) :</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Réduction de 75% du risque de détection</li>
                      <li>Masquage de l'adresse IP source</li>
                      <li>Chiffrement des communications</li>
                      <li>Effacement automatique des logs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stratégies Avancées */}
          <Card className="bg-gray-900/50 border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-orange-400 font-mono">🎯 STRATÉGIES DE HACKING AVANCÉES</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-orange-300 font-mono font-bold mb-2">
                  1. MÉTHODOLOGIE OSINT (Open Source Intelligence)
                </div>
                <div className="text-green-400/80 text-sm ml-4">
                  <strong>Objectif :</strong> Collecter un maximum d'informations sur la cible avant l'attaque.
                  <br />
                  <strong>Étapes :</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Recherche d'informations publiques sur l'entreprise</li>
                    <li>Identification des employés via les réseaux sociaux</li>
                    <li>Analyse des technologies utilisées</li>
                    <li>Cartographie de l'infrastructure réseau</li>
                  </ul>
                </div>
              </div>

              <div>
                <div className="text-orange-300 font-mono font-bold mb-2">2. ATTAQUE EN CHAÎNE (Kill Chain)</div>
                <div className="text-green-400/80 text-sm ml-4">
                  <strong>Phase 1 - Reconnaissance :</strong> <code>nmap</code> pour identifier les services
                  <br />
                  <strong>Phase 2 - Armement :</strong> Préparer les exploits avec <code>metasploit</code>
                  <br />
                  <strong>Phase 3 - Livraison :</strong> Envoyer le payload via <code>sqlmap</code> ou{" "}
                  <code>hydra</code>
                  <br />
                  <strong>Phase 4 - Exploitation :</strong> Exécuter le code malveillant
                  <br />
                  <strong>Phase 5 - Installation :</strong> Installer une backdoor permanente
                  <br />
                  <strong>Phase 6 - Commande :</strong> Contrôler le système compromis
                  <br />
                  <strong>Phase 7 - Actions :</strong> Exfiltrer les données sensibles
                </div>
              </div>

              <div>
                <div className="text-orange-300 font-mono font-bold mb-2">3. TECHNIQUES D'ÉVASION</div>
                <div className="text-green-400/80 text-sm ml-4">
                  <strong>Contournement d'antivirus :</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Utiliser le Payload Generator pour encoder les exploits</li>
                    <li>Fragmenter les attaques en plusieurs petites requêtes</li>
                    <li>Utiliser des délais entre les tentatives</li>
                  </ul>
                  <strong>Éviter la détection réseau :</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Activer le Stealth Mode Upgrade</li>
                    <li>Utiliser des proxies et VPN</li>
                    <li>Varier les adresses IP sources</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Types de Missions */}
          <Card className="bg-gray-900/50 border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-cyan-400 font-mono">🎮 GUIDE DES TYPES DE MISSIONS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-cyan-300 font-mono font-bold mb-2">💾 VOL DE DONNÉES</div>
                <div className="text-green-400/80 text-sm ml-4">
                  <strong>Objectif :</strong> Infiltrer des bases de données et extraire des informations sensibles.
                  <br />
                  <strong>Outils recommandés :</strong> SQL Injection Kit, Network Scanner Elite
                  <br />
                  <strong>Stratégie :</strong> Identifier les bases de données avec nmap, puis utiliser sqlmap pour
                  l'extraction.
                  <br />
                  <strong>Récompense :</strong> 1000-2500 crédits selon la difficulté.
                </div>
              </div>

              <div>
                <div className="text-cyan-300 font-mono font-bold mb-2">🌐 ATTAQUE RÉSEAU</div>
                <div className="text-green-400/80 text-sm ml-4">
                  <strong>Objectif :</strong> Perturber ou compromettre l'infrastructure réseau de la cible.
                  <br />
                  <strong>Outils recommandés :</strong> Network Scanner Elite, Stealth Mode Upgrade
                  <br />
                  <strong>Stratégie :</strong> Cartographier le réseau, identifier les points faibles, lancer l'attaque
                  coordonnée.
                  <br />
                  <strong>Récompense :</strong> 3000-5000 crédits selon l'ampleur.
                </div>
              </div>

              <div>
                <div className="text-cyan-300 font-mono font-bold mb-2">🦠 DÉPLOIEMENT MALWARE</div>
                <div className="text-green-400/80 text-sm ml-4">
                  <strong>Objectif :</strong> Installer des logiciels malveillants sur les systèmes cibles.
                  <br />
                  <strong>Outils recommandés :</strong> Payload Generator, BruteCracker Pro
                  <br />
                  <strong>Stratégie :</strong> Créer un payload furtif, trouver un vecteur d'infection, déployer le
                  malware.
                  <br />
                  <strong>Récompense :</strong> 5000-10000 crédits selon la sophistication.
                </div>
              </div>

              <div>
                <div className="text-cyan-300 font-mono font-bold mb-2">👥 INGÉNIERIE SOCIALE</div>
                <div className="text-green-400/80 text-sm ml-4">
                  <strong>Objectif :</strong> Manipuler les humains pour obtenir des accès ou informations.
                  <br />
                  <strong>Outils recommandés :</strong> Aucun outil spécifique, basé sur la psychologie
                  <br />
                  <strong>Stratégie :</strong> Créer de faux profils, établir la confiance, extraire les informations.
                  <br />
                  <strong>Récompense :</strong> 1000-3000 crédits selon la complexité.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conseils pour Débutants */}
          <Card className="bg-gray-900/50 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400 font-mono">🌱 CONSEILS POUR DÉBUTANTS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-green-300 font-mono font-bold mb-2">💡 PROGRESSION RECOMMANDÉE</div>
                <div className="text-green-400/80 text-sm ml-4">
                  <strong>Niveau 1-5 :</strong> Missions faciles d'ingénierie sociale et reconnaissance
                  <br />
                  <strong>Niveau 6-15 :</strong> Attaques de bases de données et craquage de mots de passe
                  <br />
                  <strong>Niveau 16-30 :</strong> Attaques réseau complexes et déploiement de malware
                  <br />
                  <strong>Niveau 31+ :</strong> Missions expertes et sabotage d'infrastructure
                </div>
              </div>

              <div>
                <div className="text-green-300 font-mono font-bold mb-2">💰 GESTION DES CRÉDITS</div>
                <div className="text-green-400/80 text-sm ml-4">
                  <strong>Priorité 1 :</strong> BruteCracker Pro (2500 crédits) - Essentiel pour la plupart des missions
                  <br />
                  <strong>Priorité 2 :</strong> SQL Injection Kit (1800 crédits) - Très rentable
                  <br />
                  <strong>Priorité 3 :</strong> Network Scanner Elite (3200 crédits) - Pour les attaques avancées
                  <br />
                  <strong>Priorité 4 :</strong> Stealth Mode Upgrade (5000 crédits) - Pour éviter la détection
                </div>
              </div>

              <div>
                <div className="text-green-300 font-mono font-bold mb-2">🔧 PRATIQUE ET EXPÉRIMENTATION</div>
                <div className="text-green-400/80 text-sm ml-4">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Testez chaque commande sur différentes cibles</li>
                    <li>Lisez attentivement les résultats de chaque scan</li>
                    <li>Notez les combinaisons d'outils efficaces</li>
                    <li>Expérimentez avec les paramètres des commandes</li>
                    <li>Utilisez l'application Notes pour documenter vos découvertes</li>
                  </ul>
                </div>
              </div>

              <div>
                <div className="text-green-300 font-mono font-bold mb-2">⚠️ ERREURS À ÉVITER</div>
                <div className="text-green-400/80 text-sm ml-4">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Ne pas faire de reconnaissance avant d'attaquer</li>
                    <li>Utiliser des outils trop avancés sans comprendre les bases</li>
                    <li>Négliger la furtivité et se faire détecter</li>
                    <li>Dépenser tous ses crédits sur un seul outil coûteux</li>
                    <li>Abandonner après les premiers échecs</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Éthique et Légalité */}
          <Card className="bg-gray-900/50 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-red-400 font-mono">⚖️ ÉTHIQUE ET LÉGALITÉ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-900/20 border border-red-500/30 p-4 rounded">
                <div className="text-red-400 font-mono font-bold mb-2">🚨 AVERTISSEMENT IMPORTANT</div>
                <div className="text-red-300/80 text-sm space-y-2">
                  <p>
                    <strong>HackSim OS est un simulateur éducatif.</strong> Toutes les "attaques" sont simulées et ne
                    ciblent aucun système réel.
                  </p>
                  <p>
                    <strong>Usage illégal interdit :</strong> N'utilisez JAMAIS ces techniques sur des systèmes réels
                    sans autorisation écrite explicite du propriétaire.
                  </p>
                  <p>
                    <strong>Hacking éthique seulement :</strong> Ces connaissances doivent servir à améliorer la
                    sécurité, pas à nuire.
                  </p>
                </div>
              </div>

              <div>
                <div className="text-green-300 font-mono font-bold mb-2">✅ UTILISATIONS LÉGALES</div>
                <div className="text-green-400/80 text-sm ml-4">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Tests de pénétration autorisés par contrat</li>
                    <li>Bug bounty sur des plateformes officielles</li>
                    <li>Recherche en cybersécurité dans un cadre académique</li>
                    <li>Formation et certification en sécurité informatique</li>
                    <li>Audit de sécurité de vos propres systèmes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-black text-green-400 p-4 overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold font-mono flex items-center gap-2">
            <Target className="w-6 h-6" />
            CENTRE DE MISSIONS
          </h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowGuide(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              GUIDE
            </Button>
            <div className="flex items-center gap-2 bg-green-900/30 px-4 py-2 rounded border border-green-500/30">
              <DollarSign className="w-4 h-4" />
              <span className="font-mono font-bold">{credits.toLocaleString()} CRÉDITS</span>
            </div>
          </div>
        </div>
        <div className="text-green-300/70 font-mono text-sm">
          Sélectionnez et exécutez des contrats à haute valeur. Complétez les missions pour gagner des crédits.
        </div>
      </div>

      <div className="grid gap-4">
        {missions.map((mission) => (
          <Card key={mission.id} className="bg-gray-900/50 border-green-500/30">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-green-400 font-mono text-lg">{mission.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={`${getDifficultyColor(mission.difficulty)} text-black font-mono text-xs`}>
                      {mission.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-green-400 border-green-500/30 font-mono text-xs">
                      {mission.type}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-400 font-mono">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-bold">{mission.reward.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-300/70 text-sm font-mono mt-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {Math.floor(mission.duration / 60)}m {mission.duration % 60}s
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-green-300/80 font-mono text-sm mb-4">{mission.description}</p>

              {mission.status === "in-progress" && mission.progress !== undefined && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-yellow-400 font-mono text-sm">EXÉCUTION...</span>
                    <span className="text-yellow-400 font-mono text-sm">{Math.round(mission.progress)}%</span>
                  </div>
                  <Progress value={mission.progress} className="h-2" />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className={`font-mono text-sm ${getStatusColor(mission.status)}`}>
                  STATUT: {mission.status.toUpperCase()}
                  {mission.status === "cooldown" && mission.cooldownEnd && (
                    <span className="ml-2">
                      ({Math.max(0, Math.ceil((mission.cooldownEnd.getTime() - Date.now()) / 1000))}s)
                    </span>
                  )}
                </div>
                <Button
                  onClick={() => startMission(mission.id)}
                  disabled={mission.status !== "available"}
                  className="bg-green-600 hover:bg-green-500 text-black font-mono font-bold"
                >
                  {mission.status === "available"
                    ? "DÉMARRER MISSION"
                    : mission.status === "in-progress"
                      ? "EN COURS"
                      : mission.status === "cooldown"
                        ? "COOLDOWN"
                        : "TERMINÉ"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
