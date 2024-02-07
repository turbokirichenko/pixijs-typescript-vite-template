import { PixiContainer } from "../../plugins/engine";
import { Manager, SceneInterface } from "../../entities/manager";
import { LoadingBarContainer } from "../containers/loading-bar.container";

export class LoaderScene extends PixiContainer implements SceneInterface {

    private _loadingBar: LoadingBarContainer;
    constructor() {
        super();
        //this.position.x = Manager.width/2;
        //this.position.y = Manager.height/2;
        const parentWidth = Manager.width;
        const parentHeight = Manager.height;

        const loaderBarWidth = 280;
        this._loadingBar = new LoadingBarContainer(loaderBarWidth, parentWidth, parentHeight);
        this.addChild(this._loadingBar);
    }

    progressCallback(progress: number): void {
        this._loadingBar.scaleProgress(progress);
    }

    update(framesPassed: number): void { framesPassed = 0; }
    resize(screenWidth: number, screenHeight: number): void { 
        this.width = screenWidth; 
        this.height = screenHeight; 
        this._loadingBar.resize(screenWidth, screenHeight);
    }
}