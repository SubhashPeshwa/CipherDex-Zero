// src/scenes/MissionControlScene.ts
import Phaser from 'phaser';
import { PlayerState } from '../types/player';

export class MissionControlScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private playerState: PlayerState = {
    isMoving: false,
    targetX: 0,
    targetY: 0,
    gridSize: 32
  };
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private moveSpeed: number = 200;
  private playerStartX: number = 64;
  private playerStartY: number = 240;
  
  // Collision and interactive objects
  private walls!: Phaser.GameObjects.Group;
  private screen!: Phaser.GameObjects.Rectangle;
  private workstations!: Phaser.GameObjects.Group;
  private podium!: Phaser.GameObjects.Rectangle;

  constructor() {
    super({ key: 'MissionControlScene' });
  }

  init(data: { fromDoor?: boolean; playerX?: number; playerY?: number }): void {
    if (data.fromDoor) {
      this.playerStartX = 80;
      this.playerStartY = 240;
    }
  }

  create(): void {
    this.createRoom();
    this.createPlayer();
    this.createInteractiveObjects();
    this.setupCollisions();
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Add door on the left wall
    const returnDoor = this.add.rectangle(32, 240, 48, 32, 0x8B4513);
    returnDoor.setData('type', 'door');
  }

  private createRoom(): void {
    // Create walls (simple rectangles for now)
    this.walls = this.add.group();
    
    // Create wall rectangles with physics bodies
    const walls = [
      // Top wall
      this.add.rectangle(360, 8, 720, 16, 0x666666),
      // Bottom wall
      this.add.rectangle(360, 472, 720, 16, 0x666666),
      // Left wall - split for door
      this.add.rectangle(8, 120, 16, 240, 0x666666),
      this.add.rectangle(8, 360, 16, 240, 0x666666),
      // Right wall
      this.add.rectangle(712, 240, 16, 480, 0x666666)
    ];

    // Add physics bodies to walls
    walls.forEach(wall => {
      this.physics.add.existing(wall, true); // true makes it static
      this.walls.add(wall);
    });
  }

  private createPlayer(): void {
    this.player = this.physics.add.sprite(
      this.playerStartX,
      this.playerStartY,
      'player'
    );
    this.player.setScale(1);

    // Set proper collision box size
    this.player.body.setSize(32, 32);  // Match grid size
    this.player.body.setOffset(8, 8);  // Center the collision box

    // Just play the initial animation
    this.player.play('idle-down');
    
    this.playerState.targetX = this.player.x;
    this.playerState.targetY = this.player.y;
  }

  private createInteractiveObjects(): void {
    // Main screen
    this.screen = this.add.rectangle(360, 80, 600, 120, 0x000066);
    this.physics.add.existing(this.screen, true);
    
    // Workstations
    this.workstations = this.add.group();
    const rows = [280, 400];
    const desksPerRow = 4;
    
    rows.forEach(y => {
      for (let i = 0; i < desksPerRow; i++) {
        const x = 160 + (i * 160);
        const desk = this.add.rectangle(x, y, 80, 40, 0x333333);
        const terminal = this.add.rectangle(x, y - 10, 40, 20, 0x111111);
        
        // Add physics bodies to both desk and terminal
        this.physics.add.existing(desk, true);
        this.physics.add.existing(terminal, true);
        
        this.workstations.add(desk);
        this.workstations.add(terminal);
      }
    });

    // Director's podium
    this.podium = this.add.rectangle(360, 160, 80, 40, 0x993300);
    this.physics.add.existing(this.podium, true);
  }

  private setupCollisions(): void {
    this.walls.getChildren().forEach((wall: any) => {
      wall.setData('type', 'wall');
    });

    this.workstations.getChildren().forEach((station: any) => {
      station.setData('type', 'workstation');
    });

    this.podium.setData('type', 'podium');
    this.screen.setData('type', 'screen');
  }

  private canMove(targetX: number, targetY: number): boolean {
    // Create a temporary rectangle representing the player's next position
    // Center the bounds calculation on the target position
    const playerBounds = new Phaser.Geom.Rectangle(
      targetX - this.player.body.width/2,
      targetY - this.player.body.height/2,
      this.player.body.width,
      this.player.body.height
    );

    let canMove = true;
    
    // Check walls
    this.walls.getChildren().forEach((wall: any) => {
      const wallBounds = new Phaser.Geom.Rectangle(
        wall.x - wall.width/2,
        wall.y - wall.height/2,
        wall.width,
        wall.height
      );
      if (Phaser.Geom.Rectangle.Overlaps(playerBounds, wallBounds)) {
        canMove = false;
      }
    });

    // Check workstations
    this.workstations.getChildren().forEach((station: any) => {
      const stationBounds = new Phaser.Geom.Rectangle(
        station.x - station.width/2,
        station.y - station.height/2,
        station.width,
        station.height
      );
      if (Phaser.Geom.Rectangle.Overlaps(playerBounds, stationBounds)) {
        canMove = false;
      }
    });

    // Check podium
    const podiumBounds = new Phaser.Geom.Rectangle(
      this.podium.x - this.podium.width/2,
      this.podium.y - this.podium.height/2,
      this.podium.width,
      this.podium.height
    );
    if (Phaser.Geom.Rectangle.Overlaps(playerBounds, podiumBounds)) {
      canMove = false;
    }

    // Check screen
    const screenBounds = new Phaser.Geom.Rectangle(
      this.screen.x - this.screen.width/2,
      this.screen.y - this.screen.height/2,
      this.screen.width,
      this.screen.height
    );
    if (Phaser.Geom.Rectangle.Overlaps(playerBounds, screenBounds)) {
      canMove = false;
    }

    return canMove;
  }

  update(): void {
    if (!this.playerState.isMoving) {
      const gridSize = this.playerState.gridSize;
      let newTargetX = this.playerState.targetX;
      let newTargetY = this.playerState.targetY;
      let isMovementKeyPressed = false;
      let newAnimation = '';
      
      if (this.cursors.left.isDown) {
        newTargetX = this.player.x - gridSize;
        newAnimation = 'walk-side';
        this.player.setFlipX(true);
        isMovementKeyPressed = true;
      }
      else if (this.cursors.right.isDown) {
        newTargetX = this.player.x + gridSize;
        newAnimation = 'walk-side';
        this.player.setFlipX(false);
        isMovementKeyPressed = true;
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

      if (this.canMove(newTargetX, newTargetY) && isMovementKeyPressed) {
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

    // Move toward target
    if (this.playerState.isMoving) {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.playerState.targetX,
        this.playerState.targetY
      );

      if (distance < 2) {
        this.player.x = this.playerState.targetX;
        this.player.y = this.playerState.targetY;
        this.playerState.isMoving = false;
        
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

        // Check for door overlap after movement completes
        const doorDistance = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          32,
          240
        );

        if (doorDistance < 32) {
          this.scene.start('MainScene');
        }
      } else {
        const angle = Phaser.Math.Angle.Between(
          this.player.x,
          this.player.y,
          this.playerState.targetX,
          this.playerState.targetY
        );

        const speed = this.moveSpeed;
        const deltaTime = this.game.loop.delta / 1000;

        this.player.x += Math.cos(angle) * speed * deltaTime;
        this.player.y += Math.sin(angle) * speed * deltaTime;
      }
    }
  }

  preload(): void {
    // Load the player sprite if not already loaded
    this.load.spritesheet('player', 'assets/player.png', {
      frameWidth: 48,
      frameHeight: 48,
      spacing: 0
    });
  }
}