import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MainScene } from '../scenes/MainScene';
import { MissionControlScene } from '../scenes/MissionControlScene';
import { LoadingScene } from '../scenes/LoadingScene';

const Game: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      scale: {
        mode: Phaser.Scale.RESIZE,
        width: window.innerWidth,
        height: window.innerHeight,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        expandParent: true,
      },
      backgroundColor: '#000000',
      pixelArt: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: true,
          debugShowBody: true,
          debugShowStaticBody: true,
          debugBodyColor: 0xff00ff
        }
      },
      scene: [MainScene, MissionControlScene]
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div 
      ref={gameRef} 
      className="fixed inset-0 bg-black w-full h-full"
    />
  );
};

export default Game;