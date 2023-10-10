import TileType from "../enums/TileType.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Sprite from "../../lib/Sprite.js";
import Graphic from "../../lib/Graphic.js";
import Tile from "../objects/Tile.js";
import Tilemap from "../objects/Tilemap.js";
import { didSucceedChance, getRandomPositiveInteger } from "../../lib/RandomNumberHelpers.js";
import Level from "../objects/Level.js";
import Snail from "../entities/Snail.js";
import Vector from "../../lib/Vector.js";
import Bush from "../objects/Bush.js";
import Block from "../objects/Block.js";
import Player from "../entities/Player.js";

export default class LevelMaker {
	static TILE_SET_WIDTH = 5;
	static TILE_SET_HEIGHT = 4;
	static TILE_SETS_WIDTH = 6;
	static TILE_SETS_HEIGHT = 10;
	static TOPPER_SETS_WIDTH = 6;
	static TOPPER_SETS_HEIGHT = 18;
	static DEFAULT_LEVEL_WIDTH = 45;
	static DEFAULT_LEVEL_HEIGHT = 18;

	static GROUND_HEIGHT = LevelMaker.DEFAULT_LEVEL_HEIGHT - 4;
	static PILLAR_CHANCE = 0.2;
	static MAX_PILLAR_HEIGHT = LevelMaker.GROUND_HEIGHT - 6;

	static CHASM_CHANCE = 0.1;
	static MIN_CHASM_WIDTH = 2;
	static MAX_CHASM_WIDTH = 5;

	static BLOCK_CHANCE = 0.15;
	static BLOCK_HEIGHT = 4;
	static BUSH_CHANCE = 0.25;
	static BUSH_HEIGHT = 1;

	static SNAIL_CHANCE = 0.1;

	static generateLevel(width = LevelMaker.DEFAULT_LEVEL_WIDTH, height = LevelMaker.DEFAULT_LEVEL_HEIGHT) {
		const tiles = new Array();
		const entities = [];
		const objects = [];
		const tileSet = getRandomPositiveInteger(0, LevelMaker.TILE_SETS_WIDTH * LevelMaker.TILE_SET_HEIGHT - 1);
		const topperSet = getRandomPositiveInteger(0, LevelMaker.TOPPER_SETS_WIDTH * LevelMaker.TOPPER_SETS_HEIGHT - 1);
		const playerSpawnX = 1;

		/**
		 * Used to generate chasms of varying widths. In generateChasm(), this
		 * number gets set randomly. When it is > 0, chasms are generated sub-
		 * sequently until the counter reaches zero.
		 */
		let chasmCounter = 0;

		LevelMaker.initializeTilemap(tiles, height);

		for (let x = 0; x < width; x++) {
			LevelMaker.generateEmptySpace(tiles, x, tileSet, topperSet);

			chasmCounter = LevelMaker.generateChasm(tiles, x, height, tileSet, topperSet, chasmCounter);

			// If we want a chasm, then we want to skip generating a column.
			if (chasmCounter > 0 && x != playerSpawnX) {
				continue;
			}

			LevelMaker.generateColumn(tiles, x, height, tileSet, topperSet, objects);
		}

		const tileSets = LevelMaker.generateSprites(
			images.get(ImageName.Tiles),
			LevelMaker.TILE_SETS_WIDTH,
			LevelMaker.TILE_SETS_HEIGHT,
			LevelMaker.TILE_SET_WIDTH,
			LevelMaker.TILE_SET_HEIGHT,
		);
		const topperSets = LevelMaker.generateSprites(
			images.get(ImageName.Toppers),
			LevelMaker.TOPPER_SETS_WIDTH,
			LevelMaker.TOPPER_SETS_HEIGHT,
			LevelMaker.TILE_SET_WIDTH,
			LevelMaker.TILE_SET_HEIGHT,
		);
		const tilemap = new Tilemap(
			width,
			height,
			tiles,
			tileSets,
			topperSets,
		);

		return new Level(tilemap, entities, objects);
	}

	/**
	 * Initialize the tiles array with empty arrays.
	 *
	 * @param {array} tiles
	 * @param {number} height
	 */
	static initializeTilemap(tiles, height) {
		for (let i = 0; i < height; i++) {
			tiles.push([]);
		}
	}

	/**
	 * Loops from the top of the map until the ground starts
	 * and fill those spaces with empty tiles.
	 *
	 * @param {array} tiles
	 * @param {number} x
	 * @param {number} tileSet
	 * @param {number} topperSet
	 */
	static generateEmptySpace(tiles, x, tileSet, topperSet) {
		for (let y = 0; y < LevelMaker.GROUND_HEIGHT; y++) {
			tiles[y].push(new Tile(x, y, TileType.Empty, false, tileSet, topperSet));
		}
	}

	/**
	 * Randomly generates a chasm which is a column in the map
	 * that has no tiles which the player can fall down into.
	 *
	 * @param {array} tiles
	 * @param {number} x
	 * @param {number} height
	 * @param {number} tileSet
	 * @param {number} topperSet
	 * @param {number} chasmCounter
	 * @returns A decremented, or randomly generated if zero, chasmCounter.
	 */
	static generateChasm(tiles, x, height, tileSet, topperSet, chasmCounter) {
		if (chasmCounter !== 0) {
			for (let y = LevelMaker.GROUND_HEIGHT; y < height; y++) {
				tiles[y].push(new Tile(x, y, TileType.Empty, false, tileSet, topperSet));
			}

			chasmCounter--;
		}
		else if (didSucceedChance(LevelMaker.CHASM_CHANCE)) {
			chasmCounter = getRandomPositiveInteger(LevelMaker.MIN_CHASM_WIDTH, LevelMaker.MAX_CHASM_WIDTH);
		}

		return chasmCounter;
	}

	/**
	 * Generates the ground that the player can walk on.
	 * Will randomly decide to generate a pillar which is simply
	 * just ground tiles higher than the base ground height.
	 *
	 * @param {array} tiles
	 * @param {number} x
	 * @param {number} height
	 * @param {number} tileSet
	 * @param {number} topperSet
	 */
	static generateColumn(tiles, x, height, tileSet, topperSet, objects) {
		const isPillar = didSucceedChance(LevelMaker.PILLAR_CHANCE);
		const pillarHeight = getRandomPositiveInteger(LevelMaker.GROUND_HEIGHT, LevelMaker.MAX_PILLAR_HEIGHT);
		const columnStart = isPillar ? pillarHeight : LevelMaker.GROUND_HEIGHT;

		LevelMaker.generateBlock(objects, x, columnStart - LevelMaker.BLOCK_HEIGHT);
		LevelMaker.generateBush(objects, x, columnStart - LevelMaker.BUSH_HEIGHT);

		for (let y = columnStart; y < height; y++) {
			tiles[y][x] = new Tile(x, y, TileType.Ground, y === columnStart, tileSet, topperSet);
		}
	}

	static generateBlock(objects, x, y) {
		if (didSucceedChance(LevelMaker.BLOCK_CHANCE)) {
			objects.push(new Block(
				new Vector(Block.WIDTH, Block.HEIGHT),
				new Vector(x * Tile.SIZE, y * Tile.SIZE),
			));
		}
	}

	static generateBush(objects, x, y) {
		if (didSucceedChance(LevelMaker.BUSH_CHANCE)) {
			objects.push(new Bush(
				new Vector(Bush.WIDTH, Bush.HEIGHT),
				new Vector(x * Tile.SIZE, y * Tile.SIZE),
			));
		}
	}

	/**
	 * Spawns snail enemies randomly throughout the level.
	 *
	 * @param {Level} level
	 * @param {Player} player
	 */
	static generateSnails(level, player) {
		for (let x = 0; x < level.tilemap.tileDimensions.x - 1; x++) {
			for (let y = 0; y < level.tilemap.tileDimensions.y - 1; y++) {
				// Only spawn snails on ground tiles.
				if (level.tilemap.tiles[y][x].id === TileType.Ground) {
					// 10% chance to spawn a snail.
					if (didSucceedChance(LevelMaker.SNAIL_CHANCE)) {
						const snail = new Snail(
							new Vector(Snail.WIDTH, Snail.HEIGHT),
							new Vector(x * Tile.SIZE, (y - 1) * Tile.SIZE),
							new Vector(Snail.VELOCITY_LIMIT, Snail.VELOCITY_LIMIT),
							level,
							player,
						);

						level.addEntity(snail);
						level.numOfSnails++;
					}

					// Only spawn snails on the top ground tile of any given column.
					break;
				}
			}
		}
	}

	/**
	 * Generates a 2D array populated with Sprite objects.
	 *
	 * @param {Graphic} spriteSheet
	 * @param {number} setsX
	 * @param {number} setsY
	 * @param {number} sizeX
	 * @param {number} sizeY
	 * @returns A 2D array of sprite objects.
	 */
	static generateSprites(spriteSheet, setsX, setsY, sizeX, sizeY) {
		const tileSets = new Array();
		let counter = -1;

		// for each tile set on the X and Y
		for (let tileSetY = 0; tileSetY < setsY; tileSetY++) {
			for (let tileSetX = 0; tileSetX < setsX; tileSetX++) {
				tileSets.push([]);
				counter++;

				for (let y = sizeY * tileSetY; y < sizeY * tileSetY + sizeY; y++) {
					for (let x = sizeX * tileSetX; x < sizeX * tileSetX + sizeX; x++) {
						tileSets[counter].push(new Sprite(
							spriteSheet,
							x * Tile.SIZE,
							y * Tile.SIZE,
							Tile.SIZE,
							Tile.SIZE,
						));
					}
				}
			}
		}

		return tileSets;
	}
}
