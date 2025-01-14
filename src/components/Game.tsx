import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { MainScene } from '../scenes/MainScene';
import Settings from './Settings';

interface GameState {
  isSettingsVisible: boolean;
  isMusicMuted: boolean;
  game?: Phaser.Game;
}

const Game: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    isSettingsVisible: false,
    isMusicMuted: false
  });

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
      scene: [MainScene]
    };

    const game = new Phaser.Game(config);
    setGameState(prev => ({ ...prev, game }));

    // Add event listeners for the game
    game.events.on('settingsOpened', (isVisible: boolean) => {
      console.log('Settings visibility changed:', isVisible);
      setGameState(prev => ({ ...prev, isSettingsVisible: isVisible }));
    });

    game.events.on('musicToggled', (isMuted: boolean) => {
      setGameState(prev => ({ ...prev, isMusicMuted: isMuted }));
    });

    return () => {
      game.destroy(true);
    };
  }, []);

  const handleCloseSettings = () => {
    setGameState(prev => ({ ...prev, isSettingsVisible: false }));
    // Notify the game scene
    const mainScene = gameState.game?.scene.getScene('MainScene') as MainScene;
    if (mainScene) {
      mainScene.closeSettings();
    }
  };

  const handleToggleMusic = () => {
    const mainScene = gameState.game?.scene.getScene('MainScene') as MainScene;
    if (mainScene) {
      mainScene.toggleGameMusic();
    }
  };

  return (
    <>
      <div 
        ref={gameRef} 
        className="w-full h-full"
      />
      <Settings
        isVisible={gameState.isSettingsVisible}
        onClose={handleCloseSettings}
        isMusicMuted={gameState.isMusicMuted}
        onToggleMusic={handleToggleMusic}
      />
    </>
  );
};

export default Game;