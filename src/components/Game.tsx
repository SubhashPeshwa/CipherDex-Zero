import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MainScene } from '../scenes/MainScene';

const Game: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      width: 240 * 3, // GBA resolution * 3
      height: 160 * 3,
      backgroundColor: '#000000',
      pixelArt: true,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: [MainScene]
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div ref={gameRef} className="game-container" />
      {/* Terminal overlay will go here */}
      <div className="absolute bottom-0 left-0 right-0 p-4 hidden">
        <div className="bg-terminal-black border border-terminal-green rounded-lg p-4">
          <div className="text-terminal-green font-mono">
            {/* Terminal content will go here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;