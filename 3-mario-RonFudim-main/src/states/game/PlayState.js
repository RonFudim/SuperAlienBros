import Camera from "../../../lib/Camera.js";
import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import { roundedRectangle } from "../../../lib/DrawingHelpers.js";
import GameStateName from "../../enums/GameStateName.js";
import SoundName from "../../enums/SoundName.js";
import LevelMaker from "../../services/LevelMaker.js";
import Player from "../../entities/Player.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	sounds,
	stateMachine
} from "../../globals.js";

export default class PlayState extends State {
	constructor() {
		super();
	}

	enter(parameters) {
		this.level = parameters.level;
		this.player = parameters.player;

		this.camera = new Camera(
			this.player,
			this.level.tilemap.canvasDimensions,
			new Vector(CANVAS_WIDTH, CANVAS_HEIGHT),
		);

		this.level.addEntity(this.player);
		this.level.addCamera(this.camera);

		sounds.play(SoundName.Music);
	}

	exit() {
		sounds.stop(SoundName.Music);
	}

	update(dt) {
		this.level.update(dt);
		this.camera.update();

		if (this.player.isDead) {
			stateMachine.change(GameStateName.TitleScreen);
		} else if (this.level.numOfSnails === 0) {
			this.level.spawnFlag();
			this.level.numOfSnails = -1;
		} else if (this.level.isWon) {
			this.level = LevelMaker.generateLevel();

			this.player = new Player(
				new Vector(Player.WIDTH, Player.HEIGHT),
				new Vector(Player.WIDTH, 0),
				new Vector(Player.VELOCITY_LIMIT, Player.VELOCITY_LIMIT),
				this.level,
			);

			LevelMaker.generateSnails(this.level, this.player);

			stateMachine.change(GameStateName.Play, {
				level: this.level,
				player: this.player,
				snails: this.snails,
			});
		}
	}

	render() {
		this.renderViewport();
		this.renderScore();
	}

	renderViewport() {
		context.save();
		context.translate(-this.camera.position.x, this.camera.position.y);
		this.level.render();
		context.restore();
	}

	renderScore() {
		context.save();
		context.fillStyle = 'rgb(255, 255, 255, 0.5)';
		roundedRectangle(context, 10, 10, 160, 30, 10, true, false);
		context.fillStyle = 'navy';
		context.font = '16px Joystix';
		context.textAlign = 'left';
		context.fillText(`Score:`, 20, 30);
		context.textAlign = 'right';
		context.fillText(`${String(this.player.score).padStart(5, '0')}`, 160, 30);
		context.restore();
	}
}
