import { Assets, Container } from 'pixi.js'
import { LoadingBarContainer } from '../containers/loading-bar.container';
import { IScene } from '../../app/interfaces';
import { manifest } from '../../shared/config/manifest';

export class LoaderScene extends Container implements IScene {
    private _loadingBar: LoadingBarContainer;
    private _isLoaded: boolean;

    constructor(width: number, height: number) {
        super();

        const loaderBarWidth = 280;
        this._isLoaded = false;
        this._loadingBar = new LoadingBarContainer(loaderBarWidth, width, height);
        
        this.addChild(this._loadingBar);
        this.initLoader().then(async () => {
            this.loaded();
        });
    }

    get isLoaded(): boolean {
        return this._isLoaded;
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
        this._isLoaded = true;
    }

    update(framesPassed: number): void {
        //...
    }

    resize(parentWidth: number, parentHeight: number): void {
        //...
    }

    destroy(): void {
        
    }
}