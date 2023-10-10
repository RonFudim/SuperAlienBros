import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";

export default class Background {
	static WIDTH = 320;
	static HEIGHT = 320;
	static CAMERA_SCALE = 10;

	/**
	 * Responsible for rendering the background sprite.
	 * Uses the camera to offset its position to create
	 * a parallax effect.
	 *
	 * @param {Vector} canvasDimensions
	 */
	constructor(canvasDimensions) {
		this.position = new Vector(0, 0);
		this.canvasDimensions = canvasDimensions;
		this.dimensions = new Vector(Background.WIDTH, Background.HEIGHT);
		this.sprite = Background.generateSprites();
	}

	update() {
		this.position.x = this.camera.position.x / Background.CAMERA_SCALE;
	}

	render() {
		for (let x = 0; x < this.canvasDimensions.x / Background.WIDTH; x++) {
			this.sprite.render((x * Background.WIDTH) - this.position.x, 0);
		}
	}

	static generateSprites() {
		return new Sprite(images.get(ImageName.Background), 0, 0, Background.WIDTH, Background.HEIGHT);
	}

	addCamera(camera) {
		this.camera = camera;
	}
}
