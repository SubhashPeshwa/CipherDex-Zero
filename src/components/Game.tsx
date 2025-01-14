import React, { useRef, useEffect, useState } from 'react';
import Phaser from 'phaser';
import { MainScene } from '../scenes/MainScene';
import Settings from './Settings';
import Terminal from './Terminal';

interface GameState {
  game?: Phaser.Game;
  isSettingsVisible: boolean;
  isMusicMuted: boolean;
  isTerminalVisible: boolean;
}

const Game: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    isSettingsVisible: false,
    isMusicMuted: false,
    isTerminalVisible: false
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
          gravity: { x: 0, y: 0 }
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

    // Add event listeners for terminal
    const handleShowTerminal = () => {
      console.log('Show terminal');
      setGameState(prev => ({ ...prev, isTerminalVisible: true }));
    };

    const handleHideTerminal = () => {
      console.log('Hide terminal');
      setGameState(prev => ({ ...prev, isTerminalVisible: false }));
    };

    window.addEventListener('showTerminal', handleShowTerminal);
    window.addEventListener('hideTerminal', handleHideTerminal);

    return () => {
      game.destroy(true);
      window.removeEventListener('showTerminal', handleShowTerminal);
      window.removeEventListener('hideTerminal', handleHideTerminal);
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
      <Terminal isVisible={gameState.isTerminalVisible} />
    </>
  );
}

export default Game;