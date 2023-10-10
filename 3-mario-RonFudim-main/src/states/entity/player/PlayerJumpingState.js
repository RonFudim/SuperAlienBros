import Animation from "../../../../lib/Animation.js";
import State from "../../../../lib/State.js";
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import { keys } from "../../../globals.js";
import Player from "../../../entities/Player.js";

export default class PlayerJumpingState extends State {
	/**
	 * In this state, the player gets a sudden vertical
	 * boost. Once their Y velocity reaches 0, they start
	 * to fall.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;
		this.animation = new Animation([2], 1);
	}

	enter() {
		this.player.velocity.y = this.player.jumpForce.y;
		this.player.currentAnimation = this.animation;
	}

	update(dt) {
		if (this.player.velocity.y >= 0) {
			this.player.changeState(PlayerStateName.Falling);
		}

		if (this.isTileCollisionAbove()) {
			this.player.velocity.y = 0;
			this.player.changeState(PlayerStateName.Falling);
		}
		else if (keys.a) {
			this.player.moveLeft();
			this.player.checkLeftCollisions();
		}
		else if (keys.d) {
			this.player.moveRight();
			this.player.checkRightCollisions();
		}
		else {
			this.player.stop();
		}

		this.player.checkObjectCollisions(object => this.onObjectCollision(object));
		this.player.checkEntityCollisions();
		this.player.velocity.add(this.player.gravityForce, dt);
	}

	isTileCollisionAbove() {
		return this.player.didCollideWithTiles([Direction.TopLeft, Direction.TopRight]);
	}

	onObjectCollision(object) {
		if (object.didCollideWithEntity(this.player)) {
			if (object.isSolid && object.getEntityCollisionDirection(this.player) === Direction.Down) {
				object.onCollision(this.player);

				this.player.position.y = object.position.y + object.dimensions.y;
				this.player.velocity.y = 0;
				this.player.changeState(PlayerStateName.Falling);
			}
			else if (object.isConsumable) {
				object.onConsume(this.player);
			}
		}
	}
}
