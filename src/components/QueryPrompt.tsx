'use client'

import { useState } from 'react'
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { MessageSquare } from 'lucide-react'

export function QueryPrompt() {
  const [prompt, setPrompt] = useState('')
  const [sqlQuery, setSqlQuery] = useState('')
  const [queryResult, setQueryResult] = useState<any>(null)

  const handleSubmit = async () => {
    // TODO: Implement API call to convert natural language to SQL
    const mockSql = "SELECT * FROM employee_records WHERE department = 'IT'"
    setSqlQuery(mockSql)
    
    // TODO: Implement actual query execution
    setQueryResult([
      { id: 1, name: "John Doe", department: "IT" },
      { id: 2, name: "Jane Smith", department: "IT" },
    ])
  }

  return (
    <div className="border border-green-500/30 rounded-lg p-4 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-4 h-4" />
        <h2 className="text-sm font-bold">Query Interface</h2>
      </div>
      
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your natural language query..."
        className="flex-1 mb-4 bg-black border-green-500/30 text-green-500 resize-none"
      />

      {sqlQuery && (
        <div className="mb-4 p-2 bg-green-500/10 rounded">
          <p className="text-xs text-green-500/70">Generated SQL:</p>
          <code className="text-sm">{sqlQuery}</code>
        </div>
      )}

      {queryResult && (
        <div className="mb-4 p-2 bg-green-500/10 rounded">
          <p className="text-xs text-green-500/70">Result:</p>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(queryResult, null, 2)}
          </pre>
        </div>
      )}

      <Button 
        onClick={handleSubmit}
        className="self-end bg-green-500 text-black hover:bg-green-600"
      >
        Execute Query
      </Button>
    </div>
  )
} 