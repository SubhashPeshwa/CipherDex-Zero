import Phaser from 'phaser';
import { PlayerState } from '../types/player';

export class MainScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private playerState: PlayerState = {
    isMoving: false,
    targetX: 0,
    targetY: 0,
    gridSize: 32 // Size of each grid cell
  };
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private moveSpeed: number = 200; // Pixels per second

  constructor() {
    super({ key: 'MainScene' });
  }

  preload(): void {
    // We'll load actual sprites here later
  }

  create(): void {
    // Create a simple rectangle as the player for now
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;
    
    this.player = this.add.rectangle(
      centerX,
      centerY,
      24, // Player width (smaller than grid)
      24, // Player height
      0x00ff00 // Green color
    );

    // Initialize cursor keys
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Snap player to grid on start
    this.snapToGrid(this.player);
    this.playerState.targetX = this.player.x;
    this.playerState.targetY = this.player.y;

    // Add debug grid (helpful during development)
    this.createDebugGrid();
  }

  private createDebugGrid(): void {
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x333333, 0.5);

    // Draw vertical lines
    for (let x = 0; x < this.cameras.main.width; x += this.playerState.gridSize) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, this.cameras.main.height);
    }

    // Draw horizontal lines
    for (let y = 0; y < this.cameras.main.height; y += this.playerState.gridSize) {
      graphics.moveTo(0, y);
      graphics.lineTo(this.cameras.main.width, y);
    }

    graphics.stroke();
  }

  private snapToGrid(gameObject: Phaser.GameObjects.Rectangle): void {
    const gridSize = this.playerState.gridSize;
    gameObject.x = Math.round(gameObject.x / gridSize) * gridSize;
    gameObject.y = Math.round(gameObject.y / gridSize) * gridSize;
  }

  private moveTowardTarget(): void {
    if (!this.playerState.isMoving) return;

    const distance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.playerState.targetX,
      this.playerState.targetY
    );

    if (distance < 2) {
      // Snap to grid when very close to target
      this.player.x = this.playerState.targetX;
      this.player.y = this.playerState.targetY;
      this.playerState.isMoving = false;
      return;
    }

    const angle = Phaser.Math.Angle.Between(
      this.player.x,
      this.player.y,
      this.playerState.targetX,
      this.playerState.targetY
    );

    const speed = this.moveSpeed;
    const deltaTime = this.game.loop.delta / 1000; // Convert to seconds

    this.player.x += Math.cos(angle) * speed * deltaTime;
    this.player.y += Math.sin(angle) * speed * deltaTime;
  }

  update(): void {
    // Only accept new movement input when not already moving
    if (!this.playerState.isMoving) {
      const gridSize = this.playerState.gridSize;
      
      if (this.cursors.left.isDown) {
        this.playerState.targetX = this.player.x - gridSize;
        this.playerState.isMoving = true;
      }
      else if (this.cursors.right.isDown) {
        this.playerState.targetX = this.player.x + gridSize;
        this.playerState.isMoving = true;
      }
      else if (this.cursors.up.isDown) {
        this.playerState.targetY = this.player.y - gridSize;
        this.playerState.isMoving = true;
      }
      else if (this.cursors.down.isDown) {
        this.playerState.targetY = this.player.y + gridSize;
        this.playerState.isMoving = true;
      }
    }

    this.moveTowardTarget();
  }
}