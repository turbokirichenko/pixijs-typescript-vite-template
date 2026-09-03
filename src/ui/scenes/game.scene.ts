import { PixiContainer } from "../../plugins/engine";
import { SceneInterface } from "../../entities/manager";
import { GameState } from "../../entities/game-state";
import { WorldCoordinateSystem } from "../../entities/world";
import { WorldContainer } from "../containers/world.container";
import { InventoryContainer } from "../containers/inventory.container";

export class GameScene extends PixiContainer implements SceneInterface {
    private readonly _world: WorldContainer;
    private readonly _inventory: InventoryContainer;
    private readonly _state: GameState;

    constructor() {
        super();
        const gameState = new GameState({
            columns: 64,
            rows: 40,
            tileSize: 32,
            coalClusterCount: 8,
            coalClusterMinSize: 8,
            coalClusterMaxSize: 18,
            coalResourceMin: 300,
            coalResourceMax: 900
        });
        this._state = gameState;
        const coordinates = new WorldCoordinateSystem(gameState.world.tileSize);
        this._world = new WorldContainer(gameState, coordinates);
        this._inventory = new InventoryContainer(gameState);
        this.addChild(this._world);
        this.addChild(this._inventory);
    }

    update(_framesPassed: number): void {
        this._state.update(_framesPassed);
        this._world.update();
        this._inventory.update();
    }

    resize(parentWidth: number, parentHeight: number): void {
        this._world.resize(parentWidth, parentHeight);
        this._inventory.resize(parentWidth, parentHeight);
    }
}
