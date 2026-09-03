import { PixiGraphics } from '../../plugins/engine';

export function drawChest(
    graphics: PixiGraphics,
    centerX: number,
    centerY: number,
    size: number,
    alpha: number
): void {
    const width = size * 0.68;
    const height = size * 0.54;
    const x = centerX - width / 2;
    const y = centerY - height / 2;
    const lineWidth = Math.max(1, size * 0.045);

    graphics
        .rect(x + size * 0.04, y + size * 0.06, width, height)
        .fill({ color: 0x704329, alpha })
        .stroke({ width: lineWidth, color: 0x302018, alpha });
    graphics
        .rect(x, y, width, height * 0.44)
        .fill({ color: 0xb87943, alpha })
        .stroke({ width: lineWidth, color: 0x392319, alpha });
    graphics
        .rect(centerX - lineWidth, y, lineWidth * 2, height)
        .fill({ color: 0x55402b, alpha });
    graphics
        .rect(centerX - size * 0.07, centerY - size * 0.01, size * 0.14, size * 0.14)
        .fill({ color: 0xd3a24d, alpha })
        .stroke({ width: lineWidth * 0.7, color: 0x4c351d, alpha });
}
