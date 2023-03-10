import { Container, Sprite } from 'pixi.js';
import { IScene } from '../shared/scene-manager';

export class GameScene extends Container implements IScene {
    //you can  remove all of this variable
    private _viteLogo: Sprite;
    private _tsLogo: Sprite;
    private _pixiLogo: Sprite;

    constructor(parentWidth: number, parentHeight: number) {
        super();

        //you can remove all of this code
        //initialize sprites
        this._viteLogo = Sprite.from("vite-logo");
        this._viteLogo.anchor.set(0.5);
        this._viteLogo.width = 50;
        this._viteLogo.height = 50;
        this._viteLogo.position.x = parentWidth/2 - 120;
        this._viteLogo.position.y = parentHeight/2;

        this._pixiLogo = Sprite.from("pixi-logo");
        this._pixiLogo.anchor.set(0.5);
        this._pixiLogo.width = 128;
        this._pixiLogo.height = 50;
        this._pixiLogo.position.x = parentWidth/2;
        this._pixiLogo.position.y = parentHeight/2;

        this._tsLogo = Sprite.from("ts-logo");
        this._tsLogo.anchor.set(0.5);
        this._tsLogo.width = 50;
        this._tsLogo.height = 50;
        this._tsLogo.position.x = parentWidth/2 + 120;
        this._tsLogo.position.y = parentHeight/2;

        this.addChild(this._viteLogo, this._tsLogo, this._pixiLogo);
    }

    update(framesPassed: number): void {
        
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