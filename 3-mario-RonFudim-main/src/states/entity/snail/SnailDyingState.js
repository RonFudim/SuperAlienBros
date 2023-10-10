import Particle from "../../../../lib/Particle.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import Snail from "../../../entities/Snail.js";
import SoundName from "../../../enums/SoundName.js";
import { context, sounds } from "../../../globals.js";

export default class SnailDyingState extends State {
	/**
	 * In this state, the snail disappears and generates
	 * an array of particles as its death animation.
	 *
	 * @param {Snail} snail
	 * @param {Player} player
	 */
	constructor(snail, player) {
		super();

		this.snail = snail;
		this.player = player;
		this.particles = [];
	}

	enter() {
		sounds.play(SoundName.Kill);
		sounds.play(SoundName.Kill2);

		this.player.score += Snail.POINTS;

		for (let i = 0; i < 20; i++) {
			this.particles.push(new Particle(
				this.snail.position.x + this.snail.dimensions.x / 2,
				this.snail.position.y + this.snail.dimensions.y / 2,
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
			this.snail.cleanUp = true;
		}
	}

	render() {
		this.particles.forEach((particle) => {
			particle.render(context);
		});
	}
}
