import React from 'react';
import Game from './components/Game';

const App: React.FC = () => {
  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: black;
        }
      `}</style>
      <div className="fixed inset-0 min-h-screen bg-black overflow-hidden">
        <Game />
      </div>
    </>
  );
};

export default App;