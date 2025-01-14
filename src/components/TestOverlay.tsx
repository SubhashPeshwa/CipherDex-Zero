import React from 'react';
import { createPortal } from 'react-dom';

interface TestOverlayProps {
  isVisible: boolean;
}

const TestOverlay: React.FC<TestOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  const portalRoot = document.getElementById('portal-root');
  if (!portalRoot) return null;

  return createPortal(
    <div 
      className="fixed inset-0 flex items-center justify-center"
      style={{ 
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
        zIndex: 99999
      }}
    >
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold">Test Overlay</h2>
        <p>If you can see this, the portal is working!</p>
      </div>
    </div>,
    portalRoot
  );
};

export default TestOverlay; 