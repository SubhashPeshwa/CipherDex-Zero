import React from 'react';
import Game from './components/Game';

const App: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 overflow-hidden">
      <Game />
    </div>
  );
};

export default App;