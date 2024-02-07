import { AssetsInterface } from "./interfaces/assets.interface";
import { LoaderInterface, LoaderOptions, LoadingCallback } from "./interfaces/loader.interface";

/** Loader entity, to load assets for gameplay
 * 
 */
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
        if (!data.manifest) {
            return;
        }
        await this._assets.init(data);
        const ids = data.manifest.bundles.map(bundle => bundle.name);
        await this._assets.loadBundle(ids, onLoading);
        this._isLoaded = true;
    }
}