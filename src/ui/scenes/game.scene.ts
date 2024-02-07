import { PixiContainer, PixiSprite } from "../../plugins/engine";
import { Manager, SceneInterface } from "../../entities/manager";

export class GameScene extends PixiContainer implements SceneInterface {
    //you can  remove all of this variable
    private _viteLogo: PixiSprite;
    private _tsLogo: PixiSprite;
    private _pixiLogo: PixiSprite;

    constructor() {
        super();

        this.position.x = 0;
        this.position.y = 0;
        const parentWidth = Manager.width;
        const parentHeight = Manager.height;
        
        //you can remove all of this code
        //initialize sprites
        this._viteLogo = PixiSprite.from("vite-logo");
        this._viteLogo.anchor.set(0.5);
        this._viteLogo.width = 50;
        this._viteLogo.height = 50;
        this._viteLogo.position.x = parentWidth/2 - 120;
        this._viteLogo.position.y = parentHeight/2;

        this._pixiLogo = PixiSprite.from("pixi-logo");
        this._pixiLogo.anchor.set(0.5);
        this._pixiLogo.width = 128;
        this._pixiLogo.height = 50;
        this._pixiLogo.position.x = parentWidth/2;
        this._pixiLogo.position.y = parentHeight/2;

        this._tsLogo = PixiSprite.from("ts-logo");
        this._tsLogo.anchor.set(0.5);
        this._tsLogo.width = 50;
        this._tsLogo.height = 50;
        this._tsLogo.position.x = parentWidth/2 + 120;
        this._tsLogo.position.y = parentHeight/2;

        this.addChild(this._viteLogo, this._tsLogo, this._pixiLogo);
    }

    update(framesPassed: number): void {
        framesPassed = 0;
    }

    resize(parentWidth: number, parentHeight: number): void {
        //
        this._viteLogo.position.x = parentWidth/2 - 120;
        this._viteLogo.position.y = parentHeight/2;

        this._pixiLogo.position.x = parentWidth/2;
        this._pixiLogo.position.y = parentHeight/2;

        this._tsLogo.position.x = parentWidth/2 + 120;
        this._tsLogo.position.y = parentHeight/2;
    }
}