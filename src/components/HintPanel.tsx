import { ScrollArea } from "./ui/scroll-area"
import { Lightbulb } from 'lucide-react'

export function HintPanel() {
  const hints = [
    {
      id: 1,
      title: "Query Suggestion",
      content: "Try joining employee_records with security_logs using employee_id.",
    },
    {
      id: 2,
      title: "Remember",
      content: "Look for access attempts outside normal working hours.",
    },
  ]

  return (
    <div className="border border-green-500/30 rounded-lg p-4 h-[calc(100vh-580px)]">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-4 h-4" />
        <h2 className="text-sm font-bold">Hints & Tips</h2>
      </div>
      <ScrollArea className="h-[calc(100%-32px)]">
        <div className="space-y-4">
          {hints.map((hint) => (
            <div key={hint.id} className="p-3 rounded bg-green-500/5">
              <h3 className="text-sm font-bold mb-2">{hint.title}</h3>
              <p className="text-sm text-green-500/70">{hint.content}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
} 