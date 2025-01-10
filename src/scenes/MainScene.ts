import Phaser from 'phaser';
import { PlayerState } from '../types/player';

export class MainScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private door!: Phaser.GameObjects.Rectangle;
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
    // Load the player sprite
    this.load.spritesheet('player', 'assets/player.png', {
      frameWidth: 48,
      frameHeight: 48,
      spacing: 0
    });
  }

  create(): void {
    // Create player sprite instead of rectangle
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;
    
    this.player = this.physics.add.sprite(centerX, centerY, 'player');
    this.player.setScale(1); // Scale up to take 2x2 grid squares
    
    // Adjust the collision bounds to match 2x2 grid squares but center the sprite
    this.player.body.setSize(0, 0); // Size of 1x1 grid square for tighter collision
    this.player.body.setOffset(0, 0); // Offset to center the collision box on the feet
    this.player.setOrigin(0, 0); // Adjust origin to center the full sprite including hair

    // Create animations for each direction
    this.anims.create({
      key: 'idle-down',
      frames: this.anims.generateFrameNumbers('player', { frames: [0] }),
      frameRate: 8,
      repeat: 0
    });

    this.anims.create({
      key: 'idle-up',
      frames: this.anims.generateFrameNumbers('player', { frames: [2] }),
      frameRate: 8,
      repeat: 0
    });

    this.anims.create({
      key: 'idle-side',
      frames: this.anims.generateFrameNumbers('player', { frames: [3] }),
      frameRate: 8,
      repeat: 0
    });

    this.anims.create({
      key: 'walk-down',
      frames: this.anims.generateFrameNumbers('player', { frames: [0, 4, 8, 12] }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'walk-up',
      frames: this.anims.generateFrameNumbers('player', { frames: [2, 6, 10, 14] }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'walk-side',
      frames: this.anims.generateFrameNumbers('player', { frames: [3, 7, 11, 15 ] }),
      frameRate: 8,
      repeat: -1
    });

    // Play idle-down animation by default
    this.player.play('idle-down');

    // Create door (brown rectangle)
    this.door = this.add.rectangle(
      centerX + 128, // Position the door to the right of center
      centerY,
      32,
      48,
      0x8B4513 // Brown color
    );

    // Initialize cursor keys
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Snap player to grid on start
    this.snapToGrid(this.player);
    this.playerState.targetX = this.player.x;
    this.playerState.targetY = this.player.y;

    this.createDebugGrid();

    // Check for door overlap
    this.checkDoorOverlap();
  }

  private checkDoorOverlap(): void {
    if (!this.playerState.isMoving) {
      const bounds1 = this.player.getBounds();
      const bounds2 = this.door.getBounds();

      if (Phaser.Geom.Intersects.RectangleToRectangle(bounds1, bounds2)) {
        // Transition to MissionControlScene
        this.scene.start('MissionControlScene', { 
          fromDoor: true,
          playerX: 360, // Starting position in mission control
          playerY: 400  // Near bottom of the room
        });
      }
    }
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

  private snapToGrid(gameObject: Phaser.GameObjects.Sprite): void {
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
    // Existing movement code
    if (!this.playerState.isMoving) {
      const gridSize = this.playerState.gridSize;
      let newTargetX = this.player.x;
      let newTargetY = this.player.y;
      let isMovementKeyPressed = false;
      let newAnimation = '';
      
      if (this.cursors.left.isDown) {
        newTargetX = this.player.x - gridSize;
        newAnimation = 'walk-side';
        isMovementKeyPressed = true;
        this.player.setFlipX(true);
      }
      else if (this.cursors.right.isDown) {
        newTargetX = this.player.x + gridSize;
        newAnimation = 'walk-side';
        isMovementKeyPressed = true;
        this.player.setFlipX(false);
      }
      else if (this.cursors.up.isDown) {
        newTargetY = this.player.y - gridSize;
        newAnimation = 'walk-up';
        isMovementKeyPressed = true;
      }
      else if (this.cursors.down.isDown) {
        newTargetY = this.player.y + gridSize;
        newAnimation = 'walk-down';
        isMovementKeyPressed = true;
      }

      // Check if the new position would be within bounds
      const halfWidth = this.player.body.width / 2;
      const halfHeight = this.player.body.height / 2;
      const margin = 0;

      if (isMovementKeyPressed &&
          newTargetX >= margin + halfWidth && 
          newTargetX <= this.cameras.main.width - margin - halfWidth &&
          newTargetY >= margin + halfHeight && 
          newTargetY <= this.cameras.main.height - margin - halfHeight) {
        this.playerState.targetX = newTargetX;
        this.playerState.targetY = newTargetY;
        this.playerState.isMoving = true;
        this.player.play(newAnimation, true);
      } else if (!isMovementKeyPressed) {
        // Set idle animation based on last movement
        const currentAnim = this.player.anims.currentAnim?.key || '';
        if (currentAnim.includes('down')) {
          this.player.play('idle-down', true);
        } else if (currentAnim.includes('up')) {
          this.player.play('idle-up', true);
        } else if (currentAnim.includes('side')) {
          this.player.play('idle-side', true);
        } else {
          this.player.play('idle-down', true); // Default idle
        }
      }
    }

    this.moveTowardTarget();
    this.checkDoorOverlap();
  }
}