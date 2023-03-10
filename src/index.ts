import { SceneManager } from './shared/scene-manager';
import { LoaderScene } from './scenes/loader-scene';

SceneManager.init(0xffffff);

const loady: LoaderScene = new LoaderScene();
SceneManager.changeScene(loady);