import { getRandomPositiveInteger } from "../../lib/RandomNumberHelpers.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import GameObject from "./GameObject.js";
import Tile from "./Tile.js";

export default class Bush extends GameObject {
	static WIDTH = Tile.SIZE;
	static HEIGHT = Tile.SIZE;
	static TOTAL_SPRITES = 5;

	/**
	 * A background asset that does not have any behaviour.
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
	constructor(dimensions, position) {
		super(dimensions, position);

		this.sprites = Bush.generateSprites();
		this.currentFrame = getRandomPositiveInteger(0, Bush.TOTAL_SPRITES - 1);
	}

	static generateSprites() {
		const sprites = [];

		// Only grabbing the first sprite from each row, but this can be altered to grab all the sprites.
		for (let y = 0; y < Bush.TOTAL_SPRITES; y++) {
			sprites.push(new Sprite(
				images.get(ImageName.Bushes),
				0,
				y * Bush.HEIGHT,
				Bush.WIDTH,
				Bush.HEIGHT
			));
		}

		return sprites;
	}
}
