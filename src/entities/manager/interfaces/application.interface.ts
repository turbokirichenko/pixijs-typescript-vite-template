export interface StageInterface {
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

export interface TickerInterface {
    /** add update function to the ticker
     * 
     * @param fn 
     * @param context 
     */
    add(fn: (framesPassed: any) => void, context?: any): TickerInterface
}

export type ResizeCallback = () => void;
export interface PanelInterface {
    /** function that up the resize callback
     * 
     */
    resize: (fn: ResizeCallback) => void
}

export interface ApplicationInterface {
    /** time ticker
     * 
     */
    ticker?: TickerInterface;

    /** stage of scene
     * 
     */
    stage?: StageInterface;

    /** panel with emitter
     * 
     */
    panel: PanelInterface;

    /** set initial state of the application
     * 
     * @returns 
     */
    init: <T = any>(options: T) => Promise<void>
}