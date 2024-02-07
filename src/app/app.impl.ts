import { PixiStage, PixiLayer, PixiLightGroups, PixiApplication, IPixiApplicationOptions } from '../plugins/engine';
import { ApplicationInterface, StageInterface, PanelInterface, TickerInterface } from '../entities/manager';

export class App implements ApplicationInterface {
    private _app: PixiApplication;
    ticker: TickerInterface;
    stage: StageInterface;
    panel: PanelInterface;

    constructor(options: IPixiApplicationOptions) {
        // create application
        this._app = new PixiApplication(options);

        // set ticker
        this.ticker = this._app.ticker;

        // set current stage
        const pixiStage = new PixiStage();
        pixiStage.addChild(
            new PixiLayer(PixiLightGroups.diffuseGroup),
            new PixiLayer(PixiLightGroups.normalGroup),
            new PixiLayer(PixiLightGroups.lightGroup)
        );
        this._app.stage = pixiStage;
        this.stage = this._app.stage;

        // set pixi panel
        const pixiPanel: PanelInterface = {
            resize: (fn: () => void) => {
                window.addEventListener("resize", fn);
            }
        }
        this.panel = pixiPanel;
    };
}