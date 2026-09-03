import { Graphics, Container, Text } from "pixi.js";

export class LoadingBarContainer extends Container {
    private _loaderBar: Container;
    private _loaderBarBorder: Graphics;
    private _loaderProgress?: Graphics;
    private _barWidth: number;
    private _barHeight: number;
    private _errorText?: Text;

    constructor(barWidth: number, parentWidth: number, parentHeight: number) {
        super();
        this._barWidth = barWidth;
        this._barHeight = 48;

        this._loaderBarBorder = new Graphics();

        const lineWidth = 4;
        const lineColor = 0x000000;
        const barPosX = 0;
        const barPosY = 0;
        this._loaderBarBorder
            .rect(barPosX, barPosY, this._barWidth + 6, this._barHeight)
            .stroke({ width: lineWidth, color: lineColor })

        this._loaderBar = new Container();
        this._loaderBar.addChild(this._loaderBarBorder);
        this._loaderBar.position.x = (parentWidth - this._loaderBar.width) / 2;
        this._loaderBar.position.y = (parentHeight - this._loaderBar.height) / 2;
        this.addChild(this._loaderBar);
    }

    public scaleProgress(progress: number) {
        if (this._loaderProgress) {
            this._loaderBar.removeChild(this._loaderProgress);
            this._loaderProgress.destroy();
        }
        this._loaderProgress = this.makeRect(progress);
        this._loaderBar.addChild(this._loaderProgress);
    }

    resize(width: number, height: number) {
        this._loaderBar.position.x = (width - this._loaderBar.width) / 2;
        this._loaderBar.position.y = (height - this._loaderBar.height) / 2;
        this._errorText?.position.set(width / 2, height / 2 + this._barHeight);
    }

    showError(): void {
        if (this._errorText) {
            return;
        }

        this._errorText = new Text({
            text: 'Failed to load assets',
            style: {
                fontFamily: 'Arial',
                fontSize: 18,
                fill: 0xff0000,
                align: 'center'
            }
        });
        this._errorText.anchor.set(0.5);
        this._errorText.position.set(this.parent?.width ? this.parent.width / 2 : 0, this._barHeight);
        this.addChild(this._errorText);
    }

    /**
     * 
     * @param progress:number - line of loading the progress from 0.0 to 1.0
     * @returns rect:Graphics - drawing objects of pixi that fill the bar
     */
    private makeRect(progress: number): Graphics {
        const percentLines = Math.floor((progress*100)/10);
        const padding = 6;
        const pieceWidth = this._barWidth/10 - padding;
        const rect = new Graphics();

        //rect dimentions
        const rectPositionX = (i:number) => padding*(i+1) + pieceWidth*i;
        const rectPositionY = padding;
        const rectWidth = pieceWidth;
        const rectHeight = this._barHeight - 2*padding;

        // fill loading bar
        for (let i = 0; i < percentLines; ++i) {
            rect
                .rect(
                    rectPositionX(i), 
                    rectPositionY, 
                    rectWidth, 
                    rectHeight
                )
                .fill(0xffff00 - i*0x001100);
        }
        return rect;
    }
}
