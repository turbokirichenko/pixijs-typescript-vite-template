export type ItemType = 'coal' | 'mining-drill' | 'wooden-chest';

export interface InventorySlot {
    itemType?: ItemType;
    quantity: number;
}

export interface ItemDefinition {
    type: ItemType;
    name: string;
    color: number;
    iconShape?: 'coal' | 'pickaxe' | 'chest';
    stackable: boolean;
    maxStackSize: number;
}

export interface InventoryInterface {
    readonly backpackSize: number;
    readonly hotbarSize: number;
    readonly version: number;
    getBackpackSlot(index: number): InventorySlot;
    getHotbarSlot(index: number): InventorySlot;
    canAddItem(itemType: ItemType, quantity: number): boolean;
    addItem(itemType: ItemType, quantity: number): boolean;
    removeHotbarItem(index: number, quantity: number): boolean;
    markChanged(): void;
    moveBackpackToHotbar(backpackIndex: number, hotbarIndex: number): boolean;
}
