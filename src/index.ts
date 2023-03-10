import { SceneManager } from './shared/scene-manager';
import { LoaderScene } from './scenes/loader-scene';
import { FILL_COLOR } from './shared/constants';

SceneManager.init(FILL_COLOR);

const loady: LoaderScene = new LoaderScene();
SceneManager.changeScene(loady);