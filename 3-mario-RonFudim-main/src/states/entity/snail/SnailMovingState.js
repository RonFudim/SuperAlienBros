import Animation from "../../../../lib/Animation.js";
import { didSucceedChance, getRandomPositiveInteger } from "../../../../lib/RandomNumberHelpers.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import Snail from "../../../entities/Snail.js";
import Direction from "../../../enums/Direction.js";
import SnailStateName from "../../../enums/SnailStateName.js";
import { timer } from "../../../globals.js";

export default class SnailMovingState extends State {
	/**
	 * In this state, the snail moves at a slower speed
	 * and can randomly decide to go idle or change directions.
	 *
	 * @param {Snail} snail
	 * @param {Player} player
	 */
	constructor(snail, player) {
		super();

		this.snail = snail;
		this.player = player;
		this.animation = new Animation([6, 7], 1);

		this.reset();
	}

	enter() {
		this.snail.currentAnimation = this.animation;

		this.reset();
		this.startTimer();
	}

	exit() {
		this.timerTask?.clear();
	}

	update(dt) {
		if (this.snail.isDead) {
			this.snail.changeState(SnailStateName.Dying);
			this.player.level.numOfSnails--;
		}

		this.move(dt);
		this.chase();
	}

	startTimer() {
		this.timerTask = timer.wait(this.moveDuration, () => this.decideMovement());
	}

	move(dt) {
		if (this.snail.direction === Direction.Left) {
			this.snail.position.x -= this.snail.velocityLimit.x / 2 * dt;

			// Stop if there's a tile to the left or no tile on the bottom left.
			if (this.snail.isCollisionLeft()) {
				this.snail.direction = Direction.Right;
			}
		}
		else {
			this.snail.position.x += this.snail.velocityLimit.x / 2 * dt;

			// Stop if there's a tile to the right or no tile on the bottom right.
			if (this.snail.isCollisionRight()) {
				this.snail.direction = Direction.Left;
			}
		}
	}

	/**
	 * 50% chance for the snail to go idle for more dynamic movement.
	 * Otherwise, start the movement timer again.
	 */
	decideMovement() {
		if (didSucceedChance(0.5)) {
			this.snail.changeState(SnailStateName.Idle);
		}
		else {
			this.reset();
			this.startTimer();
		}
	}

	/**
	 * Calculate the difference between snail and player
	 * and only chase if <= CHASE_DISTANCE tiles.
	 */
	chase() {
		if (this.snail.getDistanceBetween(this.player) <= Snail.CHASE_DISTANCE) {
			this.snail.changeState(SnailStateName.Chasing);
		}
	}

	/**
	 * 50% chance for the snail to move either left or right.
	 * Reset the movement timer to a random duration.
	 */
	reset() {
		this.snail.direction = didSucceedChance(0.5) ? Direction.Left : Direction.Right;
		this.moveDuration = getRandomPositiveInteger(2, 5);
	}
}
