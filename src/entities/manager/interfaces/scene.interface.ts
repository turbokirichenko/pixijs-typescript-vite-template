export interface SceneInterface {
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

    /**
     * 
     */
    destroy(): void;
}