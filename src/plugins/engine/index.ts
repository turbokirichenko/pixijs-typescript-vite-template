import { Container, Sprite, Application } from 'pixi.js';
import { IApplication, IContainer, ISprite } from '../../app/interfaces';

export class PixiContainer<T> extends Container implements IContainer {};
export class PixiSprite<T> extends Sprite implements ISprite {};
export class PixiApplication<T> extends Application implements IApplication {};