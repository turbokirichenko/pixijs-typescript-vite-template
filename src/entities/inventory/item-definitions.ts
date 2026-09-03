import { ItemDefinition, ItemType } from './interfaces/inventory.interface';

export const ITEM_DEFINITIONS: Record<ItemType, ItemDefinition> = {
    coal: {
        type: 'coal',
        name: '煤',
        color: 0x1a1a1a,
        iconShape: 'coal',
        stackable: true,
        maxStackSize: 99
    },
    'mining-drill': {
        type: 'mining-drill',
        name: '矿机',
        color: 0xb78b54,
        iconShape: 'pickaxe',
        stackable: true,
        maxStackSize: 99
    },
    'wooden-chest': {
        type: 'wooden-chest',
        name: '木箱',
        color: 0x9b663d,
        iconShape: 'chest',
        stackable: true,
        maxStackSize: 99
    }
};
