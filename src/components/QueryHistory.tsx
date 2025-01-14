import { ScrollArea } from "./ui/scroll-area"
import { History } from 'lucide-react'

export function QueryHistory() {
  const history = [
    { id: 1, prompt: "Show me all employees in IT department", timestamp: "10:45:23" },
    { id: 2, prompt: "Find suspicious login attempts", timestamp: "10:43:12" },
    { id: 3, prompt: "List financial transactions over $10000", timestamp: "10:40:55" },
  ]

  return (
    <div className="border border-green-500/30 rounded-lg p-4 h-[400px]">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-4 h-4" />
        <h2 className="text-sm font-bold">Query History</h2>
      </div>
      <ScrollArea className="h-[calc(100%-32px)]">
        <div className="space-y-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-2 rounded bg-green-500/5 hover:bg-green-500/10"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs text-green-500/50">{item.timestamp}</span>
              </div>
              <p className="text-sm">{item.prompt}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
} 