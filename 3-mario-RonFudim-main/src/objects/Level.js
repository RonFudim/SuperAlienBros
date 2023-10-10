import Entity from "../entities/Entity.js";
import { timer } from "../globals.js";
import Background from "./Background.js";
import Flagpole from "./Flagpole.js";
import Vector from "../../lib/Vector.js";
import TileType from "../enums/TileType.js";

export default class Level {
	static LEVEL_HEIGHT = 11;
	static TILE_SIZE = 16;

	constructor(tilemap, entities = [], objects = []) {
		this.tilemap = tilemap;
		this.entities = entities;
		this.objects = objects;
		this.background = new Background(this.tilemap.canvasDimensions);
		this.numOfSnails = 0;
		this.isWon = false;
	}

	update(dt) {
		this.cleanUpEntitiesAndObjects();

		timer.update(dt);

		this.tilemap.update(dt);
		this.background.update();

		this.objects.forEach((object) => {
			object.update(dt);
		});

		this.entities.forEach((entity) => {
			entity.update(dt);
		});
	}

	render() {
		this.background.render();
		this.tilemap.render();

		this.objects.forEach((object) => {
			object.render();
		});

		this.entities.forEach((entity) => {
			entity.render();
		});
	}

	cleanUpEntitiesAndObjects() {
		this.entities = this.entities.filter((entity) => !entity.cleanUp);
		this.objects = this.objects.filter((object) => !object.cleanUp);
	}

	/**
	 * @param {Entity} entity
	 */
	addEntity(entity) {
		this.entities.push(entity);
	}

	addCamera(camera) {
		this.background.addCamera(camera);
	}

	spawnFlag() {
		for(let i = this.tilemap.tiles[Level.LEVEL_HEIGHT].length - 2; i > 0; i--) {
			if(this.tilemap.tiles[Level.LEVEL_HEIGHT + 3][i].id === TileType.Ground 
				&& this.tilemap.tiles[Level.LEVEL_HEIGHT + 2][i].id === TileType.Empty) {
				this.objects.push(
					new Flagpole(
						this,
						true,
						new Vector(Flagpole.WIDTH, Flagpole.HEIGHT),
						new Vector(
							this.tilemap.tiles[Level.LEVEL_HEIGHT][i].position.x * Level.TILE_SIZE,
							Flagpole.HEIGHT * 2 - Level.TILE_SIZE,
						)
				));
		
				this.objects.push(
					new Flagpole(
						this,
						false,
						new Vector(Flagpole.WIDTH, Flagpole.HEIGHT),
						new Vector(
							this.tilemap.tiles[Level.LEVEL_HEIGHT][i].position.x * Level.TILE_SIZE + 10,
							Flagpole.HEIGHT * 2 - Level.TILE_SIZE,
						)
				));

				break;
			}
		}
	}
}
