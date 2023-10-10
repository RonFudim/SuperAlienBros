import Animation from "../../../../lib/Animation.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import Snail from "../../../entities/Snail.js";
import Direction from "../../../enums/Direction.js";
import SnailStateName from "../../../enums/SnailStateName.js";

export default class SnailChasingState extends State {
	/**
	 * In this state, the snail follows the player
	 * at a higher move speed and animation speed.
	 *
	 * @param {Snail} snail
	 * @param {Player} player
	 */
	constructor(snail, player) {
		super();

		this.snail = snail;
		this.player = player;
		this.animation = new Animation([6, 7], 0.25);
	}

	enter() {
		this.snail.currentAnimation = this.animation;
	}

	update(dt) {
		if (this.snail.isDead) {
			this.snail.changeState(SnailStateName.Dying);
			this.player.level.numOfSnails--;
		}

		this.decideDirection();
		this.move(dt);
	}

	/**
	 * Set the direction of the snail based on the distance of the player.
	 */
	decideDirection() {
		if (this.snail.getDistanceBetween(this.player) > Snail.CHASE_DISTANCE) {
			this.snail.changeState(SnailStateName.Moving);
		}
		else if (this.player.position.x < this.snail.position.x) {
			this.snail.direction = Direction.Left;
		}
		else {
			this.snail.direction = Direction.Right;
		}
	}

	move(dt) {
		if (this.snail.direction === Direction.Left && !this.snail.isCollisionLeft()) {
			this.snail.position.x -= this.snail.velocityLimit.x * dt;
		}
		else if (this.snail.direction === Direction.Right && !this.snail.isCollisionRight()) {
			this.snail.position.x += this.snail.velocityLimit.x * dt;
		}
	}
}
