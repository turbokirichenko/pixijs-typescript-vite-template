import { BuildingInstance, BuildingOutput, Direction } from './interfaces/building.interface';

export function getBuildingOutput(building: BuildingInstance): BuildingOutput {
    return {
        position: getOutputPosition(building.position, building.direction),
        direction: building.direction
    };
}

export function getOutputPosition(position: { x: number; y: number }, direction: Direction): { x: number; y: number } {
    const offsets: Record<Direction, { x: number; y: number }> = {
        north: { x: 0, y: -1 },
        east: { x: 1, y: 0 },
        south: { x: 0, y: 1 },
        west: { x: -1, y: 0 }
    };
    const offset = offsets[direction];
    return { x: position.x + offset.x, y: position.y + offset.y };
}
