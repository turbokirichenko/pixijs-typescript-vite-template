import {
    GridPosition,
    ScreenPosition,
    ViewportSize,
    WorldPosition
} from './interfaces/world.interface';

export class WorldCoordinateSystem {
    readonly tileSize: number;
    private _zoom = 1;

    constructor(tileSize: number) {
        if (!Number.isFinite(tileSize) || tileSize <= 0) {
            throw new Error('World coordinate tile size must be positive');
        }
        this.tileSize = tileSize;
    }

    get zoom(): number {
        return this._zoom;
    }

    setZoom(zoom: number): void {
        if (!Number.isFinite(zoom) || zoom <= 0) {
            throw new Error('World coordinate zoom must be positive');
        }
        this._zoom = zoom;
    }

    gridToWorld(position: GridPosition): WorldPosition {
        return {
            x: position.x * this.tileSize,
            y: position.y * this.tileSize
        };
    }

    worldToGrid(position: WorldPosition): GridPosition {
        return {
            x: Math.floor(position.x / this.tileSize),
            y: Math.floor(position.y / this.tileSize)
        };
    }

    worldToScreen(
        position: WorldPosition,
        viewport: ViewportSize,
        camera: WorldPosition
    ): ScreenPosition {
        return {
            x: (position.x - camera.x) * this._zoom + viewport.width / 2,
            y: (position.y - camera.y) * this._zoom + viewport.height / 2
        };
    }

    screenToWorld(
        position: ScreenPosition,
        viewport: ViewportSize,
        camera: WorldPosition
    ): WorldPosition {
        return {
            x: (position.x - viewport.width / 2) / this._zoom + camera.x,
            y: (position.y - viewport.height / 2) / this._zoom + camera.y
        };
    }

    gridToScreen(
        position: GridPosition,
        viewport: ViewportSize,
        camera: WorldPosition
    ): ScreenPosition {
        return this.worldToScreen(this.gridToWorld(position), viewport, camera);
    }

    screenToGrid(
        position: ScreenPosition,
        viewport: ViewportSize,
        camera: WorldPosition
    ): GridPosition {
        return this.worldToGrid(this.screenToWorld(position, viewport, camera));
    }
}
