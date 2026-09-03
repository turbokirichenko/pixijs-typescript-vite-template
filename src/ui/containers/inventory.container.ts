import { Rectangle } from 'pixi.js';
import { PixiContainer, PixiGraphics, PixiText } from '../../plugins/engine';
import { GameState } from '../../entities/game-state';
import { InventorySlot } from '../../entities/inventory';
import { ITEM_DEFINITIONS } from '../../entities/inventory';
import { drawPickaxe } from '../draw/pickaxe';
import { drawChest } from '../draw/chest';

export class InventoryContainer extends PixiContainer {
    private readonly _state: GameState;
    private readonly _background: PixiGraphics;
    private readonly _backpackPanel: PixiContainer;
    private readonly _closeButton: PixiContainer;
    private readonly _backpackSlots: PixiContainer[] = [];
    private readonly _hotbarSlots: PixiContainer[] = [];
    private readonly _backpackTexts: PixiText[] = [];
    private readonly _hotbarTexts: PixiText[] = [];
    private readonly _backpackIcons: PixiContainer[] = [];
    private readonly _hotbarIcons: PixiContainer[] = [];
    private _slotSize = 44;
    private _gap = 4;
    private _dragSource?: number;
    private _lastVersion = -1;

    constructor(state: GameState) {
        super();
        this._state = state;
        this._background = new PixiGraphics();
        this._backpackPanel = new PixiContainer();
        this._closeButton = new PixiContainer();
        this._backpackPanel.addChild(this._background);
        this._backpackPanel.visible = false;
        this.addChild(this._backpackPanel);
        this.createSlotViews(this._backpackSlots, this._backpackTexts, this._backpackIcons, state.inventory.backpackSize, true);
        this.createSlotViews(this._hotbarSlots, this._hotbarTexts, this._hotbarIcons, state.inventory.hotbarSize, false);
        this.createCloseButton();
        this.eventMode = 'static';
    }

    resize(width: number, height: number): void {
        const totalWidth = width - 32;
        this._slotSize = Math.min(44, Math.max(28, (totalWidth - 8 * this._gap) / 9));
        this._gap = Math.max(2, this._slotSize * 0.1);
        const backpackWidth = 9 * this._slotSize + 8 * this._gap;
        const backpackX = Math.max(16, width - backpackWidth - 16);
        const backpackY = 16;
        const hotbarWidth = backpackWidth;
        const hotbarX = (width - hotbarWidth) / 2;
        const hotbarY = height - this._slotSize - 24;

        this._background.clear();
        this._background
            .rect(-10, -10, backpackWidth + 20, 3 * this._slotSize + 2 * this._gap + 20)
            .fill({ color: 0x182019, alpha: 0.8 });

        this._backpackPanel.position.set(backpackX, backpackY);
        this.positionSlots(this._backpackSlots, 0, 0);
        this.positionSlots(this._hotbarSlots, hotbarX, hotbarY);
        this._closeButton.position.set(backpackWidth - 2, -8);
        this.refreshSlots();
    }

    update(): void {
        if (this._lastVersion !== this._state.inventory.version) {
            this.refreshSlots();
        }
    }

    private createSlotViews(
        containers: PixiContainer[],
        texts: PixiText[],
        icons: PixiContainer[],
        count: number,
        isBackpack: boolean
    ): void {
        for (let index = 0; index < count; index += 1) {
            const slot = new PixiContainer();
            const graphics = new PixiGraphics();
            const icon = new PixiContainer();
            const text = new PixiText({
                text: '',
                style: { fontFamily: 'Arial', fontSize: 15, fill: 0xffffff }
            });
            text.anchor.set(1, 1);
            slot.addChild(graphics, icon, text);
            slot.eventMode = 'static';
            slot.hitArea = new Rectangle(0, 0, this._slotSize, this._slotSize);
            if (isBackpack) {
                slot.on('pointerdown', () => {
                    this._dragSource = index;
                });
            } else if (index === this._state.inventory.hotbarSize - 1) {
                slot.on('pointertap', () => {
                    this._backpackPanel.visible = true;
                });
            } else {
                slot.on('pointertap', () => {
                    this._state.selectHotbar(index);
                });
                slot.on('pointerup', () => {
                    if (this._dragSource !== undefined) {
                        this._state.inventory.moveBackpackToHotbar(this._dragSource, index);
                        this._dragSource = undefined;
                        this.refreshSlots();
                    }
                });
            }
            containers.push(slot);
            texts.push(text);
            icons.push(icon);
            (isBackpack ? this._backpackPanel : this).addChild(slot);
        }
    }

    private createCloseButton(): void {
        const graphics = new PixiGraphics();
        const text = new PixiText({
            text: '×',
            style: { fontFamily: 'Arial', fontSize: 22, fill: 0xffffff }
        });
        text.anchor.set(0.5);
        text.position.set(12, 12);
        graphics.rect(0, 0, 24, 24).fill(0x303b31).stroke({ width: 2, color: 0x151a16 });
        this._closeButton.addChild(graphics, text);
        this._closeButton.eventMode = 'static';
        this._closeButton.hitArea = new Rectangle(0, 0, 24, 24);
        this._closeButton.on('pointertap', () => {
            this._backpackPanel.visible = false;
        });
        this._backpackPanel.addChild(this._closeButton);
    }

    private positionSlots(slots: PixiContainer[], startX: number, startY: number): void {
        slots.forEach((slot, index) => {
            const columns = 9;
            const x = index % columns;
            const y = Math.floor(index / columns);
            slot.position.set(startX + x * (this._slotSize + this._gap), startY + y * (this._slotSize + this._gap));
            slot.hitArea = new Rectangle(0, 0, this._slotSize, this._slotSize);
            this.drawSlotBackground(slot, index, slots === this._hotbarSlots);
            const icon = slot.children[1] as PixiContainer;
            const text = slot.children[2] as PixiText;
            text.position.set(this._slotSize - 3, this._slotSize - 2);
            icon.position.set(this._slotSize / 2, this._slotSize / 2);
        });
    }

    private refreshSlots(): void {
        this._backpackSlots.forEach((slot, index) => this.drawSlotBackground(slot, index, false));
        this._hotbarSlots.forEach((slot, index) => this.drawSlotBackground(slot, index, true));
        this.refreshSlotTexts(this._backpackTexts, this._state.inventory.backpackSize, true);
        this.refreshSlotTexts(this._hotbarTexts, this._state.inventory.hotbarSize, false);
        this.refreshSlotIcons(this._backpackIcons, this._state.inventory.backpackSize, true);
        this.refreshSlotIcons(this._hotbarIcons, this._state.inventory.hotbarSize, false);
        this._lastVersion = this._state.inventory.version;
    }

    private drawSlotBackground(slot: PixiContainer, index: number, isHotbar: boolean): void {
        const graphics = slot.children[0] as PixiGraphics;
        const selected = isHotbar && this._state.selectedHotbarIndex === index;
        graphics
            .clear()
            .rect(0, 0, this._slotSize, this._slotSize)
            .fill(selected ? 0x657b55 : 0x38463a)
            .stroke({ width: selected ? 3 : 2, color: selected ? 0xffd166 : 0x151a16 });
        if (isHotbar && index === this._state.inventory.hotbarSize - 1) {
            graphics
                .rect(this._slotSize * 0.25, this._slotSize * 0.35, this._slotSize * 0.5, this._slotSize * 0.4)
                .fill(0xb78b54)
                .stroke({ width: 2, color: 0x6b4b2d });
            graphics
                .moveTo(this._slotSize * 0.25, this._slotSize * 0.35)
                .lineTo(this._slotSize * 0.75, this._slotSize * 0.35)
                .stroke({ width: 2, color: 0xd0a66a });
        }
    }

    private refreshSlotTexts(texts: PixiText[], count: number, isBackpack: boolean): void {
        for (let index = 0; index < count; index += 1) {
            const slot = isBackpack
                ? this._state.inventory.getBackpackSlot(index)
                : this._state.inventory.getHotbarSlot(index);
            texts[index].text = !isBackpack && index === this._state.inventory.hotbarSize - 1
                ? ''
                : this.getSlotText(slot);
        }
    }

    private refreshSlotIcons(icons: PixiContainer[], count: number, isBackpack: boolean): void {
        for (let index = 0; index < count; index += 1) {
            const slot = isBackpack
                ? this._state.inventory.getBackpackSlot(index)
                : this._state.inventory.getHotbarSlot(index);
            const iconView = icons[index];
            iconView.removeChildren().forEach((child) => child.destroy());
            if (!slot.itemType || (!isBackpack && index === this._state.inventory.hotbarSize - 1)) {
                continue;
            }
            const item = ITEM_DEFINITIONS[slot.itemType];
            if (item.iconShape === 'pickaxe') {
                const pickaxeIcon = new PixiGraphics();
                drawPickaxe(pickaxeIcon, 0, 0, this._slotSize * 0.62, 0, 1);
                iconView.addChild(pickaxeIcon);
                continue;
            }
            if (item.iconShape === 'chest') {
                const chestIcon = new PixiGraphics();
                drawChest(chestIcon, 0, 0, this._slotSize * 0.78, 1);
                iconView.addChild(chestIcon);
                continue;
            }
            const coalIcon = new PixiGraphics();
            coalIcon
                .circle(-this._slotSize * 0.12, this._slotSize * 0.03, this._slotSize * 0.15)
                .circle(this._slotSize * 0.1, -this._slotSize * 0.08, this._slotSize * 0.17)
                .circle(this._slotSize * 0.2, this._slotSize * 0.12, this._slotSize * 0.11)
                .fill(item.color);
            iconView.addChild(coalIcon);
        }
    }

    private getSlotText(slot: InventorySlot): string {
        if (!slot.itemType) {
            return '';
        }
        return `${slot.quantity}`;
    }
}
