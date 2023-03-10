import { Container, Assets } from 'pixi.js'
import { LoadingBarContainer } from '../containers/loading-bar-container';
import { SceneManager, IScene } from '../shared/scene-manager';
import { GameScene } from './game-scene';
import { manifest } from '../shared/manifest';
import { sound } from "@pixi/sound";

export class LoaderScene extends Container implements IScene {
    private _loadingBar: LoadingBarContainer;

    constructor() {
        super();

        const loaderBarWidth = 280;
        this._loadingBar = new LoadingBarContainer(loaderBarWidth, SceneManager.width, SceneManager.height);
        
        this.addChild(this._loadingBar);
        this.initLoader().then(() => {
            this.loaded();
        });
    }

    async initLoader(): Promise<void> {
        await Assets.init({manifest: manifest});
        const bundlesIds = manifest.bundles.map(bundle => bundle.name);
        await Assets.loadBundle(bundlesIds, this.downloadProgress.bind(this));
    }

    private downloadProgress(progressRatio: number): void {
        this._loadingBar.scaleProgress(progressRatio);
    }

    private loaded(): void {
        sound.play("forklift-effect");
        SceneManager.changeScene(new GameScene(SceneManager.width, SceneManager.height))
    }

    update(framesPassed: number): void {
        //...
    }

    resize(parentWidth: number, parentHeight: number): void {
        //...
    }
}