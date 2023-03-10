import type { ResolverManifest } from "pixi.js";

export const manifest: ResolverManifest = {
    bundles: [
        {
            name: "logo",
            assets: {
                "vite-logo": "logo/vite-logo.png",
                "ts-logo": "logo/ts-logo.png",
                "pixi-logo": "logo/pixi-logo.png"
            }
        },
        {
            name: "sound",
            assets: {
                "forklift-effect": "sound/forklift-effect.wav"
            }
        }
    ]
}