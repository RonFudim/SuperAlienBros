import GameObject from "./GameObject.js";
import Coin from "./Coin.js";
import Sprite from "../../lib/Sprite.js";
import Tile from "./Tile.js";
import ImageName from "../enums/ImageName.js";
import SoundName from "../enums/SoundName.js";
import { images, sounds, timer } from "../globals.js";
import Vector from "../../lib/Vector.js";
import Mushroom from "./Mushroom.js";

export default class Block extends GameObject {
	static WIDTH = Tile.SIZE;
	static HEIGHT = Tile.SIZE;
	static TOTAL_SPRITES = 5;
	static NOT_HIT = 1;
	static HIT = 4;

	/**
	 * A "box" that the player can hit from beneath to reveal a coin.
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
	constructor(dimensions, position) {
		super(dimensions, position);

		this.isCollidable = true;
		this.isSolid = true;

		this.sprites = Block.generateSprites();
		this.currentFrame = Block.NOT_HIT;
	}

	static generateSprites() {
		const sprites = [];

		for (let y = 0; y < Block.TOTAL_SPRITES; y++) {
			sprites.push(new Sprite(
				images.get(ImageName.Blocks),
				0,
				y * Block.HEIGHT,
				Block.WIDTH,
				Block.HEIGHT
			));
		}

		return sprites;
	}

	onCollision(collider) {
		if (this.wasCollided) {
			sounds.play(SoundName.EmptyBlock);
			return;
		}

		super.onCollision(collider);

		const randomNumber = Math.random();

		let powerUp = null;

		if(randomNumber < 0.5) {
			powerUp = new Coin(
				new Vector(Coin.WIDTH, Coin.HEIGHT),
				new Vector(this.position.x, this.position.y),
			);	

			// Make the block move up and down.
			timer.tween(this.position, ['y'], [this.position.y - 5], 0.1, () => {
				timer.tween(this.position, ['y'], [this.position.y + 5], 0.1);
			});

			// Make the powerUp move up from the block and play a sound.
			timer.tween(powerUp.position, ['y'], [this.position.y - Coin.HEIGHT], 0.1);
			sounds.play(SoundName.Reveal);
		} else {
			powerUp = new Mushroom(
				new Vector(Mushroom.WIDTH, Mushroom.HEIGHT),
				new Vector(this.position.x, this.position.y),
			);	

				// Make the block move up and down.
			timer.tween(this.position, ['y'], [this.position.y - 5], 0.1, () => {
				timer.tween(this.position, ['y'], [this.position.y + 5], 0.1);
			});

			// Make the powerUp move up from the block and play a sound.
			timer.tween(powerUp.position, ['y'], [this.position.y - Mushroom.HEIGHT], 0.1);
			sounds.play(SoundName.Reveal);
		}

		
		/**
	    * Since we want the powerUp to appear like it's coming out of the block,
		* We add the powerUp to the beginning of the objects array. This way,
		* when the objects are rendered, the powerUps will be rendered first,
		* and the blocks will be rendered after.
		*/
		collider.level.objects.unshift(powerUp);

		this.currentFrame = Block.HIT;
	}
}
