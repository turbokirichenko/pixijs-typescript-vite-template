import { Manager, SceneInterface } from "../manager";
import { AssetsInterface } from "./interfaces/assets.interface";
import { LoaderInterface, LoaderOptions, LoadingCallback } from "./interfaces/loader.interface";

export class LoaderImpl implements LoaderInterface {
    private readonly _assets: AssetsInterface;

    private _isLoaded: boolean;
    get isLoaded() {
        return this._isLoaded;
    }

    constructor(assets: AssetsInterface) {
        this._assets = assets;
        this._isLoaded = false;
    }

    async download(data: LoaderOptions, onLoading: LoadingCallback): Promise<any> {
        if (this._isLoaded) {
            return;
        }
        await this._assets.init(data);
        const ids = data.manifest.bundles.map(bundle => bundle.name);
        await this._assets.loadBundle(ids, onLoading);
        this._isLoaded = true;
    }

    async switchTo(scene: SceneInterface) {
        Manager.changeScene(scene);
    }
}