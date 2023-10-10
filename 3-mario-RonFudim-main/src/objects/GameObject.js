import Vector from "../../lib/Vector.js";
import Entity from "../entities/Entity.js";
import { getCollisionDirection, isAABBCollision } from "../../lib/CollisionHelpers.js";

export default class GameObject {
	/**
	 * The base class to be extended by all game objects in the game.
	 *
	 * @param {Vector} dimensions The height and width of the game object.
	 * @param {Vector} position The x and y coordinates of the game object.
	 */
	constructor(dimensions, position) {
		this.dimensions = dimensions;
		this.position = position;
		this.sprites = [];
		this.cleanUp = false;
		this.currentFrame = 0;

		// If an entity can overlap with this game object.
		this.isSolid = false;

		// If an entity should detect if it's overlapping this game object.
		this.isCollidable = false;

		// If the game object should disappear when collided with.
		this.isConsumable = false;

		// If the game object was collided with already.
		this.wasCollided = false;

		// If the game object was consumed already.
		this.wasConsumed = false;
	}

	update(dt) { }

	render() {
		this.sprites[this.currentFrame].render(this.position.x, this.position.y);
	}

	onConsume(consumer) {
		this.wasConsumed = true;
	}

	onCollision(collider) {
		this.wasCollided = true;
	}

	/**
	 * @param {Entity} entity
	 * @returns Whether this game object collided with an entity using AABB collision detection.
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
	 * @returns The direction that the entity collided with this game object.
	 */
	getEntityCollisionDirection(entity) {
		return getCollisionDirection(
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
}
