import { GridPosition, TileType } from '../../world';
import { ItemType } from '../../inventory';
import { InventorySlot } from '../../inventory';

export type BuildingType = 'mining-drill' | 'wooden-chest';
export type Direction = 'north' | 'east' | 'south' | 'west';

export interface BuildingDefinition {
    type: BuildingType;
    name: string;
    width: number;
    height: number;
    allowedTileTypes: TileType[];
    outputItem?: ItemType;
    miningInterval?: number;
    miningAmount?: number;
    outputDirection?: Direction;
    storageSize?: number;
    color: number;
    accentColor: number;
}

export interface BuildingInstance {
    id: number;
    type: BuildingType;
    position: GridPosition;
    direction: Direction;
    progress: number;
    storage?: InventorySlot[];
}

export interface BuildingOutput {
    position: GridPosition;
    direction: Direction;
}
