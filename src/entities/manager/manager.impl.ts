import { ApplicationInterface } from "./interfaces/application.interface";
import { SceneInterface } from "./interfaces/scene.interface";

export class ManagerImpl {
    constructor() {};
    private static _app?: ApplicationInterface = undefined;
    private static _currentScene?: SceneInterface = undefined;

    public static get width() {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }

    public static get height() {
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }

    static init(app: ApplicationInterface): void {
        ManagerImpl._app = app;
        ManagerImpl._app.panel.resize(ManagerImpl.resize);
        ManagerImpl._app.ticker.add(ManagerImpl.update);
    }

    static changeScene(newScene: SceneInterface): void {
        if (ManagerImpl._currentScene) {
            ManagerImpl._app?.stage.removeChild(ManagerImpl._currentScene);
            ManagerImpl._currentScene.destroy();
        }

        // Add the new one
        ManagerImpl._currentScene = newScene;
        ManagerImpl._app?.stage.addChild(ManagerImpl._currentScene);
    }

    private static update(framesPassed: number): void {
        if (ManagerImpl._currentScene) {
            ManagerImpl._currentScene.update(framesPassed);
        }
    }

    private static resize(): void {
        // if we have a scene, we let it know that a resize happened!
        if (ManagerImpl._currentScene) {
            ManagerImpl._currentScene.resize(ManagerImpl.width, ManagerImpl.height);
        }
    }
}