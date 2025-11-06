import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from './AuthProvider'

interface SupportBotModalProps {
  onClose: () => void
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function SupportBotModal({ onClose }: SupportBotModalProps) {
  const [showConfirmation, setShowConfirmation] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Generate or retrieve anonymous ID for unauthenticated users
  useEffect(() => {
    if (!user) {
      let storedId = sessionStorage.getItem('support_bot_anonymous_id')
      if (!storedId) {
        storedId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        sessionStorage.setItem('support_bot_anonymous_id', storedId)
      }
    }
  }, [user])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleConfirm = () => {
    setShowConfirmation(false)
  }

  const handleSend = async (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation() // Prevent event bubbling
    }
    
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    
    // Capture current messages BEFORE updating state (React state is async)
    const currentMessages = [...messages]
    
    // Add user message to UI immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      // Get Supabase configuration
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      // Check if Supabase is configured
      const isConfigured = supabaseUrl && 
                          supabaseUrl !== 'https://placeholder.supabase.co' && 
                          supabaseKey && 
                          supabaseKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder'

      if (!isConfigured) {
        // Demo mode - simulate therapist response
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const lowerMessage = userMessage.toLowerCase()
        let demoResponse = "I hear you, and I want you to know that your feelings are valid. "
        
        if (lowerMessage.includes('overwhelmed') || lowerMessage.includes('stress')) {
          demoResponse += "It sounds like you're carrying a lot right now. Can you tell me more about what's making you feel this way? Sometimes just talking about it can help lighten the load."
        } else if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) {
          demoResponse += "I'm sorry you're going through this. It takes courage to share these feelings. What's been weighing on your heart lately?"
        } else if (lowerMessage.includes('anxious') || lowerMessage.includes('worried')) {
          demoResponse += "Anxiety can feel really overwhelming. Let's take this one step at a time. What specific situation or thought is causing you to feel this way?"
        } else if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated')) {
          demoResponse += "Anger is a natural emotion, and it's okay to feel it. What's behind these feelings? Understanding what's triggering this can help us work through it together."
        } else {
          demoResponse += "Thank you for sharing this with me. I'm here to listen without judgment. Can you help me understand more about what you're experiencing?"
        }
        
        setMessages(prev => [...prev, { role: 'assistant', content: demoResponse }])
        setLoading(false)
        return
      }

      // Real mode - call OpenAI API via edge function
      // Send conversation history WITHOUT the current message (edge function will add it)
      console.log('Sending request with conversation history:', currentMessages.length, 'messages')
      
      const response = await fetch(`${supabaseUrl}/functions/v1/support-bot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: currentMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      
      console.log('Received response from API:', result.success, result.response?.substring(0, 50))
      
      if (result.success && result.response) {
        setMessages(prev => {
          // Ensure we don't duplicate messages
          const lastMessage = prev[prev.length - 1]
          if (lastMessage && lastMessage.role === 'user' && lastMessage.content === userMessage) {
            // User message is already there, just add assistant response
            return [...prev, { role: 'assistant', content: result.response }]
          }
          // If user message is missing, add both
          return [...prev, { role: 'assistant', content: result.response }]
        })
      } else {
        throw new Error(result.error || 'Unknown error from support bot')
      }
    } catch (error: any) {
      console.error('Support bot error:', error)
      
      // Fallback to demo response on error
      await new Promise(resolve => setTimeout(resolve, 1000))
      const fallbackResponse = "I'm here to listen and support you. I understand you're going through something. Could you tell me more about what's on your mind? We can work through this together."
      setMessages(prev => [...prev, { role: 'assistant', content: fallbackResponse }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full my-8 max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-border px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-primary">Therapist Chatbot</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-primary transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {showConfirmation ? (
            /* Confirmation Dialog */
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center space-y-6">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-3xl font-bold text-primary">You want to talk?</h3>
                <p className="text-muted-foreground text-lg">
                  Start a conversation with your AI therapist chatbot. I'm here to listen and support you.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    <strong>Disclaimer:</strong> This is not professional therapy. Please reach out to a certified professional for immediate support.
                  </p>
                </div>
                <div className="flex gap-4 justify-center mt-8">
                  <button
                    onClick={handleConfirm}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium text-lg"
                  >
                    Yes, Let's Talk
                  </button>
                  <button
                    onClick={onClose}
                    className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-foreground rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-lg"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Chat Interface */
            <>
              <div
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900"
              >
                {/* Safety Disclaimer */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    <strong>Disclaimer:</strong> This is not professional therapy. For crisis help, contact local helplines.
                  </p>
                </div>

                {messages.length === 0 && !loading && (
                  <div className="text-center text-muted-foreground py-8">
                    <p className="text-lg">Start a conversation with your therapist chatbot...</p>
                    <p className="text-sm mt-2">Share what's on your mind, and I'll listen and help you reflect.</p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg p-4 ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white dark:bg-gray-800 border border-border'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-800 border border-border rounded-lg p-4">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0.1s' }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form 
                onSubmit={handleSend} 
                className="border-t border-border p-4 bg-white dark:bg-gray-800"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => {
                      e.stopPropagation()
                      setInput(e.target.value)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        e.stopPropagation()
                        handleSend(e as any)
                      }
                    }}
                    disabled={loading}
                    className="flex-1 px-4 py-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    placeholder="Type your message..."
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleSend(e as any)
                    }}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
