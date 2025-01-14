import React from 'react';
import { createPortal } from 'react-dom';

interface SettingsProps {
  isVisible: boolean;
  onClose: () => void;
  isMusicMuted: boolean;
  onToggleMusic: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isVisible, onClose, isMusicMuted, onToggleMusic }) => {
  if (!isVisible) return null;

  const portalRoot = document.getElementById('portal-root');
  if (!portalRoot) return null;

  return createPortal(
    <div 
      className="absolute top-0 left-0 w-screen h-screen flex items-center justify-center"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 99999
      }}
      onClick={onClose}
    >
      <div 
        className="bg-black border-4 border-white w-[300px] p-4"
        style={{
          imageRendering: 'pixelated',
          boxShadow: '0 0 0 4px #000',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 pb-2 border-b-4 border-white">
          <h2 className="text-2xl text-white font-bold" style={{ fontFamily: 'monospace' }}>SETTINGS</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 px-2"
            style={{ fontFamily: 'monospace' }}
          >
            [X]
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between bg-black p-2 border-2 border-white">
            <span className="text-white text-lg" style={{ fontFamily: 'monospace' }}>MUSIC</span>
            <button
              onClick={onToggleMusic}
              className="border-2 border-white px-2 py-1 min-w-[60px] text-white hover:bg-white hover:text-black transition-colors"
              style={{ fontFamily: 'monospace' }}
            >
              {isMusicMuted ? 'OFF' : 'ON'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    portalRoot
  );
};

export default Settings; 