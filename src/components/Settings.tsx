'use client'

import React from 'react';
import { createPortal } from 'react-dom';
import * as Dialog from '@radix-ui/react-dialog';

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

  const handleSave = () => {
    console.log('Settings saved:', { isMusicMuted });
    onClose();
  };

  return createPortal(
    <Dialog.Root open={isVisible} onOpenChange={onClose}>
      <Dialog.Portal container={portalRoot}>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content style={{
          backgroundColor: 'black',
          padding: '24px',
          borderRadius: '8px',
          border: '2px solid #00ff00',
          boxShadow: '0 0 20px rgba(0, 255, 0, 0.2)',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '500px',
          color: '#00ff00'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '300px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <Dialog.Title style={{ color: '#00ff00', fontSize: '24px' }}>
                Settings
              </Dialog.Title>
              <Dialog.Description style={{ color: '#00ff00' }}>
                Customize your CipherDex experience
              </Dialog.Description>
            </div>

            {/* Content */}
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Music Toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ color: '#00ff00', fontSize: '20px' }}>
                  Music
                </label>
                <button
                  onClick={onToggleMusic}
                  style={{
                    padding: '4px 16px',
                    color: '#00ff00',
                    border: '1px solid #00ff00',
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  {isMusicMuted ? 'OFF' : 'ON'}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '32px' }}>
              <button
                onClick={handleSave}
                style={{
                  width: '100%',
                  padding: '8px',
                  color: '#00ff00',
                  backgroundColor: 'transparent',
                  border: '1px solid #00ff00',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Save Settings
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>,
    portalRoot
  );
};

export default Settings; 