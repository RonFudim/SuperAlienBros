import Animation from "../../../../lib/Animation.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import { keys } from "../../../globals.js";

export default class PlayerIdleState extends State {
	/**
	 * In this state, the player is stationary unless
	 * left or right are pressed, or if there is no
	 * collision below.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;
		this.animation = new Animation([0], 1);
	}

	enter() {
		this.player.currentAnimation = this.animation;
	}

	update() {
		this.player.checkLeftCollisions();
		this.player.checkRightCollisions();
		this.player.checkEntityCollisions();

		const collisionObjects = this.player.checkObjectCollisions();

		if (collisionObjects.length === 0 && !this.isTileCollisionBelow()) {
			this.player.changeState(PlayerStateName.Falling);
		}

		if (keys.a || keys.d) {
			this.player.changeState(PlayerStateName.Walking);
		}

		if (keys[' ']) {
			this.player.changeState(PlayerStateName.Jumping);
		}
	}

	isTileCollisionBelow() {
		return this.player.didCollideWithTiles([Direction.BottomLeft, Direction.BottomRight]);
	}
}
