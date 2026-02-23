import { Bot } from 'lucide-react'

interface StreamingTextProps {
  content: string
}

export function StreamingText({ content }: StreamingTextProps) {
  return (
    <div className="flex gap-3">
      <div className="h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-muted animate-pulse">
        <Bot className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed bg-muted/50 text-foreground">
        {content || (
          <span className="flex gap-1 items-center text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
          </span>
        )}
        {content && <span className="inline-block w-0.5 h-3.5 bg-primary ml-0.5 animate-pulse" />}
      </div>
    </div>
  )
}
