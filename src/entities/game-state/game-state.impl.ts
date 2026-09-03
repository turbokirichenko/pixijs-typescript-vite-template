import { GridPosition, WorldGrid, WorldGridOptions } from '../world';
import { InventoryState, ItemType, ITEM_DEFINITIONS } from '../inventory';
import { BuildingState, Direction, getBuildingDefinition, getBuildingOutput, BuildingInstance } from '../building';

export class GameState {
    readonly world: WorldGrid;
    readonly inventory: InventoryState;
    readonly buildings: BuildingState;
    private _selectedHotbarIndex?: number;
    private _placementDirection: Direction = 'north';

    constructor(worldOptions: WorldGridOptions) {
        this.world = new WorldGrid(worldOptions);
        this.inventory = new InventoryState();
        this.buildings = new BuildingState();
    }

    mine(position: GridPosition, amount: number): number {
        const tile = this.world.getTile(position);
        const itemType = tile.definition.resourceType as ItemType | undefined;
        if (!itemType || !this.inventory.canAddItem(itemType, amount)) {
            return 0;
        }

        const minedAmount = this.world.mine(position, amount);
        if (minedAmount > 0) {
            this.inventory.addItem(itemType, minedAmount);
        }
        return minedAmount;
    }

    selectHotbar(index: number): void {
        const slot = this.inventory.getHotbarSlot(index);
        this._selectedHotbarIndex = slot.itemType ? index : undefined;
        this.inventory.markChanged();
    }

    get selectedItem(): ItemType | undefined {
        if (this._selectedHotbarIndex === undefined) {
            return undefined;
        }
        return this.inventory.getHotbarSlot(this._selectedHotbarIndex).itemType;
    }

    get selectedHotbarIndex(): number | undefined {
        return this._selectedHotbarIndex;
    }

    get placementDirection(): Direction {
        return this._placementDirection;
    }

    rotatePlacement(): void {
        const directions: Direction[] = ['north', 'east', 'south', 'west'];
        const currentIndex = directions.indexOf(this._placementDirection);
        this._placementDirection = directions[(currentIndex + 1) % directions.length];
    }

    placeSelectedBuilding(position: GridPosition): boolean {
        if (this._selectedHotbarIndex === undefined
            || (this.selectedItem !== 'mining-drill' && this.selectedItem !== 'wooden-chest')) {
            return false;
        }
        const type = this.selectedItem;
        const definition = getBuildingDefinition(type);
        const tile = this.world.getTile(position);
        if (!definition.allowedTileTypes.includes(tile.definition.type) || this.buildings.getAt(position)) {
            return false;
        }
        if (!this.inventory.removeHotbarItem(this._selectedHotbarIndex, 1)) {
            return false;
        }
        this.buildings.add(type, position, this._placementDirection);
        return true;
    }

    update(framesPassed: number): void {
        for (const building of this.buildings.all) {
            const definition = getBuildingDefinition(building.type);
            if (!definition.outputItem || !definition.miningInterval || !definition.miningAmount) {
                continue;
            }
            building.progress += framesPassed;
            while (building.progress >= definition.miningInterval) {
                building.progress -= definition.miningInterval;
                const output = getBuildingOutput(building);
                const chest = this.buildings.getAt(output.position);
                if (chest?.type === 'wooden-chest'
                    ? !this.canAddToChest(chest, definition.outputItem, definition.miningAmount)
                    : !this.inventory.canAddItem(definition.outputItem, definition.miningAmount)) {
                    break;
                }
                const minedAmount = this.world.mine(building.position, definition.miningAmount);
                if (minedAmount > 0) {
                    this.emitOutput(building, definition.outputItem, minedAmount);
                }
            }
        }
    }

    emitOutput(building: BuildingState['all'][number], itemType: ItemType, quantity: number): number {
        const output = getBuildingOutput(building);
        const chest = this.buildings.getAt(output.position);
        if (chest?.type === 'wooden-chest' && this.addToChest(chest, itemType, quantity)) {
            return quantity;
        }
        return this.inventory.addItem(itemType, quantity) ? quantity : 0;
    }

    private canAddToChest(chest: BuildingInstance, itemType: ItemType, quantity: number): boolean {
        return this.getChestCapacity(chest, itemType) >= quantity;
    }

    private addToChest(chest: BuildingInstance, itemType: ItemType, quantity: number): boolean {
        if (!this.canAddToChest(chest, itemType, quantity) || !chest.storage) {
            return false;
        }
        const item = ITEM_DEFINITIONS[itemType];
        let remaining = quantity;
        if (item.stackable) {
            for (const slot of chest.storage) {
                if (slot.itemType !== itemType || slot.quantity >= item.maxStackSize) continue;
                const amount = Math.min(remaining, item.maxStackSize - slot.quantity);
                slot.quantity += amount;
                remaining -= amount;
                if (remaining === 0) return true;
            }
        }
        for (const slot of chest.storage) {
            if (slot.itemType || remaining === 0) continue;
            slot.itemType = itemType;
            slot.quantity = Math.min(remaining, item.maxStackSize);
            remaining -= slot.quantity;
        }
        return remaining === 0;
    }

    private getChestCapacity(chest: BuildingInstance, itemType: ItemType): number {
        if (!chest.storage) return 0;
        const item = ITEM_DEFINITIONS[itemType];
        return chest.storage.reduce((capacity, slot) => {
            if (!slot.itemType) return capacity + item.maxStackSize;
            if (slot.itemType === itemType && item.stackable) return capacity + Math.max(0, item.maxStackSize - slot.quantity);
            return capacity;
        }, 0);
    }
}
