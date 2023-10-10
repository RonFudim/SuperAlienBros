import Animation from "../../../../lib/Animation.js";
import { getRandomPositiveInteger } from "../../../../lib/RandomNumberHelpers.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import Snail from "../../../entities/Snail.js";
import SnailStateName from "../../../enums/SnailStateName.js";
import { timer } from "../../../globals.js";

export default class SnailIdleState extends State {
	/**
	 * In this state, the snail does not move and
	 * goes in its shell for a random period of time.
	 *
	 * @param {Snail} snail
	 * @param {Player} player
	 */
	constructor(snail, player) {
		super();

		this.snail = snail;
		this.player = player;
		this.animation = new Animation([4], 2);
	}

	enter() {
		this.idleDuration = getRandomPositiveInteger(2, 5);
		this.snail.currentAnimation = this.animation;

		this.startTimer();
	}

	exit() {
		this.timerTask?.clear();
	}

	update() {
		if (this.snail.isDead) {
			this.snail.changeState(SnailStateName.Dying);
			this.player.level.numOfSnails--;
		}

		this.chase();
	}

	startTimer() {
		this.timerTask = timer.wait(this.idleDuration, () => this.snail.changeState(SnailStateName.Moving));
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
}
