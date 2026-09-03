export interface GridPosition {
    x: number;
    y: number;
}

export interface WorldPosition {
    x: number;
    y: number;
}

export interface ScreenPosition {
    x: number;
    y: number;
}

export interface ViewportSize {
    width: number;
    height: number;
}

export type TileType = 'ground' | 'coal';

export interface TileDefinition {
    type: TileType;
    name: string;
    color: number;
    accentColor?: number;
    walkable: boolean;
    buildable: boolean;
    resourceType?: string;
}

export interface WorldTile {
    definition: TileDefinition;
    resourceAmount: number;
}

export interface WorldGridInterface {
    readonly columns: number;
    readonly rows: number;
    readonly tileSize: number;
    isInside(position: GridPosition): boolean;
    getTile(position: GridPosition): WorldTile;
    setTile(position: GridPosition, tile: TileType, resourceAmount?: number): void;
    mine(position: GridPosition, amount: number): number;
}
