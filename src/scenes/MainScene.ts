import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload(): void {
    // Asset loading will go here
  }

  create(): void {
    const text = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'CipherDex: Zero',
      {
        fontSize: '32px',
        color: '#ffffff'
      }
    );
    text.setOrigin(0.5);
  }

  update(): void {
    // Game loop logic will go here
  }
}
