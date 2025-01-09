import React from 'react';
import Game from './components/Game';

const App: React.FC = () => {
  return (
    <div className="w-screen h-screen bg-gray-900 flex items-center justify-center">
      <Game />
    </div>
  );
};

export default App;