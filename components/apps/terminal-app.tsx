"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

interface Command {
  input: string
  output: string[]
  timestamp: Date
}

interface TerminalAppProps {
  userProfile?: any
  installedTools?: string[]
  onToolInstall?: (toolName: string) => void
}

export default function TerminalApp({ userProfile, installedTools = [], onToolInstall }: TerminalAppProps) {
  const [commands, setCommands] = useState<Command[]>([
    {
      input: "",
      output: ["HACKSIM OS Terminal v2.1.0", 'Type "help" for available commands', ""],
      timestamp: new Date(),
    },
  ])
  const [currentInput, setCurrentInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [userIP] = useState(() => `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`)
  const [isInstalling, setIsInstalling] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const executeCommand = (cmd: string) => {
    const parts = cmd.trim().split(" ")
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)
    let output: string[] = []

    switch (command) {
      case "help":
        output = [
          "Available commands:",
          "  help          - Show this help message",
          "  ipconfig      - Display network configuration",
          "  nmap <target> - Network scan simulation",
          "  hydra <target>- Brute force simulation",
          "  wget <url>    - Download simulation",
          "  install <tool>- Install purchased tools",
          "  tools         - List installed tools",
          "  ls            - List directory contents",
          "  whoami        - Display current user",
          "  clear         - Clear terminal",
          "  hack <target> - Advanced hacking simulation",
          "  sqlmap <url>  - SQL injection testing",
          "  metasploit    - Launch Metasploit framework",
          "",
        ]
        break

      case "ipconfig":
        output = [
          "Network Configuration:",
          "",
          "Ethernet adapter Local Area Connection:",
          `   IPv4 Address: ${userIP}`,
          "   Subnet Mask: 255.255.255.0",
          `   Default Gateway: 192.168.${userIP.split(".")[2]}.1`,
          "",
          "Wireless LAN adapter Wi-Fi:",
          "   Media State: Media disconnected",
          "",
          "VPN adapter Anonymous:",
          "   IPv4 Address: 10.0.0.1",
          "   Connection-specific DNS Suffix: tor.onion",
          "",
        ]
        break

      case "install":
        if (args.length === 0) {
          output = ["Usage: install <tool-name>", "Example: install brutecracker-pro"]
        } else {
          const toolName = args.join("-")
          if (installedTools.includes(toolName)) {
            output = [`Tool '${toolName}' is already installed.`]
          } else {
            setIsInstalling(true)
            output = [
              `Installing ${toolName}...`,
              "Connecting to dark web repository...",
              "Downloading encrypted package...",
              "Verifying digital signature...",
              "Extracting files...",
              "Configuring tool...",
              `Successfully installed ${toolName}!`,
              "",
            ]
            setTimeout(() => {
              setIsInstalling(false)
              onToolInstall?.(toolName)
            }, 3000)
          }
        }
        break

      case "tools":
        output = [
          "Installed Hacking Tools:",
          "",
          ...installedTools.map((tool) => `  - ${tool}`),
          "",
          `Total tools: ${installedTools.length}`,
          "",
        ]
        break

      case "sqlmap":
        const url = args[0] || "http://target.com/login.php"
        output = [
          `SQLMap v1.6.12 - Automatic SQL injection tool`,
          "",
          `Target URL: ${url}`,
          "Testing connection to the target URL...",
          "Testing if the target URL content is stable...",
          "Testing if GET parameter 'id' is dynamic...",
          "Testing if GET parameter 'id' is vulnerable to SQL injection...",
          "",
          "[INFO] GET parameter 'id' appears to be 'MySQL >= 5.0 boolean-based blind - WHERE or HAVING clause' injectable",
          "[INFO] Testing MySQL",
          "[INFO] Confirming MySQL",
          "",
          "Available databases [3]:",
          "[*] information_schema",
          "[*] mysql",
          "[*] users_db",
          "",
        ]
        break

      case "metasploit":
        output = [
          "Metasploit Framework Console v6.2.26",
          "",
          "      =[ metasploit v6.2.26-dev                          ]",
          "+ -- --=[ 2230 exploits - 1177 auxiliary - 398 post       ]",
          "+ -- --=[ 867 payloads - 45 encoders - 11 nops            ]",
          "+ -- --=[ 9 evasion                                       ]",
          "",
          "msf6 > use exploit/multi/handler",
          "[*] Using configured payload generic/shell_reverse_tcp",
          "msf6 exploit(multi/handler) > set LHOST " + userIP,
          "LHOST => " + userIP,
          "msf6 exploit(multi/handler) > exploit",
          "",
          "[*] Started reverse TCP handler on " + userIP + ":4444",
          "[*] Waiting for connection...",
          "",
        ]
        break

      case "whoami":
        output = [`${userProfile?.hacker_id || "root"}@hacksim-os`]
        break

      case "ls":
        output = [
          "total 12",
          "drwxr-xr-x 2 root root 4096 Jan 26 12:00 exploits",
          "drwxr-xr-x 2 root root 4096 Jan 26 12:00 payloads",
          "drwxr-xr-x 2 root root 4096 Jan 26 12:00 tools",
          "-rw-r--r-- 1 root root  256 Jan 26 12:00 targets.txt",
          "-rwxr-xr-x 1 root root 1024 Jan 26 12:00 bruteforce.py",
          "-rw-r--r-- 1 root root  512 Jan 26 12:00 wordlist.txt",
          "",
        ]
        break

      case "clear":
        setCommands([])
        return

      default:
        if (command.startsWith("nmap ")) {
          const target = args[0] || "localhost"
          output = [
            `Starting Nmap 7.92 scan on ${target}...`,
            "",
            "PORT     STATE SERVICE    VERSION",
            "21/tcp   open  ftp        vsftpd 3.0.3",
            "22/tcp   open  ssh        OpenSSH 8.2p1",
            "80/tcp   open  http       Apache httpd 2.4.41",
            "443/tcp  open  ssl/http   Apache httpd 2.4.41",
            "3306/tcp open  mysql      MySQL 8.0.28",
            "5432/tcp open  postgresql PostgreSQL 13.7",
            "",
            `Nmap scan completed for ${target}`,
            "",
          ]
        } else if (command.startsWith("hydra ")) {
          const target = args[0] || "localhost"
          output = [
            `Hydra v9.3 starting brute force attack on ${target}...`,
            "",
            `[DATA] max 16 tasks per 1 server, overall 16 tasks`,
            `[DATA] attacking ${target}:22/ssh/`,
            "",
            "[ATTEMPT] target " + target + ' - login "admin" - pass "password"',
            "[ATTEMPT] target " + target + ' - login "admin" - pass "123456"',
            "[ATTEMPT] target " + target + ' - login "admin" - pass "admin"',
            "[SUCCESS] target " + target + ' - login "admin" - pass "admin"',
            "",
            "1 of 1 target successfully completed, 1 valid password found",
            "",
          ]
        } else if (command.startsWith("wget ")) {
          const url = args[0] || "http://example.com"
          output = [
            `--${new Date().toISOString()}--  ${url}`,
            "Resolving example.com... 93.184.216.34",
            "Connecting to example.com|93.184.216.34|:80... connected.",
            "HTTP request sent, awaiting response... 200 OK",
            "Length: 1256 (1.2K) [text/html]",
            "Saving to: 'index.html'",
            "",
            "100%[===================>] 1,256       --.-K/s   in 0s",
            "",
            `${new Date().toISOString()} (6.84 MB/s) - 'index.html' saved [1256/1256]`,
            "",
          ]
        } else if (command.startsWith("hack ")) {
          const target = args[0] || "target.com"
          output = [
            `Initiating advanced penetration test on ${target}...`,
            "",
            "[+] Scanning for vulnerabilities...",
            "[+] SQL injection found in /login.php",
            "[+] XSS vulnerability detected in /search.php",
            "[+] Weak password policy identified",
            "",
            "[*] Exploiting SQL injection...",
            "[*] Bypassing authentication...",
            "[+] Access granted! Root privileges obtained.",
            "",
            "[+] Hack completed successfully!",
            `[+] Target ${target} has been compromised.`,
            "",
          ]
        } else {
          output = [`bash: ${command}: command not found`]
        }
    }

    const newCommand: Command = {
      input: cmd,
      output,
      timestamp: new Date(),
    }

    setCommands((prev) => [...prev, newCommand])
    setCommandHistory((prev) => [...prev, cmd])
    setCurrentInput("")
    setHistoryIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (currentInput.trim()) {
        executeCommand(currentInput)
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCurrentInput("")
      }
    }
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [commands])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="h-full bg-black text-green-400 font-mono text-sm flex flex-col">
      <div ref={terminalRef} className="flex-1 overflow-y-auto p-4 space-y-2" onClick={() => inputRef.current?.focus()}>
        {commands.map((cmd, index) => (
          <div key={index}>
            {cmd.input && (
              <div className="flex items-center">
                <span className="text-green-500">{userProfile?.hacker_id || "root"}@hacksim-os:~$</span>
                <span className="ml-2">{cmd.input}</span>
              </div>
            )}
            {cmd.output.map((line, lineIndex) => (
              <div key={lineIndex} className="whitespace-pre-wrap">
                {line}
              </div>
            ))}
          </div>
        ))}

        {/* Current input line */}
        <div className="flex items-center">
          <span className="text-green-500">{userProfile?.hacker_id || "root"}@hacksim-os:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="ml-2 bg-transparent border-none outline-none flex-1 text-green-400"
            disabled={isInstalling}
            autoFocus
          />
          <span className="animate-pulse">█</span>
        </div>
      </div>

      <div className="p-2 border-t border-green-500/30 text-xs">
        <div className="text-green-300/70">
          IP: {userIP} | Tools: {installedTools.length} | Press TAB for autocomplete
        </div>
      </div>
    </div>
  )
}
