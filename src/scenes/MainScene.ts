import Phaser from 'phaser';
import { PlayerState } from '../types/player';

export class MainScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private playerState: PlayerState = {
    isMoving: false,
    targetX: 0,
    targetY: 0,
    gridSize: 32
  };
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private moveSpeed: number = 400;
  private map!: Phaser.Tilemaps.Tilemap;
  private minimapCamera!: Phaser.Cameras.Scene2D.Camera;
  private minimapBorder!: Phaser.GameObjects.Graphics;
  private minimapContainer!: Phaser.GameObjects.Container;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private interactiveObjects!: Phaser.GameObjects.Group;
  private dialogBox!: Phaser.GameObjects.Container;
  private isDialogVisible: boolean = false;

  // Tileset properties
  private tileset!: Phaser.Tilemaps.Tileset;
  private objectsTileset!: Phaser.Tilemaps.Tileset;
  private objects2Tileset!: Phaser.Tilemaps.Tileset;
  private rotaryPhonesTileset!: Phaser.Tilemaps.Tileset;
  private waterCoolerTileset!: Phaser.Tilemaps.Tileset;
  private tvWidescreenTileset!: Phaser.Tilemaps.Tileset;
  private sciFiDecorTileset!: Phaser.Tilemaps.Tileset;
  private megaPixelIconsTileset!: Phaser.Tilemaps.Tileset;
  private laptopTileset!: Phaser.Tilemaps.Tileset;
  private freePixelTileset!: Phaser.Tilemaps.Tileset;
  private deskOrnateTileset!: Phaser.Tilemaps.Tileset;
  private copyMachineTileset!: Phaser.Tilemaps.Tileset;
  private cardTableTileset!: Phaser.Tilemaps.Tileset;
  private pixelOfficeTileset!: Phaser.Tilemaps.Tileset;
  private officeTilesTileset!: Phaser.Tilemaps.Tileset;
  private office2Tileset!: Phaser.Tilemaps.Tileset;
  private office3Tileset!: Phaser.Tilemaps.Tileset;
  private office4Tileset!: Phaser.Tilemaps.Tileset;
  private officeMainTileset!: Phaser.Tilemaps.Tileset;
  // Floor tile properties
  private floorPurpleTileset!: Phaser.Tilemaps.Tileset;
  private floorPinkTileset!: Phaser.Tilemaps.Tileset;
  private floorGreenTileset!: Phaser.Tilemaps.Tileset;
  private floorGrayTileset!: Phaser.Tilemaps.Tileset;
  private floorBrownTileset!: Phaser.Tilemaps.Tileset;

  // Layer properties
  private baseLayer!: Phaser.Tilemaps.TilemapLayer;
  private floor2Layer!: Phaser.Tilemaps.TilemapLayer;
  private floorLayer!: Phaser.Tilemaps.TilemapLayer;
  private furnitureLayer!: Phaser.Tilemaps.TilemapLayer;
  private objectsLayer!: Phaser.Tilemaps.TilemapLayer;
  private collisionLayer!: Phaser.Tilemaps.TilemapLayer;
  private interactiveLayer!: Phaser.Tilemaps.TilemapLayer;

  private enterKey!: Phaser.Input.Keyboard.Key;
  private escapeKey!: Phaser.Input.Keyboard.Key;

  private npcs: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = [];

  constructor() {
    super({ key: 'MainScene' });
  }

  preload(): void {
    // Load the tilemap and tileset
    this.load.tilemapTiledJSON('lobby_map', 'assets/lobby_map.json');
    this.load.image('lobby_tileset', 'assets/office-tileset.png');
    this.load.image('objects', 'assets/objects.png');
    this.load.image('objects2', 'assets/objects2.png');
    
    // Load additional tileset images
    this.load.image('rotary_phones', 'assets/items/Rotary Phones.png');
    this.load.image('water_cooler', 'assets/items/Water Cooler.png');
    this.load.image('tv_widescreen', 'assets/items/TV, Widescreen.png');
    this.load.image('sci_fi_decor', 'assets/items/sci fi (decor assets) assets.png');
    this.load.image('mega_pixel_icons', 'assets/items/MegaPixelArt32x32pxIcons_SpriteSheet.png');
    this.load.image('laptop', 'assets/items/Laptop.png');
    this.load.image('free_pixel', 'assets/items/FreePixel.png');
    this.load.image('desk_ornate', 'assets/items/Desk, Ornate.png');
    this.load.image('copy_machine', 'assets/items/Copy Machine.png');
    this.load.image('card_table', 'assets/items/Card Table.png');
    this.load.image('pixel_office', 'assets/items/PixelOfficeAssets.png');
    this.load.image('office_tiles', 'assets/items/GK_JO_C.png');
    this.load.image('office2', 'assets/items/GK_JO_B.png');
    this.load.image('office3', 'assets/items/GK_JO_A5.png');
    this.load.image('office4', 'assets/items/GK_JO_A2.png');
    this.load.image('office_main', 'assets/items/MainTileMap.png');

    // Load floor tile images
    this.load.image('floor_purple', 'assets/items/Purple.png');
    this.load.image('floor_pink', 'assets/items/Pink.png');
    this.load.image('floor_green', 'assets/items/Green.png');
    this.load.image('floor_gray', 'assets/items/Gray.png');
    this.load.image('floor_brown', 'assets/items/Brown.png');

    // Load NPC spritesheets
    this.load.spritesheet('player2', 'assets/player2.png', {
      frameWidth: 48,
      frameHeight: 48,
      spacing: 0
    });
    this.load.spritesheet('player3', 'assets/player3.png', {
      frameWidth: 48,
      frameHeight: 48,
      spacing: 0
    });
    this.load.spritesheet('player4', 'assets/player4.png', {
      frameWidth: 48,
      frameHeight: 48,
      spacing: 0
    });

    // Load the player sprite
    this.load.spritesheet('player', 'assets/player.png', {
      frameWidth: 48,
      frameHeight: 48,
      spacing: 0
    });

    // Initialize spacebar key
    if (this.input.keyboard) {
      this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // Initialize keyboard keys
    if (this.input.keyboard) {
      this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
      this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    // Load NPC spritesheets
    const npcLayer = this.map?.getObjectLayer('npc');
    if (npcLayer) {
      const npcTypes = new Set<string>();
      npcLayer.objects.forEach(obj => {
        const npcType = obj.properties?.find((p: { name: string }) => p.name === 'npcType')?.value;
        if (npcType) npcTypes.add(npcType);
      });
      
      npcTypes.forEach(npcType => {
        this.load.spritesheet(npcType, `assets/${npcType}.png`, {
          frameWidth: 48,
          frameHeight: 48
        });
      });
    }
  }

  create(): void {
    this.initializeTilesets();
    this.createLayers();
    this.setupPlayer();
    this.setupAnimations();
    this.setupCamera();
    this.createMinimap();
    this.createDialogBox();
    this.setupInteractiveObjects();
    this.setupNPCs();
    
    // Set up camera to follow player with proper bounds
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1);
    this.cameras.main.setBounds(
      -this.map.widthInPixels,
      -this.map.widthInPixels,
      this.map.widthInPixels * 3,
      this.map.widthInPixels * 3
    );
    this.cameras.main.setDeadzone(0, 0);

    // Add dynamic zoom based on screen size
    this.scale.on('resize', this.resize, this);
    this.resize();

    // Set world bounds
    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.player.setCollideWorldBounds(true);
  }

  private initializeTilesets(): void {
    this.map = this.make.tilemap({ 
      key: 'lobby_map',
      tileWidth: 32,
      tileHeight: 32
    });

    this.tileset = this.map.addTilesetImage('lobby_tileset', 'lobby_tileset')!;
    this.objectsTileset = this.map.addTilesetImage('objects', 'objects')!;
    this.objects2Tileset = this.map.addTilesetImage('objects2', 'objects2')!;
    this.rotaryPhonesTileset = this.map.addTilesetImage('Rotary Phones', 'rotary_phones')!;
    this.waterCoolerTileset = this.map.addTilesetImage('Water Cooler', 'water_cooler')!;
    this.tvWidescreenTileset = this.map.addTilesetImage('TV, Widescreen', 'tv_widescreen')!;
    this.sciFiDecorTileset = this.map.addTilesetImage('sci fi (decor assets) assets', 'sci_fi_decor')!;
    this.megaPixelIconsTileset = this.map.addTilesetImage('MegaPixelArt32x32pxIcons_SpriteSheet', 'mega_pixel_icons')!;
    this.laptopTileset = this.map.addTilesetImage('Laptop', 'laptop')!;
    this.freePixelTileset = this.map.addTilesetImage('FreePixel', 'free_pixel')!;
    this.deskOrnateTileset = this.map.addTilesetImage('Desk, Ornate', 'desk_ornate')!;
    this.copyMachineTileset = this.map.addTilesetImage('Copy Machine', 'copy_machine')!;
    this.cardTableTileset = this.map.addTilesetImage('Card Table', 'card_table')!;
    this.pixelOfficeTileset = this.map.addTilesetImage('PixelOfficeAssets', 'pixel_office')!;
    this.officeTilesTileset = this.map.addTilesetImage('officetiles', 'office_tiles')!;
    this.office2Tileset = this.map.addTilesetImage('office2', 'office2')!;
    this.office3Tileset = this.map.addTilesetImage('office3', 'office3')!;
    this.office4Tileset = this.map.addTilesetImage('office4', 'office4')!;
    this.officeMainTileset = this.map.addTilesetImage('officeMainTileMap', 'office_main')!;
    
    // Initialize floor tilesets
    this.floorPurpleTileset = this.map.addTilesetImage('floor_Purple', 'floor_purple')!;
    this.floorPinkTileset = this.map.addTilesetImage('floor_Pink', 'floor_pink')!;
    this.floorGreenTileset = this.map.addTilesetImage('floor_Green', 'floor_green')!;
    this.floorGrayTileset = this.map.addTilesetImage('floor_Gray', 'floor_gray')!;
    this.floorBrownTileset = this.map.addTilesetImage('floor_Brown', 'floor_brown')!;
  }

  private getAllTilesets(): Phaser.Tilemaps.Tileset[] {
    return [
      this.objectsTileset,
      this.objects2Tileset,
      this.rotaryPhonesTileset,
      this.waterCoolerTileset,
      this.tvWidescreenTileset,
      this.sciFiDecorTileset,
      this.megaPixelIconsTileset,
      this.laptopTileset,
      this.freePixelTileset,
      this.deskOrnateTileset,
      this.copyMachineTileset,
      this.cardTableTileset,
      this.pixelOfficeTileset,
      this.officeTilesTileset,
      this.office2Tileset,
      this.office3Tileset,
      this.office4Tileset,
      this.officeMainTileset,
      this.floorPurpleTileset,
      this.floorPinkTileset,
      this.floorGreenTileset,
      this.floorGrayTileset,
      this.floorBrownTileset
    ];
  }

  private createLayers(): void {

    // Create collision layer
    this.collisionLayer = this.map.createLayer(
      'collission',
      [this.tileset, ...this.getAllTilesets()],
      0,
      0
    )!;

    // Create base layer
    this.baseLayer = this.map.createLayer(
      'Tile Layer 1',
      this.tileset,
      0,
      0
    )!;

    
    // Create floor layers
    this.floor2Layer = this.map.createLayer(
      'floor2',
      [this.tileset, ...this.getAllTilesets()],
      0,
      0
    )!;
    
    this.floorLayer = this.map.createLayer(
      'floor',
      [this.tileset, ...this.getAllTilesets()],
      0,
      0
    )!;

    

    

    // Create furniture layer
    this.furnitureLayer = this.map.createLayer(
      'furniture',
      [this.tileset, ...this.getAllTilesets()],
      0,
      0
    )!;

    // Create objects layer
    this.objectsLayer = this.map.createLayer(
      'objects',
      [this.tileset, ...this.getAllTilesets()],
      0,
      0
    )!;

    

    // Create interactive layer
    this.interactiveLayer = this.map.createLayer(
      'interactive',
      [this.tileset, ...this.getAllTilesets()],
      0,
      0
    )!;

    // Set up collision for specific tiles
    this.collisionLayer.setCollision([8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]);
  }

  private setupPlayer(): void {
    // Create player sprite at the spawn point
    const spawnX = this.map.widthInPixels / 2;
    const spawnY = this.map.heightInPixels / 2;
    
    this.player = this.physics.add.sprite(spawnX, spawnY, 'player');
    this.player.setScale(1);
    
    // Set proper collision bounds
    this.player.body.setSize(32, 32);  // Match grid size
    this.player.body.setOffset(8, 8);  // Center the collision box

    // Initialize cursor keys
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Snap player to grid on start
    this.snapToGrid(this.player);
    this.playerState.targetX = this.player.x;
    this.playerState.targetY = this.player.y;

    // Play idle-down animation by default
    this.player.play('idle-down');
  }

  private setupAnimations(): void {
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
      frames: this.anims.generateFrameNumbers('player', { frames: [3, 7, 11, 15] }),
      frameRate: 8,
      repeat: -1
    });
  }

  private setupCamera(): void {
    // Adjust the visual appearance
    this.collisionLayer.setScale(1);
    this.floorLayer.setScale(1);
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

  private canMove(targetX: number, targetY: number): boolean {
    // Get the tile at the target position
    const tile = this.map.getTileAtWorldXY(targetX, targetY, true, this.cameras.main, 'collission');
    
    // If there's no tile or the tile index is -1 (empty), movement is allowed
    return !tile || tile.index === -1;
  }

  private createMinimap(): void {
    const minimapWidth = 300;
    const minimapHeight = 200;
    const padding = 15;
    const x = this.scale.width - minimapWidth - padding;
    const y = padding;

    // Create a container for minimap elements
    this.minimapContainer = this.add.container(x, y);
    this.minimapContainer.setScrollFactor(0);

    // Create background rectangle
    // const background = this.add.rectangle(0, 0, minimapWidth, minimapHeight, 0x002244);
    // this.minimapContainer.add(background);

    // Create borders
    this.minimapBorder = this.add.graphics();
    // White border
    // this.minimapBorder.lineStyle(2, 0xffffff);
    // this.minimapBorder.strokeRect(0, 0, minimapWidth, minimapHeight);
    
    this.minimapContainer.add(this.minimapBorder);

    // Create minimap camera
    this.minimapCamera = this.cameras.add(x, y, minimapWidth, minimapHeight);
    this.minimapCamera.setZoom(0.15);
    this.minimapCamera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.minimapCamera.startFollow(this.player);
    this.minimapCamera.setName('minimap');
  }

  private resize(): void {
    const camera = this.cameras.main;
    const gameWidth = this.scale.gameSize.width;
    const gameHeight = this.scale.gameSize.height;
    
    // Calculate zoom to fit the map while maintaining pixel art clarity
    const zoomX = gameWidth / (this.map.widthInPixels / 2.625);
    const zoomY = gameHeight / (this.map.heightInPixels / 2.625);
    const zoom = Math.min(zoomX, zoomY, 2.625);
    
    camera.setZoom(Math.max(0.525, zoom));

    // Update minimap position
    const minimapWidth = 300;
    const minimapHeight = 200;
    const padding = 15;
    const x = gameWidth - minimapWidth - padding;
    const y = padding;

    // Update container position
    this.minimapContainer.setPosition(x, y);
    
    // Update camera position
    this.minimapCamera.setPosition(x, y);
  }

  shutdown(): void {
    this.scale.off('resize', this.resize, this);
  }

  private createDialogBox(): void {
    // Create a container for the dialog box
    this.dialogBox = this.add.container(0, 0);
    this.dialogBox.setScrollFactor(0); // Fix to screen

    const dialogHeight = 100;
    const dialogWidth = 400; // Fixed width for the dialog box
    const padding = 20;

    // Create the dialog box background
    const graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1); // Changed alpha from 0.8 to 1 for solid background

    // Use absolute screen coordinates
    const screenHeight = this.scale.displaySize.height;
    const screenWidth = this.scale.displaySize.width;

    // Calculate center position
    const x = (screenWidth - dialogWidth) / 2;
    const y = (screenHeight - dialogHeight) / 2;

    graphics.fillRect(
      x, 
      y, 
      dialogWidth, 
      dialogHeight
    );
    graphics.lineStyle(2, 0xffffff);
    graphics.strokeRect(
      x, 
      y, 
      dialogWidth, 
      dialogHeight
    );

    // Create the text with adjusted positioning
    const text = this.add.text(x + padding, y + padding, '...', {
      fontSize: '24px',
      color: '#ffffff',
      wordWrap: { width: dialogWidth - (padding * 2) }
    });

    // Add elements to the container
    this.dialogBox.add([graphics, text]);
    this.dialogBox.setVisible(false);

    // Update dialog box position on resize
    this.scale.on('resize', () => {
      const newScreenHeight = this.scale.displaySize.height;
      const newScreenWidth = this.scale.displaySize.width;
      
      // Recalculate center position
      const newX = (newScreenWidth - dialogWidth) / 2;
      const newY = (newScreenHeight - dialogHeight) / 2;
      
      graphics.clear();
      graphics.fillStyle(0x000000, 1); // Changed alpha from 0.8 to 1 for solid background
      graphics.fillRect(
        newX, 
        newY, 
        dialogWidth, 
        dialogHeight
      );
      graphics.lineStyle(2, 0xffffff);
      graphics.strokeRect(
        newX, 
        newY, 
        dialogWidth, 
        dialogHeight
      );
      text.setPosition(newX + padding, newY + padding);
      text.setWordWrapWidth(dialogWidth - (padding * 2));
    });
  }

  private setupInteractiveObjects(): void {
    // Create a group for interactive objects
    this.interactiveObjects = this.add.group();

    // Get all interactive objects from the Tiled map
    const interactiveObjectsLayer = this.map.getObjectLayer('interactive');
    if (interactiveObjectsLayer && interactiveObjectsLayer.objects) {
      interactiveObjectsLayer.objects.forEach(obj => {
        // Create an invisible rectangle for each interactive area
        const zone = this.add.zone(obj.x!, obj.y!, obj.width!, obj.height!);
        this.physics.world.enable(zone, Phaser.Physics.Arcade.STATIC_BODY);
        this.interactiveObjects.add(zone);
      });
    }
  }

  private handleInteraction(): void {
    if (this.isDialogVisible) {
      return; // Don't handle new interactions while dialog is visible
    }

    // Check if player is overlapping with any interactive object
    let canInteract = false;
    this.physics.overlap(this.player, this.interactiveObjects, () => {
      canInteract = true;
    });

    if (canInteract) {
      this.dialogBox.setVisible(true);
      this.isDialogVisible = true;
    }
  }

  private setupNPCs(): void {
    const npcLayer = this.map.getObjectLayer('npc');
    if (!npcLayer) return;

    // Group NPCs by their type
    const npcsByType = new Map<string, Phaser.Types.Math.Vector2Like[]>();
    
    npcLayer.objects.forEach(obj => {
      const npcType = obj.properties?.find((p: { name: string }) => p.name === 'npcType')?.value;
      if (npcType) {
        if (!npcsByType.has(npcType)) {
          npcsByType.set(npcType, []);
        }
        const positions = npcsByType.get(npcType);
        if (positions) {
          positions.push({ x: obj.x || 0, y: obj.y || 0 });
        }
      }
    });

    // Create NPCs and their paths
    npcsByType.forEach((positions, npcType) => {
      if (positions.length >= 2) {
        // Create NPC sprite
        const npc = this.physics.add.sprite(positions[0].x, positions[0].y, npcType);
        npc.setData('type', npcType);
        npc.setData('currentPoint', 0);
        npc.setData('positions', positions);
        
        // Set up animations for this NPC
        if (!this.anims.exists(`${npcType}_walk_left`)) {
          this.anims.create({
            key: `${npcType}_walk_left`,
            frames: this.anims.generateFrameNumbers(npcType, { frames: [1, 5, 9, 13] }),
            frameRate: 8,
            repeat: -1
          });
        }
        
        if (!this.anims.exists(`${npcType}_walk_right`)) {
          this.anims.create({
            key: `${npcType}_walk_right`,
            frames: this.anims.generateFrameNumbers(npcType, { frames: [3, 7, 11, 15] }),
            frameRate: 8,
            repeat: -1
          });
        }

        // Start walking animation based on initial direction
        const nextPoint = positions[1];
        if (nextPoint.x > positions[0].x) {
          npc.anims.play(`${npcType}_walk_right`, true);
          npc.setFlipX(false);
        } else {
          npc.anims.play(`${npcType}_walk_left`, true);
          npc.setFlipX(false);
        }

        this.npcs.push(npc);
      }
    });
  }

  update(): void {
    // Handle enter press for interaction
    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.handleInteraction();
    }

    // Handle escape press to close dialog
    if (this.isDialogVisible && Phaser.Input.Keyboard.JustDown(this.escapeKey)) {
      this.dialogBox.setVisible(false);
      this.isDialogVisible = false;
      return;
    }

    // Only allow movement if dialog is not visible
    if (!this.isDialogVisible) {
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
        } else if (this.cursors.right.isDown) {
          newTargetX = this.player.x + gridSize;
          newAnimation = 'walk-side';
          isMovementKeyPressed = true;
          this.player.setFlipX(false);
        } else if (this.cursors.up.isDown) {
          newTargetY = this.player.y - gridSize;
          newAnimation = 'walk-up';
          isMovementKeyPressed = true;
        } else if (this.cursors.down.isDown) {
          newTargetY = this.player.y + gridSize;
          newAnimation = 'walk-down';
          isMovementKeyPressed = true;
        }

        if (isMovementKeyPressed &&
            this.canMove(newTargetX, newTargetY)) {
          this.playerState.targetX = newTargetX;
          this.playerState.targetY = newTargetY;
          this.playerState.isMoving = true;
          this.player.play(newAnimation, true);
        } else if (!isMovementKeyPressed) {
          const currentAnim = this.player.anims.currentAnim?.key || '';
          if (currentAnim.includes('down')) {
            this.player.play('idle-down', true);
          } else if (currentAnim.includes('up')) {
            this.player.play('idle-up', true);
          } else if (currentAnim.includes('side')) {
            this.player.play('idle-side', true);
          } else {
            this.player.play('idle-down', true);
          }
        }
      }

      this.moveTowardTarget();
    }

    // Update NPCs
    this.npcs.forEach(npc => {
      const positions = npc.getData('positions') as Phaser.Types.Math.Vector2Like[];
      const currentPoint = npc.getData('currentPoint') as number;
      const npcType = npc.getData('type') as string;
      const lastMoveTime = npc.getData('lastMoveTime') as number || 0;
      const currentTime = this.time.now;

      if (currentTime - lastMoveTime < 2000) {
        npc.setVelocity(0, 0);
        // Set idle frame based on facing direction
        const nextPoint = (currentPoint + 1) % positions.length;
        const nextPos = positions[nextPoint];
        if (nextPos.x > npc.x) {
          npc.setFrame(3); // stand right
        } else {
          npc.setFrame(1); // stand left
        }
        return;
      }

      const targetPos = positions[currentPoint];
      const distance = Phaser.Math.Distance.Between(npc.x, npc.y, targetPos.x, targetPos.y);
      
      if (distance < 2) {
        // Reached current point, move to next point
        const nextPoint = (currentPoint + 1) % positions.length;
        npc.setData('currentPoint', nextPoint);
        npc.setData('lastMoveTime', currentTime);
        
        // Update animation based on new direction
        const nextPos = positions[nextPoint];
        if (nextPos.x > npc.x) {
          npc.anims.play(`${npcType}_walk_right`, true);
          npc.setFlipX(false);
        } else {
          npc.anims.play(`${npcType}_walk_left`, true);
          npc.setFlipX(false);
        }
      } else {
        // Move towards current target
        const angle = Phaser.Math.Angle.Between(npc.x, npc.y, targetPos.x, targetPos.y);
        const speed = 100; // Adjust speed as needed
        npc.setVelocity(
          Math.cos(angle) * speed,
          Math.sin(angle) * speed
        );
      }
    });
  }
}