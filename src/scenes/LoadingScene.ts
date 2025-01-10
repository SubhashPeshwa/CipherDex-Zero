import Phaser from 'phaser';

export class LoadingScene extends Phaser.Scene {
  private characters: Phaser.GameObjects.Sprite[] = [];
  private startButton!: Phaser.GameObjects.Text;
  private title!: Phaser.GameObjects.Text;
  private charactersMoving: boolean = true;
  private targetY: number;

  constructor() {
    super({ key: 'LoadingScene' });
    this.targetY = 0; // Will be set in create()
  }

  preload(): void {
    // Load all character sprites
    ['player', 'player2', 'player3', 'player4'].forEach((key) => {
      this.load.spritesheet(key, `assets/${key}.png`, {
        frameWidth: 48,
        frameHeight: 48,
        spacing: 0
      });
    });
  }

  create(): void {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;
    
    // Set white background
    this.cameras.main.setBackgroundColor('#FFFFFF');

    // Add horizontal lines
    const lineCount = 8;
    const lineSpacing = 80;
    const lineWidth = this.cameras.main.width * 0.8;
    
    for (let i = 0; i < lineCount; i++) {
      this.add.rectangle(
        centerX,
        100 + (i * lineSpacing),
        lineWidth,
        2,
        0xEEEEEE
      );
    }

    // Add title text with custom font styling
    this.title = this.add.text(centerX, centerY, 'CIPHERDEX', {
      fontSize: '64px',
      fontFamily: 'Arial Black',
      color: '#000000'
    });
    this.title.setOrigin(0.5);

    // Calculate target Y position (just above the title)
    this.targetY = this.title.y - 100;

    // Create characters and their walk animations
    const characterKeys = ['player', 'player2', 'player3', 'player4'];
    characterKeys.forEach((key, index) => {
      const character = this.add.sprite(
        centerX - 150 + (index * 100),
        50, // Start from top
        key
      );
      character.setScale(1.5);
      
      // Create walk animation for each character
      this.anims.create({
        key: `walk-down-${key}`,
        frames: this.anims.generateFrameNumbers(key, { frames: [0, 4, 8, 12] }),
        frameRate: 8,
        repeat: -1
      });
      
      // Create idle animation
      this.anims.create({
        key: `idle-down-${key}`,
        frames: this.anims.generateFrameNumbers(key, { frames: [0] }),
        frameRate: 1,
        repeat: 0
      });
      
      character.play(`walk-down-${key}`);
      this.characters.push(character);
    });

    // Add start button
    this.startButton = this.add.text(centerX, centerY + 200, 'START MISSION', {
      fontSize: '32px',
      fontFamily: 'Arial Black',
      color: '#000000',
      padding: { x: 20, y: 10 }
    });
    this.startButton.setOrigin(0.5);
    this.startButton.setInteractive({ useHandCursor: true });
    
    // Add hover effect
    this.startButton.on('pointerover', () => {
      this.startButton.setStyle({ color: '#666666' });
    });
    
    this.startButton.on('pointerout', () => {
      this.startButton.setStyle({ color: '#000000' });
    });
    
    // Add click handler to start the game
    this.startButton.on('pointerdown', () => {
      this.scene.start('MainScene');
    });
  }

  update(): void {
    if (this.charactersMoving) {
      let allReachedTarget = true;
      
      // Move characters down slowly
      this.characters.forEach(character => {
        if (character.y < this.targetY) {
          character.y += 1;
          allReachedTarget = false;
        }
      });

      // If all characters reached target position, stop movement and switch to idle
      if (allReachedTarget) {
        this.charactersMoving = false;
        this.characters.forEach(character => {
          const key = character.texture.key;
          character.play(`idle-down-${key}`);
        });
      }
    }
  }
} 