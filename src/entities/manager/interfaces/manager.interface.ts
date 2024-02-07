import { ApplicationInterface, StageInterface } from "./application.interface";
import { SceneInterface } from "./scene.interface";

export interface ManagerInterface {
    init(app: ApplicationInterface, stage: StageInterface): void;
    changeScene(newScene: SceneInterface): void;
}