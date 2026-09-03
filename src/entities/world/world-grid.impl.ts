import {
    GridPosition,
    TileType,
    WorldGridInterface,
    WorldTile
} from './interfaces/world.interface';
import { getTileDefinition } from './tile-definitions';

export interface WorldGridOptions {
    columns: number;
    rows: number;
    tileSize: number;
    coalClusterCount?: number;
    coalClusterMinSize?: number;
    coalClusterMaxSize?: number;
    coalResourceMin?: number;
    coalResourceMax?: number;
}

export class WorldGridImpl implements WorldGridInterface {
    readonly columns: number;
    readonly rows: number;
    readonly tileSize: number;
    private readonly _tiles: WorldTile[][];

    constructor(options: WorldGridOptions) {
        if (!Number.isInteger(options.columns) || options.columns <= 0) {
            throw new Error('World grid columns must be a positive integer');
        }
        if (!Number.isInteger(options.rows) || options.rows <= 0) {
            throw new Error('World grid rows must be a positive integer');
        }
        if (!Number.isFinite(options.tileSize) || options.tileSize <= 0) {
            throw new Error('World grid tile size must be positive');
        }

        this.columns = options.columns;
        this.rows = options.rows;
        this.tileSize = options.tileSize;
        this._tiles = Array.from({ length: this.rows }, () =>
            Array.from({ length: this.columns }, () => this.createTile('ground'))
        );
        this.generateCoalClusters(options);
    }

    isInside(position: GridPosition): boolean {
        return position.x >= 0
            && position.x < this.columns
            && position.y >= 0
            && position.y < this.rows
            && Number.isInteger(position.x)
            && Number.isInteger(position.y);
    }

    getTile(position: GridPosition): WorldTile {
        this.assertInside(position);
        return this._tiles[position.y][position.x];
    }

    setTile(position: GridPosition, tile: TileType, resourceAmount = 0): void {
        this.assertInside(position);
        this._tiles[position.y][position.x] = this.createTile(tile, resourceAmount);
    }

    mine(position: GridPosition, amount: number): number {
        if (!Number.isFinite(amount) || amount <= 0) {
            return 0;
        }

        const tile = this.getTile(position);
        if (tile.definition.resourceType !== 'coal') {
            return 0;
        }

        const minedAmount = Math.min(tile.resourceAmount, amount);
        tile.resourceAmount -= minedAmount;
        if (tile.resourceAmount === 0) {
            this.setTile(position, 'ground');
        }
        return minedAmount;
    }

    private assertInside(position: GridPosition): void {
        if (!this.isInside(position)) {
            throw new Error(`Grid position is outside the map: ${position.x},${position.y}`);
        }
    }

    private createTile(type: TileType, resourceAmount = 0): WorldTile {
        return {
            definition: getTileDefinition(type),
            resourceAmount
        };
    }

    private generateCoalClusters(options: WorldGridOptions): void {
        const clusterCount = options.coalClusterCount ?? 8;
        const minSize = options.coalClusterMinSize ?? 8;
        const maxSize = options.coalClusterMaxSize ?? 18;
        const resourceMin = options.coalResourceMin ?? 300;
        const resourceMax = options.coalResourceMax ?? 900;

        if (clusterCount < 0 || minSize <= 0 || maxSize < minSize || resourceMin <= 0 || resourceMax < resourceMin) {
            throw new Error('Invalid coal cluster configuration');
        }

        for (let cluster = 0; cluster < clusterCount; cluster += 1) {
            const start: GridPosition = {
                x: Math.floor(Math.random() * this.columns),
                y: Math.floor(Math.random() * this.rows)
            };
            const frontier: GridPosition[] = [start];
            const targetSize = this.randomInteger(minSize, maxSize);
            let created = 0;

            while (frontier.length > 0 && created < targetSize) {
                const frontierIndex = Math.floor(Math.random() * frontier.length);
                const position = frontier.splice(frontierIndex, 1)[0];
                if (!this.isInside(position) || this.getTile(position).definition.type === 'coal') {
                    continue;
                }

                this.setTile(position, 'coal', this.randomInteger(resourceMin, resourceMax));
                created += 1;
                this.getNeighbors(position).forEach((neighbor) => {
                    if (this.isInside(neighbor) && this.getTile(neighbor).definition.type !== 'coal') {
                        frontier.push(neighbor);
                    }
                });
            }
        }
    }

    private getNeighbors(position: GridPosition): GridPosition[] {
        return [
            { x: position.x - 1, y: position.y },
            { x: position.x + 1, y: position.y },
            { x: position.x, y: position.y - 1 },
            { x: position.x, y: position.y + 1 }
        ];
    }

    private randomInteger(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
