import { PixiContainer } from "../../plugins/engine";

export class LoadingBoxContainer extends PixiContainer {
    constructor(parentWidth: number, parentHeight: number) {
        super();

        this.width = parentWidth;
        this.height = parentHeight;
    }
}