import { Rectangle } from 'pixi.js';
import { PixiContainer, PixiGraphics, PixiText } from '../../plugins/engine';
import { GameState } from '../../entities/game-state';
import {
    GridPosition,
    ScreenPosition,
    ViewportSize,
    WorldCoordinateSystem,
    WorldPosition
} from '../../entities/world';
import { getBuildingDefinition, getBuildingOutput } from '../../entities/building';
import { drawPickaxe } from '../draw/pickaxe';
import { drawChest } from '../draw/chest';

export class WorldContainer extends PixiContainer {
    private readonly _state: GameState;
    private readonly _coordinates: WorldCoordinateSystem;
    private readonly _graphics: PixiGraphics;
    private readonly _coalGraphics: PixiGraphics;
    private readonly _buildingGraphics: PixiGraphics;
    private readonly _hoverGraphics: PixiGraphics;
    private readonly _selectionGraphics: PixiGraphics;
    private readonly _tileInfo: PixiText;
    private _viewport: ViewportSize = { width: 0, height: 0 };
    private _camera: WorldPosition;
    private _isDragging = false;
    private _dragStart: ScreenPosition = { x: 0, y: 0 };
    private _dragCameraStart: WorldPosition = { x: 0, y: 0 };
    private _hasDragged = false;
    private _hoveredCell?: GridPosition;
    private _selectedCell?: GridPosition;
    private _lastStateVersion = -1;

    constructor(state: GameState, coordinates: WorldCoordinateSystem) {
        super();
        this._state = state;
        this._coordinates = coordinates;
        this._graphics = new PixiGraphics();
        this._coalGraphics = new PixiGraphics();
        this._buildingGraphics = new PixiGraphics();
        this._camera = {
            x: state.world.columns * state.world.tileSize / 2,
            y: state.world.rows * state.world.tileSize / 2
        };
        this._hoverGraphics = new PixiGraphics();
        this._selectionGraphics = new PixiGraphics();
        this._tileInfo = new PixiText({
            text: '',
            style: {
                fontFamily: 'Arial',
                fontSize: 18,
                fill: 0xffffff,
                align: 'center'
            }
        });
        this._tileInfo.anchor.set(0.5, 0);
        this._tileInfo.visible = false;
        this.eventMode = 'static';
        this.on('pointerdown', this.onPointerDown, this);
        this.on('pointermove', this.onPointerMove, this);
        this.on('pointerup', this.onPointerUp, this);
        this.on('pointerupoutside', this.onPointerUp, this);
        this.on('pointerout', this.onPointerOut, this);
        this.on('wheel', this.onWheel, this);
        window.addEventListener('keydown', this.onKeyDown);
        this.addChild(this._graphics);
        this.addChild(this._coalGraphics);
        this.addChild(this._buildingGraphics);
        this.addChild(this._hoverGraphics, this._selectionGraphics);
        this.addChild(this._tileInfo);
    }

    resize(width: number, height: number): void {
        this._viewport = { width, height };
        this.hitArea = new Rectangle(0, 0, width, height);
        this.clampCamera();
        this._tileInfo.position.set(width / 2, 16);
        this.redraw();
    }

    get selectedCell(): GridPosition | undefined {
        return this._selectedCell ? { ...this._selectedCell } : undefined;
    }

    update(): void {
        if (this._lastStateVersion === this._state.inventory.version) {
            return;
        }
        this._lastStateVersion = this._state.inventory.version;
        this.redraw();
        if (this._hoveredCell) {
            this.updateTileInfo(this._hoveredCell);
        }
    }

    private onPointerDown(event: { global: ScreenPosition }): void {
        this._isDragging = true;
        this._hasDragged = false;
        this._dragStart = { x: event.global.x, y: event.global.y };
        this._dragCameraStart = { ...this._camera };
    }

    private onPointerMove(event: { global: ScreenPosition }): void {
        const cell = this._getCellAtScreen(event.global);
        this._setHoveredCell(cell);

        if (!this._isDragging) {
            return;
        }

        const deltaX = event.global.x - this._dragStart.x;
        const deltaY = event.global.y - this._dragStart.y;
        if (Math.hypot(deltaX, deltaY) > 3) {
            this._hasDragged = true;
        }
        if (!this._hasDragged) {
            return;
        }

        this._camera = {
            x: this._dragCameraStart.x - deltaX / this._coordinates.zoom,
            y: this._dragCameraStart.y - deltaY / this._coordinates.zoom
        };
        this.clampCamera();
        this.redraw();
    }

    private onPointerUp(event: { global: ScreenPosition }): void {
        if (!this._isDragging) {
            return;
        }

        if (!this._hasDragged) {
            this._selectedCell = this._getCellAtScreen(event.global);
            if (this._selectedCell) {
                if (this._state.selectedItem === 'mining-drill') {
                    this._state.placeSelectedBuilding(this._selectedCell);
                } else {
                    this._state.mine(this._selectedCell, 1);
                }
            }
            this.drawCellOutline(this._selectionGraphics, this._selectedCell, 0xffd166, 3);
            this.redraw();
            this._setHoveredCell(this._selectedCell);
        }
        this._isDragging = false;
    }

    private onPointerOut(): void {
        this._setHoveredCell(undefined);
        this._tileInfo.visible = false;
    }

    private onWheel(event: { deltaY: number; global: ScreenPosition }): void {
        const previousWorldPosition = this._coordinates.screenToWorld(
            event.global,
            this._viewport,
            this._camera
        );
        const nextZoom = Math.min(2.5, Math.max(0.5, this._coordinates.zoom * (event.deltaY < 0 ? 1.1 : 0.9)));
        this._coordinates.setZoom(nextZoom);
        this._camera = {
            x: previousWorldPosition.x - (event.global.x - this._viewport.width / 2) / nextZoom,
            y: previousWorldPosition.y - (event.global.y - this._viewport.height / 2) / nextZoom
        };
        this.clampCamera();
        this.redraw();
    }

    private onKeyDown = (event: KeyboardEvent): void => {
        if (event.key.toLowerCase() === 'r' && this._state.selectedItem === 'mining-drill') {
            this._state.rotatePlacement();
            this.redraw();
        }
    };

    private _getCellAtScreen(position: ScreenPosition): GridPosition | undefined {
        const cell = this._coordinates.screenToGrid(position, this._viewport, this._camera);
        return this._state.world.isInside(cell) ? cell : undefined;
    }

    private _setHoveredCell(cell: GridPosition | undefined): void {
        if (this._hoveredCell?.x === cell?.x && this._hoveredCell?.y === cell?.y) {
            return;
        }
        this._hoveredCell = cell;
        this.drawCellOutline(this._hoverGraphics, cell, 0xffffff, 2);
        if (!cell) {
            this._tileInfo.visible = false;
            return;
        }

        this.updateTileInfo(cell);
    }

    private updateTileInfo(cell: GridPosition): void {
        const tile = this._state.world.getTile(cell);
        this._tileInfo.text = tile.definition.resourceType === 'coal'
            ? `${tile.definition.name}\n剩余资源: ${tile.resourceAmount}`
            : tile.definition.name;
        this._tileInfo.visible = true;
    }

    private drawCellOutline(
        graphics: PixiGraphics,
        cell: GridPosition | undefined,
        color: number,
        width: number
    ): void {
        graphics.clear();
        if (!cell) {
            return;
        }
        const position = this._coordinates.gridToScreen(cell, this._viewport, this._camera);
        graphics
            .rect(position.x, position.y, this._state.world.tileSize * this._coordinates.zoom, this._state.world.tileSize * this._coordinates.zoom)
            .stroke({ width, color });
    }

    private clampCamera(): void {
        const mapWidth = this._state.world.columns * this._state.world.tileSize;
        const mapHeight = this._state.world.rows * this._state.world.tileSize;
        const halfViewportWidth = this._viewport.width / (2 * this._coordinates.zoom);
        const halfViewportHeight = this._viewport.height / (2 * this._coordinates.zoom);
        const minCameraX = mapWidth <= this._viewport.width / this._coordinates.zoom
            ? mapWidth / 2
            : halfViewportWidth;
        const maxCameraX = mapWidth <= this._viewport.width / this._coordinates.zoom
            ? mapWidth / 2
            : mapWidth - halfViewportWidth;
        const minCameraY = mapHeight <= this._viewport.height / this._coordinates.zoom
            ? mapHeight / 2
            : halfViewportHeight;
        const maxCameraY = mapHeight <= this._viewport.height / this._coordinates.zoom
            ? mapHeight / 2
            : mapHeight - halfViewportHeight;

        this._camera.x = Math.min(maxCameraX, Math.max(minCameraX, this._camera.x));
        this._camera.y = Math.min(maxCameraY, Math.max(minCameraY, this._camera.y));
    }

    private redraw(): void {
        const { columns, rows, tileSize } = this._state.world;
        this._graphics.clear();
        this._coalGraphics.clear();
        this._buildingGraphics.clear();

        const mapWidth = columns * tileSize;
        const mapHeight = rows * tileSize;
        const mapStart = this._coordinates.worldToScreen(
            { x: 0, y: 0 },
            this._viewport,
            this._camera
        );

        this._graphics
            .rect(mapStart.x, mapStart.y, mapWidth * this._coordinates.zoom, mapHeight * this._coordinates.zoom)
            .fill(0x4b6045);

        for (let y = 0; y < rows; y += 1) {
            for (let x = 0; x < columns; x += 1) {
                const position: GridPosition = { x, y };
                const screenPosition = this._coordinates.gridToScreen(
                    position,
                    this._viewport,
                    this._camera
                );
                const tile = this._state.world.getTile(position);
                const color = (x + y) % 2 === 0 ? 0x5f7651 : 0x58704b;

                this._graphics
                    .rect(screenPosition.x, screenPosition.y, tileSize * this._coordinates.zoom, tileSize * this._coordinates.zoom)
                    .fill(color);

                if (tile.definition.type === 'coal') {
                    this.drawCoalDeposit(x, y, screenPosition.x, screenPosition.y, tileSize * this._coordinates.zoom, tile.definition.color, tile.definition.accentColor ?? 0x596056);
                }
            }
        }

        for (let x = 0; x <= columns; x += 1) {
            const screenPosition = this._coordinates.gridToScreen(
                { x, y: 0 },
                this._viewport,
                this._camera
            );
            this._graphics
                .moveTo(screenPosition.x, screenPosition.y)
                .lineTo(screenPosition.x, screenPosition.y + mapHeight * this._coordinates.zoom)
                .stroke({ width: 1, color: 0x34432f, alpha: 0.8 });
        }

        for (let y = 0; y <= rows; y += 1) {
            const screenPosition = this._coordinates.gridToScreen(
                { x: 0, y },
                this._viewport,
                this._camera
            );
            this._graphics
                .moveTo(screenPosition.x, screenPosition.y)
                .lineTo(screenPosition.x + mapWidth * this._coordinates.zoom, screenPosition.y)
                .stroke({ width: 1, color: 0x34432f, alpha: 0.8 });
        }

        this._state.buildings.all.forEach((building) => {
            if (building.type === 'mining-drill') {
                this.drawMiningDrill(building.position, building.direction, 1);
            } else {
                this.drawWoodenChest(building.position, 1);
            }
        });
        if ((this._state.selectedItem === 'mining-drill' || this._state.selectedItem === 'wooden-chest') && this._hoveredCell) {
            const definition = getBuildingDefinition(this._state.selectedItem === 'wooden-chest' ? 'wooden-chest' : 'mining-drill');
            const tile = this._state.world.getTile(this._hoveredCell);
            const canPlace = definition.allowedTileTypes.includes(tile.definition.type)
                && !this._state.buildings.getAt(this._hoveredCell);
            if (this._state.selectedItem === 'mining-drill') {
                this.drawMiningDrill(this._hoveredCell, this._state.placementDirection, canPlace ? 0.55 : 0.25, !canPlace);
            } else {
                this.drawWoodenChest(this._hoveredCell, canPlace ? 0.65 : 0.25, !canPlace);
            }
        }

        this.drawCellOutline(this._hoverGraphics, this._hoveredCell, 0xffffff, 2);
        this.drawCellOutline(this._selectionGraphics, this._selectedCell, 0xffd166, 3);
    }

    private drawMiningDrill(
        position: GridPosition,
        direction: 'north' | 'east' | 'south' | 'west',
        alpha: number,
        invalid = false
    ): void {
        const tileSize = this._state.world.tileSize * this._coordinates.zoom;
        const screenPosition = this._coordinates.gridToScreen(position, this._viewport, this._camera);
        const centerX = screenPosition.x + tileSize / 2;
        const centerY = screenPosition.y + tileSize / 2;
        const frameSize = tileSize * 0.76;
        const frameStartX = centerX - frameSize / 2;
        const frameStartY = centerY - frameSize / 2;
        const definition = getBuildingDefinition('mining-drill');
        const frameColor = invalid ? 0xa33d3d : definition.color;
        const directions = {
            north: { x: 0, y: -1 },
            east: { x: 1, y: 0 },
            south: { x: 0, y: 1 },
            west: { x: -1, y: 0 }
        };
        const vector = directions[direction];
        this._buildingGraphics
            .rect(frameStartX, frameStartY, frameSize, frameSize)
            .fill({ color: frameColor, alpha })
            .stroke({ width: Math.max(2, tileSize * 0.06), color: 0x171a17, alpha });
        drawPickaxe(
            this._buildingGraphics,
            centerX,
            centerY,
            frameSize * 0.7,
            { north: 0, east: Math.PI / 2, south: Math.PI, west: Math.PI * 1.5 }[direction],
            alpha
        );

        const output = getBuildingOutput({ id: 0, type: 'mining-drill', position, direction, progress: 0 });
        const portX = centerX + vector.x * frameSize * 0.46;
        const portY = centerY + vector.y * frameSize * 0.46;
        const portSize = tileSize * 0.16;
        this._buildingGraphics
            .rect(portX - portSize / 2, portY - portSize / 2, portSize, portSize)
            .fill({ color: this._state.world.isInside(output.position) ? 0x303830 : 0x8a4232, alpha });
    }

    private drawWoodenChest(position: GridPosition, alpha: number, invalid = false): void {
        const tileSize = this._state.world.tileSize * this._coordinates.zoom;
        const screenPosition = this._coordinates.gridToScreen(position, this._viewport, this._camera);
        const graphics = this._buildingGraphics;
        if (invalid) {
            graphics
                .rect(screenPosition.x + tileSize * 0.12, screenPosition.y + tileSize * 0.12, tileSize * 0.76, tileSize * 0.68)
                .fill({ color: 0xa33d3d, alpha });
        }
        drawChest(graphics, screenPosition.x + tileSize / 2, screenPosition.y + tileSize / 2, tileSize, invalid ? alpha : alpha);
    }

    private drawCoalDeposit(
        gridX: number,
        gridY: number,
        screenX: number,
        screenY: number,
        size: number,
        color: number,
        accentColor: number
    ): void {
        let seed = ((gridX + 1) * 374761393 + (gridY + 1) * 668265263) >>> 0;
        const random = (): number => {
            seed = (seed * 1664525 + 1013904223) >>> 0;
            return seed / 0x100000000;
        };
        const rocks = 3 + Math.floor(random() * 3);

        for (let index = 0; index < rocks; index += 1) {
            const radius = size * (0.14 + random() * 0.08);
            const centerX = screenX + size * (0.18 + random() * 0.64);
            const centerY = screenY + size * (0.2 + random() * 0.6);
            const shadowRadius = radius * 1.12;

            this._coalGraphics
                .circle(centerX + size * 0.025, centerY + size * 0.04, shadowRadius)
                .fill(0x111411);
            this._coalGraphics
                .circle(centerX, centerY, radius)
                .fill(color)
                .stroke({ width: Math.max(1, size * 0.025), color: 0x101210 });
            this._coalGraphics
                .circle(centerX - radius * 0.28, centerY - radius * 0.3, radius * 0.28)
                .fill(accentColor);
        }
    }
}
