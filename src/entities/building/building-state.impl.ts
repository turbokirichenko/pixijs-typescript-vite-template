import { BuildingInstance, BuildingType, Direction } from './interfaces/building.interface';
import { GridPosition } from '../world';
import { getBuildingDefinition } from './building-definitions';

export class BuildingState {
    private readonly _buildings: BuildingInstance[] = [];
    private _nextId = 1;

    get all(): readonly BuildingInstance[] {
        return this._buildings;
    }

    getAt(position: GridPosition): BuildingInstance | undefined {
        return this._buildings.find((building) =>
            building.position.x === position.x && building.position.y === position.y
        );
    }

    add(type: BuildingType, position: GridPosition, direction: Direction): BuildingInstance {
        const definition = getBuildingDefinition(type);
        const building: BuildingInstance = {
            id: this._nextId,
            type,
            position: { ...position },
            direction,
            progress: 0,
            storage: definition.storageSize
                ? Array.from({ length: definition.storageSize }, () => ({ quantity: 0 }))
                : undefined
        };
        this._nextId += 1;
        this._buildings.push(building);
        return building;
    }
}
