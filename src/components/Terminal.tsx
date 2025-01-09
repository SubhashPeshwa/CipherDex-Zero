import React from 'react';

interface TerminalProps {
  isVisible: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <div className="bg-terminal-black border border-terminal-green rounded-lg p-4 shadow-lg">
        <div className="text-terminal-green font-mono">
          <div className="flex items-center">
            <span className="text-terminal-green">&gt;</span>
            <input 
              type="text"
              className="ml-2 w-full bg-transparent border-none outline-none text-terminal-green font-mono"
              placeholder="Enter your query..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;