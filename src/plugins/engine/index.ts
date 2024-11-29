import { Container, Sprite, Application, Texture, IApplicationOptions, Assets, BaseTexture, Graphics, Text } from 'pixi.js';
import { SoundLibrary, Options } from '@pixi/sound';
import { diffuseGroup, normalGroup, lightGroup } from '@pixi/lights';
import { Stage, Layer } from '@pixi/layers';

export { Container as PixiContainer };
export { Sprite as PixiSprite };
export { Application as PixiApplication };
export { Texture as PixiTexture };
export { Graphics as PixiGraphics };
export type { BaseTexture as PixiBaseTexture };
export type { IApplicationOptions as IPixiApplicationOptions };
export { Assets as PixiAssets };
export { Text as PixiText };

export { SoundLibrary as PixiSoundLibrary };
export type { Options as PixiSoundOptions };

export const PixiLightGroups = {
    diffuseGroup,
    normalGroup,
    lightGroup
};

export { Stage as PixiStage };
export { Layer as PixiLayer };