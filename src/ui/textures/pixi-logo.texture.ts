import { PixiTexture, PixiBaseTexture } from "../../plugins/engine";

export class PixiLogoTexture extends PixiTexture {
    constructor(source: string) {
        const baseTexture = PixiBaseTexture.from(source);
        super(baseTexture);
    }
}