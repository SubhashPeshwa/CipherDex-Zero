'use client'

import { useState } from 'react'
import { ScrollArea } from "./ui/scroll-area"
import { TerminalIcon, Database, MessageSquare, FileText, Lightbulb } from 'lucide-react'
import { DatasetList } from './DatasetList'
import { QueryPrompt } from './QueryPrompt'
import { MissionDocs } from './MissionDocs'
import { QueryHistory } from './QueryHistory'
import { HintPanel } from './HintPanel'

interface TerminalProps {
  isVisible: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black text-green-500 p-4 font-mono overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 border-b border-green-500/30 pb-2 mb-4">
        <TerminalIcon className="w-5 h-5" />
        <h1 className="text-lg font-bold tracking-wider">NSA ANALYSIS TERMINAL v1.0.2</h1>
        <div className="ml-auto flex gap-2">
          <div className="size-3 rounded-full bg-red-500 animate-pulse" />
          <div className="size-3 rounded-full bg-yellow-500" />
          <div className="size-3 rounded-full bg-green-500" />
        </div>
      </div>

      {/* Main Terminal Content */}
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-80px)]">
        {/* Left Panel - Datasets & Mission Docs */}
        <div className="col-span-3 space-y-4">
          <DatasetList />
          <MissionDocs />
        </div>

        {/* Center Panel - Query Interface */}
        <div className="col-span-6">
          <QueryPrompt />
        </div>

        {/* Right Panel - History and Hints */}
        <div className="col-span-3 space-y-4">
          <QueryHistory />
          <HintPanel />
        </div>
      </div>
    </div>
  );
};

export default Terminal;