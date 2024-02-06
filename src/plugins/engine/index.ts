import { Container, Sprite, Application } from 'pixi.js';
import { IApplication } from '../../app/interfaces';

export class PixiContainer extends Container {};
export class PixiSprite extends Sprite {};
export class PixiApplication extends Application implements IApplication {};