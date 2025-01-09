// src/scenes/MissionControlScene.ts
import Phaser from 'phaser';
import { PlayerState } from '../types/player';

export class MissionControlScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private playerState: PlayerState = {
    isMoving: false,
    targetX: 0,
    targetY: 0,
    gridSize: 32
  };
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private moveSpeed: number = 200;
  
  // Collision and interactive objects
  private walls!: Phaser.GameObjects.Group;
  private screens!: Phaser.GameObjects.Group;
  private workstations!: Phaser.GameObjects.Group;
  private podium!: Phaser.GameObjects.Rectangle;

  constructor() {
    super({ key: 'MissionControlScene' });
  }

  create(): void {
    this.createRoom();
    this.createPlayer();
    this.createInteractiveObjects();
    this.setupCollisions();
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Add interaction key (E)
    this.input.keyboard!.on('keydown-E', this.handleInteraction, this);
  }

  private createRoom(): void {
    // Create walls (simple rectangles for now)
    this.walls = this.add.group();
    
    // Top wall
    this.walls.add(this.add.rectangle(360, 16, 720, 32, 0x666666));
    // Bottom wall
    this.walls.add(this.add.rectangle(360, 464, 720, 32, 0x666666));
    // Left wall
    this.walls.add(this.add.rectangle(16, 240, 32, 480, 0x666666));
    // Right wall
    this.walls.add(this.add.rectangle(704, 240, 32, 480, 0x666666));
  }

  private createPlayer(): void {
    // Create player starting at the bottom center of the room
    this.player = this.add.rectangle(360, 400, 24, 24, 0x00ff00);
    this.playerState.targetX = this.player.x;
    this.playerState.targetY = this.player.y;
  }

  private createInteractiveObjects(): void {
    // Main screens wall (at the top)
    this.screens = this.add.group();
    for (let x = 96; x < 600; x += 160) {
      const screen = this.add.rectangle(x, 64, 140, 60, 0x000066);
      this.screens.add(screen);
      
      // Add glow effect
      const glowFX = screen.preFX?.addGlow(0x0000ff, 0, 0, false, 0.1, 16);
      if (glowFX) {
        this.tweens.add({
          targets: glowFX,
          outerStrength: 2,
          yoyo: true,
          repeat: -1,
          duration: 1500
        });
      }
    }

    // Workstations (tiered seating)
    this.workstations = this.add.group();
    for (let y = 160; y < 400; y += 80) {
      for (let x = 96; x < 600; x += 96) {
        const desk = this.add.rectangle(x, y, 80, 40, 0x333333);
        const terminal = this.add.rectangle(x, y - 10, 40, 20, 0x111111);
        this.workstations.add(desk);
        this.workstations.add(terminal);
      }
    }

    // Director's podium
    this.podium = this.add.rectangle(360, 120, 80, 40, 0x993300);
  }

  private setupCollisions(): void {
    this.walls.getChildren().forEach((wall: any) => {
      wall.setData('type', 'wall');
    });

    this.workstations.getChildren().forEach((station: any) => {
      station.setData('type', 'workstation');
    });

    this.podium.setData('type', 'podium');
  }

  private handleInteraction(): void {
    // Get objects near player
    const nearbyObjects = [...this.workstations.getChildren(), this.podium]
      .filter((obj: any) => {
        const distance = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          obj.x,
          obj.y
        );
        return distance < 48; // Interaction radius
      });

    if (nearbyObjects.length > 0) {
      const object = nearbyObjects[0] as Phaser.GameObjects.Rectangle;
      const type = object.getData('type');
      
      switch (type) {
        case 'workstation':
          console.log('Accessing workstation terminal...');
          // TODO: Open terminal interface
          break;
        case 'podium':
          console.log('Accessing director\'s podium...');
          // TODO: Show mission briefing
          break;
      }
    }
  }

  private canMove(targetX: number, targetY: number): boolean {
    // Check collision with walls
    let canMove = true;
    
    this.walls.getChildren().forEach((wall: any) => {
      if (Phaser.Geom.Rectangle.Contains(
        new Phaser.Geom.Rectangle(
          wall.x - wall.width/2,
          wall.y - wall.height/2,
          wall.width,
          wall.height
        ),
        targetX,
        targetY
      )) {
        canMove = false;
      }
    });

    return canMove;
  }

  update(): void {
    if (!this.playerState.isMoving) {
      const gridSize = this.playerState.gridSize;
      let newTargetX = this.playerState.targetX;
      let newTargetY = this.playerState.targetY;
      
      if (this.cursors.left.isDown) {
        newTargetX = this.player.x - gridSize;
      }
      else if (this.cursors.right.isDown) {
        newTargetX = this.player.x + gridSize;
      }
      else if (this.cursors.up.isDown) {
        newTargetY = this.player.y - gridSize;
      }
      else if (this.cursors.down.isDown) {
        newTargetY = this.player.y + gridSize;
      }

      if (this.canMove(newTargetX, newTargetY)) {
        this.playerState.targetX = newTargetX;
        this.playerState.targetY = newTargetY;
        this.playerState.isMoving = true;
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
}