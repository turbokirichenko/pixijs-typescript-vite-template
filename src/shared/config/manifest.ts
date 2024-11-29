import type { LoaderOptions } from "../../entities/loader";

export const options: LoaderOptions = {
    manifest: {
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
                    "forklift-effect": "sound/forklift-effect.wav",
                    "sound-gif": "sound/sound-gif.gif"
                }
            }
        ]
    }
}