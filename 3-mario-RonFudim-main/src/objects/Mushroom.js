import GameObject from "./GameObject.js";
import Tile from "./Tile.js";
import { images, sounds } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import SoundName from "../enums/SoundName.js";
import Animation from "../../lib/Animation.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";

export default class Mushroom extends GameObject {
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

		this.sprites = Mushroom.generateSprites();
		this.animation = new Animation([0], 0.1);
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
        player.grow();
		this.cleanUp = true;
	}

	static generateSprites() {
		const sprites = [];

		sprites.push(new Sprite(
			images.get(ImageName.PowerUps),
			0,
			0,
			Mushroom.WIDTH,
			Mushroom.HEIGHT
		));
		

		return sprites;
	}
}
