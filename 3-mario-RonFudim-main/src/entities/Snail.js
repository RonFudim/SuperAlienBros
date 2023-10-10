import Entity from "./Entity.js";
import SnailIdleState from "../states/entity/snail/SnailIdleState.js";
import SnailMovingState from "../states/entity/snail/SnailMovingState.js";
import SnailChasingState from "../states/entity/snail/SnailChasingState.js";
import SnailDyingState from "../states/entity/snail/SnailDyingState.js";
import Sprite from "../../lib/Sprite.js";
import StateMachine from "../../lib/StateMachine.js";
import { images } from "../globals.js";
import Direction from "../enums/Direction.js";
import ImageName from "../enums/ImageName.js";
import SnailStateName from "../enums/SnailStateName.js";
import Vector from "../../lib/Vector.js";
import Level from "../objects/Level.js";
import Player from "./Player.js";

export default class Snail extends Entity {
	static WIDTH = 16;
	static HEIGHT = 16;
	static TOTAL_SPRITES = 8;
	static CHASE_DISTANCE = 5 * Snail.WIDTH;
	static VELOCITY_LIMIT = 40;
	static POINTS = 25;

	/**
	 * An enemy that can kill the player on contact. Has decision-making
	 * abilities that allow it to move around in the level and chase the
	 * player if the player gets within range.
	 *
	 * @param {Vector} dimensions The height and width of the snail.
	 * @param {Vector} position The x and y coordinates of the snail.
	 * @param {Vector} velocityLimit The maximum speed of the snail.
	 * @param {Level} level The level that the snail lives in.
	 * @param {Player} player The player character the snail is trying to kill.
	 */
	constructor(dimensions, position, velocityLimit, level, player) {
		super(dimensions, position, velocityLimit, level);

		this.sprites = Snail.generateSprites();

		this.stateMachine = new StateMachine();
		this.stateMachine.add(SnailStateName.Idle, new SnailIdleState(this, player));
		this.stateMachine.add(SnailStateName.Moving, new SnailMovingState(this, player));
		this.stateMachine.add(SnailStateName.Chasing, new SnailChasingState(this, player));
		this.stateMachine.add(SnailStateName.Dying, new SnailDyingState(this, player));

		this.changeState(SnailStateName.Idle);
	}

	static generateSprites() {
		const sprites = [];

		for (let i = 0; i < Snail.TOTAL_SPRITES; i++) {
			sprites.push(new Sprite(
				images.get(ImageName.Creatures),
				i * Snail.WIDTH,
				Snail.HEIGHT * 6,
				Snail.WIDTH,
				Snail.HEIGHT,
			));
		}

		return sprites;
	}

	isCollisionRight() {
		if (this.position.x > this.level.tilemap.canvasDimensions.x - this.dimensions.x) {
			return true;
		}

		const tilesToCheck = this.getTilesByDirection([Direction.Right, Direction.RightBottom]);
		const doTilesExist = tilesToCheck.every((tile) => tile != undefined);

		return doTilesExist && (tilesToCheck[0].isCollidable() || !tilesToCheck[1].isCollidable());
	}

	isCollisionLeft() {
		if (this.position.x < 0) {
			return true;
		}

		const tilesToCheck = this.getTilesByDirection([Direction.Left, Direction.LeftBottom]);
		const doTilesExist = tilesToCheck.every((tile) => tile != undefined);

		return doTilesExist && (tilesToCheck[0].isCollidable() || !tilesToCheck[1].isCollidable());
	}

	getTilesByDirection(tileDirections) {
		const tiles = [];

		tileDirections.forEach((direction) => {
			let x = 0;
			let y = 0;

			switch (direction) {
				case Direction.Right:
					x = this.position.x + this.dimensions.x;
					y = this.position.y;
					break;
				case Direction.RightBottom:
					x = this.position.x + this.dimensions.x;
					y = this.position.y + this.dimensions.y;
					break;
				case Direction.LeftBottom:
					x = this.position.x;
					y = this.position.y + this.dimensions.y;
					break;
				case Direction.Left:
					x = this.position.x;
					y = this.position.y;
					break;
			}

			const tile = this.level.tilemap.pointToTile(x, y);

			tiles.push(tile);
		});

		return tiles;
	}
}
