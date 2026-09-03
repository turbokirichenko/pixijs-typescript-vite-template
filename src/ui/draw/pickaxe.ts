import { PixiGraphics } from '../../plugins/engine'

export function drawPickaxe(
    graphics: PixiGraphics,
    centerX: number,
    centerY: number,
    size: number,
    rotation: number,
    alpha: number
): void {
    const point = (x: number, y: number) => {
        const scaledX = x * size
        const scaledY = y * size

        return {
            x: centerX + scaledX * Math.cos(rotation) - scaledY * Math.sin(rotation),
            y: centerY + scaledX * Math.sin(rotation) + scaledY * Math.cos(rotation)
        }
    }

    // 木柄
    const handle = [
        point(-0.34, 0.34),
        point(-0.25, 0.39),
        point(0.25, -0.25),
        point(0.17, -0.32)
    ]

    graphics
        .moveTo(handle[0].x, handle[0].y)
        .lineTo(handle[1].x, handle[1].y)
        .lineTo(handle[2].x, handle[2].y)
        .lineTo(handle[3].x, handle[3].y)
        .closePath()
        .fill({ color: 0x8b5a2b, alpha })

    // 木柄暗部
    const handleShadow = [
        point(-0.34, 0.34),
        point(-0.25, 0.39),
        point(0.25, -0.25),
        point(0.2, -0.2)
    ]

    graphics
        .moveTo(handleShadow[0].x, handleShadow[0].y)
        .lineTo(handleShadow[1].x, handleShadow[1].y)
        .lineTo(handleShadow[2].x, handleShadow[2].y)
        .lineTo(handleShadow[3].x, handleShadow[3].y)
        .closePath()
        .fill({ color: 0x633d1f, alpha })

    // 镐头，Minecraft 风格阶梯结构
    const head = [
        point(-0.45, -0.35),
        point(-0.34, -0.46),
        point(0.02, -0.46),
        point(0.14, -0.37),
        point(0.32, -0.37),
        point(0.43, -0.28),
        point(0.34, -0.18),
        point(0.15, -0.18),
        point(0.06, -0.10),
        point(-0.14, -0.10),
        point(-0.14, -0.20),
        point(-0.34, -0.20)
    ]

    graphics
        .moveTo(head[0].x, head[0].y)
        .lineTo(head[1].x, head[1].y)
        .lineTo(head[2].x, head[2].y)
        .lineTo(head[3].x, head[3].y)
        .lineTo(head[4].x, head[4].y)
        .lineTo(head[5].x, head[5].y)
        .lineTo(head[6].x, head[6].y)
        .lineTo(head[7].x, head[7].y)
        .lineTo(head[8].x, head[8].y)
        .lineTo(head[9].x, head[9].y)
        .lineTo(head[10].x, head[10].y)
        .lineTo(head[11].x, head[11].y)
        .closePath()
        .fill({ color: 0x9fa6a1, alpha })
        .stroke({
            width: Math.max(1, size * 0.035),
            color: 0x3f4542,
            alpha
        })

    // 镐头亮面
    const highlight = [
        point(-0.34, -0.42),
        point(0.01, -0.42),
        point(0.10, -0.35),
        point(-0.25, -0.35)
    ]

    graphics
        .moveTo(highlight[0].x, highlight[0].y)
        .lineTo(highlight[1].x, highlight[1].y)
        .lineTo(highlight[2].x, highlight[2].y)
        .lineTo(highlight[3].x, highlight[3].y)
        .closePath()
        .fill({ color: 0xd7dcd8, alpha })

    // 镐头暗面
    const shadow = [
        point(0.14, -0.37),
        point(0.32, -0.37),
        point(0.43, -0.28),
        point(0.34, -0.18),
        point(0.15, -0.18),
        point(0.23, -0.25)
    ]

    graphics
        .moveTo(shadow[0].x, shadow[0].y)
        .lineTo(shadow[1].x, shadow[1].y)
        .lineTo(shadow[2].x, shadow[2].y)
        .lineTo(shadow[3].x, shadow[3].y)
        .lineTo(shadow[4].x, shadow[4].y)
        .lineTo(shadow[5].x, shadow[5].y)
        .closePath()
        .fill({ color: 0x737a76, alpha })
}