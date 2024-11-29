import './style.css';
import '@pixi/gif';
import { App } from './app';
import { FILL_COLOR } from './shared/constant/constants';
import { Manager } from './entities/manager';
import { IPixiApplicationOptions, PixiAssets } from './plugins/engine';
import { Loader } from './entities/loader';
import { options } from './shared/config/manifest';
import { LoaderScene } from './ui/scenes/loader.scene';
import { GameScene } from './ui/scenes/game.scene';

const boostsrap = async () => {
    const canvas = document.getElementById("pixi-screen") as HTMLCanvasElement;
    const resizeTo = window;
    const resolution = window.devicePixelRatio || 1;
    const autoDensity = true;
    const backgroundColor = FILL_COLOR;
    const appOptions: Partial<IPixiApplicationOptions> = {
        canvas,
        resizeTo,
        resolution,
        autoDensity,
        backgroundColor
    }

    const application = new App();
    await application.init(appOptions);

    Manager.init(application);
    const loader = new Loader(PixiAssets);
    const loaderScene = new LoaderScene();
    Manager.changeScene(loaderScene);
    loader.download(options, loaderScene.progressCallback.bind(loaderScene)).then(() => {
        Manager.changeScene(new GameScene());
    });
}

boostsrap();
