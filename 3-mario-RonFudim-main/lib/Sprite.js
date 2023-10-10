import Graphic from "./Graphic.js";

export default class Sprite {
	/**
	 * Represents a sprite to be used to draw the
	 * quad in the sprite sheet onto the canvas.
	 *
	 * @param {Graphic} graphic
	 * @param {Number} x The X coordinate of the sprite in the sprite sheet.
	 * @param {Number} y The Y coordinate of the sprite in the sprite sheet.
	 * @param {Number} width
	 * @param {Number} height
	 */
	constructor(graphic, x = 0, y = 0, width, height) {
		this.graphic = graphic;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	render(canvasX, canvasY, scale = { x: 1, y: 1 }) {
		this.graphic.context.drawImage(
			this.graphic.image,
			this.x,
			this.y,
			this.width,
			this.height,
			canvasX,
			canvasY,
			this.width * scale.x,
			this.height * scale.y,
		);
	}
}
