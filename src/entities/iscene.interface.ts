export interface IScene {
    update(framesPassed: number): void;
    // we added the resize method to the interface
    resize(screenWidth: number, screenHeight: number): void;
}