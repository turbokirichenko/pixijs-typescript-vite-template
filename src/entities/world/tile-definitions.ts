import { TileDefinition, TileType } from './interfaces/world.interface';

export const TILE_DEFINITIONS: Record<TileType, TileDefinition> = {
    ground: {
        type: 'ground',
        name: '普通地面',
        color: 0x5f7651,
        walkable: true,
        buildable: true
    },
    coal: {
        type: 'coal',
        name: '煤矿',
        color: 0x1a1a1a,
        accentColor: 0x596056,
        walkable: true,
        buildable: false,
        resourceType: 'coal'
    }
};

export function getTileDefinition(type: TileType): TileDefinition {
    return TILE_DEFINITIONS[type];
}
