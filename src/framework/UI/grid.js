export default class Grid {
    /**
    * Crea una cuadricula para organizar elementos visuales
    *
    * @param {Phaser.Scene} scene - escena donde se crea la cuadricula.
    * @param {number} x - posicion x de la cuadricula
    * @param {number} y - posicion y de la cuadricula
    * @param {number} width - ancho total de la cuadricula
    * @param {number} height - alto total de la cuadrícula
    * @param {number} columns - nuemro de columnas
    * @param {number} rows - numero de filas
    * @param {number} margin - margen (espacio desde los bordes hacia dentro)
    */
    constructor(scene, x, y, width, height, columns, rows, margin) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.columns = columns;
        this.rows = rows;
        this.margin = margin;

        // Se calcula el punto inicial (esquina superior izquierda)
        this.startingX = this.x + this.margin;
        this.startingY = this.y + this.margin;

        // Se calcula el ancho y el alto de cada celda
        this.cellWidth = (this.width - this.margin * 2) / this.columns;
        this.cellHeight = (this.height - this.margin * 2) / this.rows;

        this.items = this.scene.add.group();

        let debug = this.scene.sys.game.debug;
        if (debug.enable) {
            let debugRect = this.scene.add.rectangle(this.startingX, this.startingY, this.columns * this.cellWidth, this.rows * this.cellHeight, 0x000000, 0);
            debugRect.setStrokeStyle(2, debug.color);
            debugRect.setOrigin(0, 0);
        }
    }

    arrange() {
        Phaser.Actions.GridAlign(this.items.getChildren(), {
            width: this.columns,
            height: this.rows,
            cellWidth: this.cellWidth,
            cellHeight: this.cellHeight,
            position: Phaser.Display.Align.CENTER,
            x: this.startingX,
            y: this.startingY
        })
    }

    addItem(item) {
        if (!this.items.contains(item)) {
            this.items.add(item);
            this.arrange();
        }
    }
}