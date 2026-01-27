'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send, Bot, User } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIBallPosition {
  x: number
  y: number
  targetX: number
  targetY: number
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [ballPosition, setBallPosition] = useState<AIBallPosition>({
    x: 50,
    y: 50,
    targetX: 50,
    targetY: 50
  })
  const [isAIAnimating, setIsAIAnimating] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Animate the AI ball movement
  useEffect(() => {
    const animate = () => {
      setBallPosition(prev => {
        const dx = prev.targetX - prev.x
        const dy = prev.targetY - prev.y
        const speed = 0.05

        let newX = prev.x + dx * speed
        let newY = prev.y + dy * speed

        // Check if reached target
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
          newX = prev.targetX
          newY = prev.targetY
        }

        return {
          ...prev,
          x: newX,
          y: newY
        }
      })
    }

    const animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [])

  // Move AI ball when speaking or thinking
  useEffect(() => {
    if (isAIAnimating) {
      const interval = setInterval(() => {
        setBallPosition(prev => ({
          ...prev,
          targetX: Math.random() * 80 + 10, // Keep within 10-90%
          targetY: Math.random() * 60 + 10 // Keep within 10-70% (above chat)
        }))
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isAIAnimating])

  const moveAIBall = () => {
    setBallPosition(prev => ({
      ...prev,
      targetX: Math.random() * 80 + 10,
      targetY: Math.random() * 60 + 10
    }))
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setIsAIAnimating(true)
    moveAIBall()

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setIsAIAnimating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Lano IA</h1>
              <p className="text-sm text-purple-300">Sua assistente conversacional</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area with AI Ball */}
      <main className="flex-1 relative overflow-hidden">
        {/* AI Ball */}
        <div
          className="absolute transition-transform duration-300 cursor-pointer"
          style={{
            left: `${ballPosition.x}%`,
            top: `${ballPosition.y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 10
          }}
          onClick={moveAIBall}
        >
          <div
            className={`w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 
            shadow-2xl shadow-purple-500/50 flex items-center justify-center
            ${isAIAnimating ? 'animate-pulse' : ''}
            ${isLoading ? 'animate-bounce' : ''}
            transition-all duration-300 hover:scale-110`}
          >
            <Bot className="w-14 h-14 text-white" />
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/40 to-pink-500/40 blur-xl -z-10" />
        </div>

        {/* Click instruction */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center z-20">
          <p className="text-purple-300 text-sm bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
            🖱️ Clique na bolinha para movê-la!
          </p>
        </div>

        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pt-20">
            <Card className="bg-black/30 backdrop-blur-sm border-purple-500/30 max-w-md">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  Bem-vindo ao Lano IA! 👋
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-purple-200">
                  Eu sou sua assistente de IA com corpo! Você pode me ver como uma bolinha que se move pela tela.
                </p>
                <p className="text-purple-200">
                  Mande uma mensagem e vamos conversar! 💬
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Messages */}
        <div className="absolute inset-0 pt-32 pb-4 px-4 overflow-y-auto max-h-[60vh]">
          <div className="container mx-auto max-w-3xl space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                        : 'bg-gradient-to-br from-purple-500 to-pink-500'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <Card
                    className={`${
                      message.role === 'user'
                        ? 'bg-blue-600/30 border-blue-500/30'
                        : 'bg-purple-600/30 border-purple-500/30'
                    } backdrop-blur-sm`}
                  >
                    <CardContent className="py-3 px-4">
                      <p className="text-white whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                      <p className="text-xs text-white/50 mt-2">
                        {message.timestamp.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <Card className="bg-purple-600/30 border-purple-500/30 backdrop-blur-sm">
                    <CardContent className="py-3 px-4">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
      </main>

      {/* Chat Input */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-3 max-w-3xl mx-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              disabled={isLoading}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-purple-500"
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
