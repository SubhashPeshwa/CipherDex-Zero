import React from 'react';
import Game from './components/Game';

const App: React.FC = () => {
  return (
    <>
      <style>{`
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        #portal-root {
          position: fixed;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        #portal-root > * {
          pointer-events: auto;
        }
      `}</style>
      <div id="portal-root" />
      <div className="w-full h-screen bg-black overflow-hidden">
        <Game />
      </div>
    </>
  );
};

export default App;