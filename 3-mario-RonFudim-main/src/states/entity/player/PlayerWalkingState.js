import { keys } from "../../../globals.js";
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import State from "../../../../lib/State.js";
import Animation from "../../../../lib/Animation.js";
import Player from "../../../entities/Player.js";
import Vector from "../../../../lib/Vector.js";

export default class PlayerWalkingState extends State {
	/**
	 * In this state, the player is on the ground and moving
	 * either left or right. From here, the player can go idle
	 * if nothing is being pressed and there is no X velocity.
	 * The player can fall if there is no collisions below them,
	 * and they can jump if they hit spacebar.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;
		this.animation = new Animation([9, 10], 0.2);
	}

	enter() {
		this.player.currentAnimation = this.animation;
	}

	update(dt) {
		this.player.checkLeftCollisions();
		this.player.checkRightCollisions();
		this.player.checkEntityCollisions();

		const collisionObjects = this.player.checkObjectCollisions();

		if (keys[' ']) {
			this.player.changeState(PlayerStateName.Jumping);
		  }
		  if (!keys.Shift && !keys.a && !keys.d && Math.abs(this.player.velocity.x) === 0) {
			this.player.changeState(PlayerStateName.Idle);
			this.player.jumpForce = new Vector(0, -350); 
		  } else if (collisionObjects.length === 0 && !this.isTileCollisionBelow()) {
			this.player.changeState(PlayerStateName.Falling);
		  } else if (keys.Shift) {
			// Check for Shift key press
			if (keys.a || keys.A) {
			  this.player.runLeft(); // Call run function for running left
			} else if (keys.d || keys.D) {
			  this.player.runRight(); // Call run function for running right
			}

			this.player.jumpForce = new Vector(0, -500); // Set jump force to 500
		  } else if (keys.a) {
			this.player.moveLeft();
		  } else if (keys.d) {
			this.player.moveRight();
		  } else {
			this.player.stop();
		  }
	}

	isTileCollisionBelow() {
		return this.player.didCollideWithTiles([Direction.BottomLeft, Direction.BottomRight]);
	}
}
