import { BuildingDefinition, BuildingType } from './interfaces/building.interface';

export const BUILDING_DEFINITIONS: Record<BuildingType, BuildingDefinition> = {
    'mining-drill': {
        type: 'mining-drill',
        name: '矿机',
        width: 1,
        height: 1,
        allowedTileTypes: ['coal'],
        outputItem: 'coal',
        miningInterval: 60,
        miningAmount: 1,
        outputDirection: 'north',
        color: 0x8b6a45,
        accentColor: 0xc7a267
    },
    'wooden-chest': {
        type: 'wooden-chest',
        name: '木箱',
        width: 1,
        height: 1,
        allowedTileTypes: ['ground', 'coal'],
        storageSize: 27,
        color: 0x9b663d,
        accentColor: 0xd39a5c
    }
};

export function getBuildingDefinition(type: BuildingType): BuildingDefinition {
    return BUILDING_DEFINITIONS[type];
}
