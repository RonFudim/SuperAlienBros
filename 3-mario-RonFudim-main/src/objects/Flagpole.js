import GameObject from "./GameObject.js";
import Tile from "./Tile.js";
import { images, sounds } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import SoundName from "../enums/SoundName.js";
import Animation from "../../lib/Animation.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";

export default class Flagpole extends GameObject {
	static WIDTH = Tile.SIZE * 2;
	static HEIGHT = Tile.SIZE * 6;
	static TOTAL_SPRITES = 3;
	static POINTS = 10;
    static FLAG = Tile.SIZE * 2;
    static Y_OFFSET = -5;
    static X_OFFSET = 6;
    static POINTS = 100;

	/**
	 * A collectible item that the player can consume to gain points.
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
	constructor(level, isPole, dimensions, position) {
		super(dimensions, position);

		this.isConsumable = true;

        this.level = level;

		this.sprites = Flagpole.generateSprites(isPole);

        if(isPole) {
            this.animation = new Animation([0], 0.1);
        } else {
            this.animation = new Animation([0, 1, 2], 0.1);
        }	
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
		player.score += Flagpole.POINTS;
		this.level.isWon = true;
	}

	static generateSprites(isPole) {
		const sprites = [];

        if(isPole) {
            sprites.push(new Sprite(
                images.get(ImageName.Flagpole),
                0,
                0,
                Tile.SIZE,
                Flagpole.HEIGHT
            ));
        } else {
            for (let y = 0; y < Flagpole.TOTAL_SPRITES; y++) {
                sprites.push(new Sprite(
                    images.get(ImageName.Flagpole),
                    Tile.SIZE * this.X_OFFSET + y * Tile.SIZE,
                    this.Y_OFFSET,
                    Tile.SIZE,
                    Tile.SIZE 
                ));
            }
        }
        
		return sprites;
	}
}
