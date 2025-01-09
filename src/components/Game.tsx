import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MainScene } from '../scenes/MainScene';
import { MissionControlScene } from '../scenes/MissionControlScene';

const Game: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      width: 240 * 3,
      height: 160 * 3,
      backgroundColor: '#000000',
      pixelArt: true,
      scene: [MissionControlScene]
    };

    const game = new Phaser.Game(config);

    const resizeGame = () => {
      if (!gameRef.current) return;

      const canvas = gameRef.current.querySelector('canvas');
      if (!canvas) return;

      const padding = 32; // Add some padding to prevent touching screen edges
      const maxWidth = window.innerWidth - padding;
      const maxHeight = window.innerHeight - padding;
      const windowRatio = maxWidth / maxHeight;
      const gameRatio = (240 * 3) / (160 * 3);
      
      let newWidth, newHeight;

      if (windowRatio < gameRatio) {
        // Window is taller than game ratio
        newWidth = maxWidth;
        newHeight = maxWidth / gameRatio;
      } else {
        // Window is wider than game ratio
        newHeight = maxHeight;
        newWidth = maxHeight * gameRatio;
      }

      canvas.style.width = `${newWidth}px`;
      canvas.style.height = `${newHeight}px`;
    };

    // Initial resize and event listener
    resizeGame();
    window.addEventListener('resize', resizeGame);

    return () => {
      window.removeEventListener('resize', resizeGame);
      game.destroy(true);
    };
  }, []);

  return (
    <div 
      ref={gameRef} 
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
    />
  );
};

export default Game;