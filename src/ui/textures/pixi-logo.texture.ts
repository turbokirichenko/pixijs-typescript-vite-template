import { PixiTexture } from "../../plugins/engine";

export class PixiLogoTexture extends PixiTexture {
    constructor(source: string) {
        const baseTexture = PixiTexture.from(source);
        super(baseTexture);
    }
}