import { Bot, User } from 'lucide-react'
import type { ChatMessage as ChatMessageType } from '@/types'

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5
        ${isUser ? 'bg-primary/20' : 'bg-muted'}`}
      >
        {isUser
          ? <User className="h-3.5 w-3.5 text-primary" />
          : <Bot className="h-3.5 w-3.5 text-muted-foreground" />
        }
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
        ${isUser
          ? 'bg-primary text-primary-foreground rounded-tr-sm'
          : 'bg-muted/50 text-foreground rounded-tl-sm'}`}
      >
        {message.content.split('\n').map((line, i) => (
          <span key={i}>
            {i > 0 && <br />}
            {line}
          </span>
        ))}
      </div>
    </div>
  )
}
