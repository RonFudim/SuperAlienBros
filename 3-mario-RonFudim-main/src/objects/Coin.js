import GameObject from "./GameObject.js";
import Tile from "./Tile.js";
import { images, sounds } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import SoundName from "../enums/SoundName.js";
import Animation from "../../lib/Animation.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";

export default class Coin extends GameObject {
	static WIDTH = Tile.SIZE;
	static HEIGHT = Tile.SIZE;
	static TOTAL_SPRITES = 5;
	static POINTS = 10;

	/**
	 * A collectible item that the player can consume to gain points.
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
	constructor(dimensions, position) {
		super(dimensions, position);

		this.isConsumable = true;

		this.sprites = Coin.generateSprites();
		this.animation = new Animation([0, 1, 2, 3, 4], 0.1);
	}

	update(dt) {
		this.animation.update(dt);
		this.currentFrame = this.animation.getCurrentFrame();
	}

	onConsume(player) {
		if (this.wasConsumed) {
			return;
		}

		super.onConsume();
		sounds.play(SoundName.PickUp);
		player.score += Coin.POINTS;
		this.cleanUp = true;
	}

	static generateSprites() {
		const sprites = [];

		for (let x = 0; x < Coin.TOTAL_SPRITES; x++) {
			sprites.push(new Sprite(
				images.get(ImageName.Coin),
				x * Coin.WIDTH,
				0,
				Coin.WIDTH,
				Coin.HEIGHT
			));
		}

		return sprites;
	}
}
