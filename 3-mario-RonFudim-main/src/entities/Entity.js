import Direction from "../enums/Direction.js";
import { context } from "../globals.js";
import Level from "../objects/Level.js";
import Vector from "../../lib/Vector.js";
import { isAABBCollision } from "../../lib/CollisionHelpers.js";

export default class Entity {
	/**
	 * The base class to be extended by all entities in the game.
	 *
	 * @param {Vector} dimensions The height and width of the entity.
	 * @param {Vector} position The x and y coordinates of the entity.
	 * @param {Vector} velocityLimit The maximum speed of the entity.
	 * @param {Level} level The level that the entity lives in.
	 */
	constructor(dimensions, position, velocityLimit, level) {
		this.dimensions = dimensions;
		this.position = position;
		this.velocity = new Vector(0, 0);
		this.velocityLimit = velocityLimit;
		this.level = level;
		this.direction = Direction.Right;
		this.sprites = [];
		this.currentAnimation = null;
		this.stateMachine = null;
		this.isDead = false;
		this.cleanUp = false;
	}

	changeState(state, params) {
		this.stateMachine.change(state, params);
	}

	update(dt) {
		this.stateMachine.update(dt);
		this.currentAnimation.update(dt);
		this.position.add(this.velocity, dt);
	}

	render() {
		this.stateMachine.render();

		if (this.isDead) {
			return;
		}

		this.renderEntity();
	}

	/**
	 * Draw character, this time getting the current frame from the animation.
	 * We also check for our direction and scale by -1 on the X axis if we're facing left.
	 */
	renderEntity() {
		if (this.direction === Direction.Left) {
			context.save();
			context.translate(Math.floor(this.position.x) + this.dimensions.x, Math.floor(this.position.y));
			context.scale(-1, 1);
			this.sprites[this.currentAnimation.getCurrentFrame()].render(0, 0);
			context.restore();
		}
		else {
			this.sprites[this.currentAnimation.getCurrentFrame()].render(Math.floor(this.position.x), Math.floor(this.position.y));
		}
	}

	/**
	 * @param {Entity} entity
	 * @returns Whether this entity collided with another using AABB collision detection.
	 */
	didCollideWithEntity(entity) {
		return isAABBCollision(
			this.position.x,
			this.position.y,
			this.dimensions.x,
			this.dimensions.y,
			entity.position.x,
			entity.position.y,
			entity.dimensions.x,
			entity.dimensions.y,
		);
	}

	/**
	 * @param {Entity} entity
	 * @returns The horizontal distance between this entity and the specified entity.
	 */
	getDistanceBetween(entity) {
		return Math.abs(this.position.x - entity.position.x);
	}

	/**
	 * @param {array} tileDirections An array of directions based on the Direction enum.
	 * @returns Whether this entity collided with any (not all) of the tiles in the specified directions.
	 */
	didCollideWithTiles(tileDirections) {
		const tiles = this.getCollisionTilesByDirection(tileDirections);

		if (tiles.length === 0) {
			return false;
		}

		const doTilesExist = tiles.every((tile) => tile != undefined);

		return doTilesExist;
	}

	/**
	 * @param {array} tileDirections An array of directions based on the Direction enum.
	 * @returns All tiles that the entity collided with in the specified directions.
	 */
	getCollisionTilesByDirection(tileDirections) {
		const tiles = this.getTilesByDirection(tileDirections);

		return tiles.filter(tile => tile?.isCollidable());
	}

	/**
	 * @param {array} tileDirections An array of directions based on the Direction enum.
	 * @returns All tiles in the specified directions relative to this entity.
	 */
	getTilesByDirection(tileDirections) {
		const tiles = [];

		tileDirections.forEach((direction) => {
			let x = 0;
			let y = 0;

			/**
			 * The offsets are needed based on which tile we're checking.
			 * For example, if we want to be able to fall through a gap that
			 * is one tile wide, then the offsets of the player have to be -1
			 * on both sides to allow for that clearance.
			 */
			switch (direction) {
				case Direction.TopLeft:
					x = this.position.x + 2;
					y = this.position.y;
					break;
				case Direction.TopRight:
					x = this.position.x + this.dimensions.x - 2;
					y = this.position.y;
					break;
				case Direction.RightTop:
					x = this.position.x + this.dimensions.x - 1;
					y = this.position.y + 1;
					break;
				case Direction.RightBottom:
					x = this.position.x + this.dimensions.x - 1;
					y = this.position.y + this.dimensions.y - 1;
					break;
				case Direction.BottomRight:
					x = this.position.x + this.dimensions.x - 1;
					y = this.position.y + this.dimensions.y;
					break;
				case Direction.BottomLeft:
					x = this.position.x + 1;
					y = this.position.y + this.dimensions.y;
					break;
				case Direction.LeftBottom:
					x = this.position.x + 1;
					y = this.position.y + this.dimensions.y - 1;
					break;
				case Direction.LeftTop:
					x = this.position.x + 1;
					y = this.position.y + 1;
					break;
			}

			const tile = this.level.tilemap.pointToTile(x, y);

			tiles.push(tile);
		});

		return tiles;
	}
}
