import { useState, useRef, useEffect } from 'react'
import { Bot } from 'lucide-react'
import type { Content } from 'firebase/ai'
import { tutorModel, buildChatHistory } from '@/lib/gemini'
import { PageShell } from '@/components/layout/PageShell'
import { ChatMessage } from '@/components/tutor/ChatMessage'
import { ChatInput } from '@/components/tutor/ChatInput'
import { StreamingText } from '@/components/tutor/StreamingText'
import type { ChatMessage as ChatMessageType } from '@/types'

const STARTER_PROMPTS = [
  'How do I hold a guitar pick?',
  'What are the most important beginner chords?',
  'How do I improve my chord transitions?',
  'What is alternate picking?',
]

let messageCounter = 0
function nextId() { return String(++messageCounter) }

export default function Tutor() {
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  async function sendMessage(text: string) {
    const userMsg: ChatMessageType = {
      id: nextId(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setIsStreaming(true)
    setStreamingContent('')

    try {
      const history = buildChatHistory(newMessages.map((m) => ({ role: m.role, content: m.content }))) as Content[]
      const chat = tutorModel.startChat({ history })
      const stream = await chat.sendMessageStream(text)

      let accumulated = ''
      for await (const chunk of stream.stream) {
        const text = chunk.text()
        accumulated += text
        setStreamingContent(accumulated)
      }

      const assistantMsg: ChatMessageType = {
        id: nextId(),
        role: 'assistant',
        content: accumulated,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (err) {
      console.error('Tutor chat error:', err)
      setMessages((prev) => [...prev, {
        id: nextId(),
        role: 'assistant',
        content: 'Sorry, I ran into an error. Please try again.',
        timestamp: new Date(),
      }])
    } finally {
      setIsStreaming(false)
      setStreamingContent('')
    }
  }

  return (
    <PageShell>
      <div className="flex flex-col h-[calc(100vh-4rem)] max-w-2xl mx-auto">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border/40">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            AI Guitar Tutor
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Ask anything about guitar — technique, theory, practice advice
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {messages.length === 0 && !isStreaming && (
            <div className="flex flex-col items-center justify-center flex-1 gap-6 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Your guitar coach is ready</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Ask a question, or try one of these:
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {STARTER_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    className="text-xs px-3 py-2 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => <ChatMessage key={m.id} message={m} />)}
          {isStreaming && <StreamingText content={streamingContent} />}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/40">
          <ChatInput onSend={sendMessage} disabled={isStreaming} />
        </div>
      </div>
    </PageShell>
  )
}
