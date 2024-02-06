import { SceneManager } from './scene-manager';
import { LoaderScene } from '../ui/scenes/loader-scene';
import { FILL_COLOR } from '../shared/constant/constants';

SceneManager.init({ fill: FILL_COLOR });

const loady: LoaderScene = new LoaderScene();
SceneManager.changeScene(loady);