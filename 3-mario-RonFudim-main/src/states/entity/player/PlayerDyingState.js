import Particle from "../../../../lib/Particle.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import Snail from "../../../entities/Snail.js";
import SoundName from "../../../enums/SoundName.js";
import { context, sounds } from "../../../globals.js";

export default class PlayerDyingState extends State {
	/**
	 * In this state, the snail disappears and generates
	 * an array of particles as its death animation.
	 *
	 * @param {Player} snail
	 * @param {Snail} player
	 */
	constructor(player, snail) {
		super();

		this.player = player;
		this.snail = snail;
		this.particles = [];
	}

	enter() {
		sounds.play(SoundName.Kill);
		sounds.play(SoundName.Kill2);

		for (let i = 0; i < 20; i++) {
			this.particles.push(new Particle(
				this.player.position.x + this.player.dimensions.x / 2,
				this.player.position.y + this.player.dimensions.y / 2,
				{ r: 255, g: 50, b: 150 },
				2,
				100
			));
		}
	}

	update(dt) {
		this.particles.forEach((particle) => {
			particle.update(dt);
		});

		this.particles = this.particles.filter((particle) => particle.isAlive);

		if (this.particles.length === 0) {
			this.player.cleanUp = true;
		}
	}

	render() {
		this.particles.forEach((particle) => {
			particle.render(context);
		});
	}
}
