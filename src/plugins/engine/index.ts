import { Stage } from '@pixi/layers';
import { Container, Sprite, Application, Texture, BaseTexture, IApplicationOptions, Assets } from 'pixi.js';
import { Layer } from '@pixi/layers';
import { diffuseGroup, normalGroup, lightGroup } from '@pixi/lights';

export class PixiContainer extends Container {};
export class PixiSprite extends Sprite {};
export class PixiApplication extends Application {};
export class PixiTexture extends Texture {};
export class PixiBaseTexture extends BaseTexture {};
export class PixiStage extends Stage {};
export class PixiLayer extends Layer {};
export interface IPixiApplicationOptions extends IApplicationOptions {};
export const PixiLightGroups = {
    diffuseGroup,
    normalGroup,
    lightGroup
};
export { Assets as PixiAssets };