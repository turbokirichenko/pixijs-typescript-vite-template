import {
    InventoryInterface,
    InventorySlot,
    ItemType
} from './interfaces/inventory.interface';
import { ITEM_DEFINITIONS } from './item-definitions';

export class InventoryState implements InventoryInterface {
    readonly backpackSize = 27;
    readonly hotbarSize = 9;
    private readonly _backpack: InventorySlot[];
    private readonly _hotbar: InventorySlot[];
    private _version = 0;

    constructor() {
        this._backpack = this.createSlots(this.backpackSize);
        this._hotbar = this.createSlots(this.hotbarSize);
        this._hotbar[0] = { itemType: 'mining-drill', quantity: 99 };
        this._hotbar[1] = { itemType: 'wooden-chest', quantity: 99 };
    }

    get version(): number {
        return this._version;
    }

    getBackpackSlot(index: number): InventorySlot {
        this.assertIndex(index, this.backpackSize);
        return this._backpack[index];
    }

    getHotbarSlot(index: number): InventorySlot {
        this.assertIndex(index, this.hotbarSize);
        return this._hotbar[index];
    }

    markChanged(): void {
        this._version += 1;
    }

    canAddItem(itemType: ItemType, quantity: number): boolean {
        if (!Number.isInteger(quantity) || quantity <= 0) {
            return false;
        }

        const item = ITEM_DEFINITIONS[itemType];
        let remaining = quantity;
        for (const slot of this._backpack) {
            if (!slot.itemType) {
                remaining -= item.maxStackSize;
            } else if (slot.itemType === itemType && item.stackable) {
                remaining -= Math.max(0, item.maxStackSize - slot.quantity);
            }
        }
        return remaining <= 0;
    }

    addItem(itemType: ItemType, quantity: number): boolean {
        if (!this.canAddItem(itemType, quantity)) {
            return false;
        }

        const item = ITEM_DEFINITIONS[itemType];
        let remaining = quantity;
        if (item.stackable) {
            for (const slot of this._backpack) {
                if (slot.itemType !== itemType || slot.quantity >= item.maxStackSize) {
                    continue;
                }
                const added = Math.min(remaining, item.maxStackSize - slot.quantity);
                slot.quantity += added;
                remaining -= added;
                if (remaining === 0) {
                    break;
                }
            }
        }

        for (const slot of this._backpack) {
            if (remaining === 0) {
                break;
            }
            if (slot.itemType) {
                continue;
            }
            const added = Math.min(remaining, item.maxStackSize);
            slot.itemType = itemType;
            slot.quantity = added;
            remaining -= added;
        }
        this._version += 1;
        return true;
    }

    removeHotbarItem(index: number, quantity: number): boolean {
        this.assertIndex(index, this.hotbarSize);
        const slot = this._hotbar[index];
        if (!Number.isInteger(quantity) || quantity <= 0 || !slot.itemType || slot.quantity < quantity) {
            return false;
        }
        slot.quantity -= quantity;
        if (slot.quantity === 0) {
            slot.itemType = undefined;
        }
        this._version += 1;
        return true;
    }

    moveBackpackToHotbar(backpackIndex: number, hotbarIndex: number): boolean {
        this.assertIndex(backpackIndex, this.backpackSize);
        this.assertIndex(hotbarIndex, this.hotbarSize);
        const backpackSlot = this._backpack[backpackIndex];
        if (!backpackSlot.itemType) {
            return false;
        }

        const hotbarSlot = this._hotbar[hotbarIndex];
        const item = ITEM_DEFINITIONS[backpackSlot.itemType];
        if (hotbarSlot.itemType === backpackSlot.itemType && item.stackable) {
            const moved = Math.min(item.maxStackSize - hotbarSlot.quantity, backpackSlot.quantity);
            hotbarSlot.quantity += moved;
            backpackSlot.quantity -= moved;
            if (backpackSlot.quantity === 0) {
                backpackSlot.itemType = undefined;
            }
            if (moved > 0) {
                this._version += 1;
                return true;
            }
        }
        const previousSlot = { ...hotbarSlot };
        this._hotbar[hotbarIndex] = { ...backpackSlot };
        this._backpack[backpackIndex] = previousSlot;
        this._version += 1;
        return true;
    }

    private createSlots(size: number): InventorySlot[] {
        return Array.from({ length: size }, () => ({ quantity: 0 }));
    }

    private assertIndex(index: number, size: number): void {
        if (!Number.isInteger(index) || index < 0 || index >= size) {
            throw new Error(`Inventory slot index is outside the inventory: ${index}`);
        }
    }
}
