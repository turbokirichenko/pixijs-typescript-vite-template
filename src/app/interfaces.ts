export interface IStage {
    /** add one or several children
     * 
     * @param children 
     */
    addChild<T extends any[]>(...children: T): T[0];

    /** remove one or several children
     * 
     * @param children 
     */
    removeChild<T extends any[]>(...children: T): T[0];
}

export interface ITicker {
    /** add update function to the ticker
     * 
     * @param fn 
     * @param context 
     */
    add(fn: (framesPassed: number) => void, context?: any): ITicker
}

export interface IApplication {
    /** time ticker
     * 
     */
    ticker: ITicker;

    /** stage of scene
     * 
     */
    stage: IStage;
}

export interface IScene {
    /** update scene
     * 
     * @param framesPassed 
     */
    update(framesPassed: number): void;

    /** resize scene
     * 
     * @param screenWidth 
     * @param screenHeight 
     */
    resize(screenWidth: number, screenHeight: number): void;

    /** destroy scene
     * 
     */
    destroy(): void;
}

export interface ISceneManagerConfig {
    /** background color hex code
     * 
     */
    fill: number | string;
}

export interface IContainer {
    
    /** add one or several children
     * 
     * @param children 
     */
    addChild<T extends any[]>(...children: T): T[0];
};
export interface ISprite {

    /** add one or several children
     * 
     * @param children 
     */
    addChild<T extends any[]>(...children: T): T[0];
};