import { ScrollArea } from "./ui/scroll-area"
import { Database } from 'lucide-react'

export function DatasetList() {
  const datasets = [
    { id: 1, name: "employee_records", size: "2.3MB" },
    { id: 2, name: "security_logs", size: "5.1MB" },
    { id: 3, name: "network_traffic", size: "8.7MB" },
    { id: 4, name: "financial_transactions", size: "3.2MB" },
  ]

  return (
    <div className="border border-green-500/30 rounded-lg p-4 h-[300px]">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-4 h-4" />
        <h2 className="text-sm font-bold">Available Datasets</h2>
      </div>
      <ScrollArea className="h-[calc(100%-32px)]">
        <div className="space-y-2">
          {datasets.map((dataset) => (
            <div
              key={dataset.id}
              className="flex items-center justify-between p-2 rounded hover:bg-green-500/10 cursor-pointer"
            >
              <span className="text-sm">{dataset.name}</span>
              <span className="text-xs text-green-500/50">{dataset.size}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
} 