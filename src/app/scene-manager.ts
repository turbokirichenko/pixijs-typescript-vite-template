import { Application } from "pixi.js";
import { Stage, Layer } from "@pixi/layers";
import { diffuseGroup, normalGroup, lightGroup } from "@pixi/lights";
import { IApplication, IScene, ISceneManagerConfig } from "./interfaces";

export class SceneManager {
    //class is almost will be static
    private constructor() {};
    private static _app: IApplication;
    private static _currentScene: IScene;

    public static get width() {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }

    public static get height() {
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }

    public static init(config: ISceneManagerConfig): void {
        SceneManager._app = new Application({
            view: document.getElementById("pixi-screen") as HTMLCanvasElement,
            resizeTo: window,
	        resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: config.fill,
        });

        SceneManager._app.stage = new Stage();
        SceneManager._app.stage.addChild(
            new Layer(diffuseGroup),
            new Layer(normalGroup),
            new Layer(lightGroup)
        );
        SceneManager._app.ticker.add(SceneManager.update);
        window.addEventListener("resize", SceneManager.resize);
    }

    public static changeScene(newScene: IScene): void {
        if (SceneManager._currentScene) {
            SceneManager._app.stage.removeChild(SceneManager._currentScene);
            SceneManager._currentScene.destroy();
        }

        // Add the new one
        SceneManager._currentScene = newScene;
        SceneManager._app.stage.addChild(SceneManager._currentScene);
    }

    private static update(framesPassed: number): void {
        if (SceneManager._currentScene) {
            SceneManager._currentScene.update(framesPassed);
        }
    }

    public static resize(): void {
        // if we have a scene, we let it know that a resize happened!
        if (SceneManager._currentScene) {
            SceneManager._currentScene.resize(SceneManager.width, SceneManager.height);
        }
    }
}