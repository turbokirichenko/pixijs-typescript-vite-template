import { PixiContainer, PixiSprite, PixiSoundLibrary, PixiText } from "../../plugins/engine";
import { Manager, SceneInterface } from "../../entities/manager";
import { Assets } from "pixi.js";

export class GameScene extends PixiContainer implements SceneInterface {
    // you may remove all of these variables
    private _viteLogo: PixiSprite;
    private _tsLogo: PixiSprite;
    private _pixiLogo: PixiSprite;
    private _sound: PixiSoundLibrary;
    private _soundLogo: PixiSprite;
    private _pixiText: PixiText;

    constructor() {
        super();
        this.interactive = true;
        this.position.x = 0;
        this.position.y = 0;
        const parentWidth = Manager.width;
        const parentHeight = Manager.height;
        
        // you may remove all of these
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

        this._pixiText = new PixiText({
            text: 'Click on icon!',
            style: {
                fontFamily: 'Arial',
                fontSize: 24,
                fill: 0xff1010,
                align: 'center',
            }
        })
        this._pixiText.anchor.set(0.5);
        this._pixiText.position.x = parentWidth/2;
        this._pixiText.position.y = parentHeight/2 + 60;

        this._soundLogo = PixiSprite.from("sound-gif");
        this._soundLogo.anchor.set(0.5);
        this._soundLogo.position.x = 80;
        this._soundLogo.position.y = 60;

        this._sound = new PixiSoundLibrary();
        this._sound.add("forklift-effect", Assets.get("forklift-effect"));
        this._sound.disableAutoPause = true;
        this.on("pointerdown", () => {
            this._sound.play("forklift-effect");
        })
        this.addChild(this._viteLogo, this._tsLogo, this._pixiLogo, this._pixiText, this._soundLogo);
    }

    update(framesPassed: number): void {
        framesPassed = 0;
        this._soundLogo.visible = this._sound.isPlaying() ? true : false;
    }

    resize(parentWidth: number, parentHeight: number): void {
        this._viteLogo.position.x = parentWidth/2 - 120;
        this._viteLogo.position.y = parentHeight/2;

        this._pixiLogo.position.x = parentWidth/2;
        this._pixiLogo.position.y = parentHeight/2;

        this._tsLogo.position.x = parentWidth/2 + 120;
        this._tsLogo.position.y = parentHeight/2;

        this._pixiText.position.x = parentWidth/2;
        this._pixiText.position.y = parentHeight/2 + 60;
    }
}