import { ScrollArea } from "./ui/scroll-area"
import { FileText } from 'lucide-react'

export function MissionDocs() {
  return (
    <div className="border border-green-500/30 rounded-lg p-4 flex-1">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-4 h-4" />
        <h2 className="text-sm font-bold">Mission Documentation</h2>
      </div>
      <ScrollArea className="h-[calc(100%-32px)]">
        <div className="space-y-4 text-sm">
          <section>
            <h3 className="text-green-500/70 mb-2">Mission Objective</h3>
            <p>Investigate potential security breach in the IT department. Recent logs show unusual access patterns.</p>
          </section>
          <section>
            <h3 className="text-green-500/70 mb-2">Required Data</h3>
            <ul className="list-disc list-inside space-y-1 text-green-500/90">
              <li>Employee access logs</li>
              <li>Network traffic data</li>
              <li>Security incident reports</li>
            </ul>
          </section>
          <section>
            <h3 className="text-green-500/70 mb-2">Success Criteria</h3>
            <p>Identify any unauthorized access attempts and compile a report of suspicious activities.</p>
          </section>
        </div>
      </ScrollArea>
    </div>
  )
} 