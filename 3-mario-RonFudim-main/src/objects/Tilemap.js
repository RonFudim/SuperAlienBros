import Vector from "../../lib/Vector.js";
import Tile from "./Tile.js";

export default class Tilemap {
	/**
	 * Contains all the tiles that comprise the map.
	 *
	 * @param {number} width How many tiles wide the map will be.
	 * @param {number} height How many tiles tall the map will be.
	 * @param {array} tiles The array of Tile objects that comprise the map.
	 */
	constructor(width, height, tiles, tileSets, topperSets) {
		this.tileDimensions = new Vector(width, height);
		this.canvasDimensions = new Vector(width * Tile.SIZE, height * Tile.SIZE);
		this.tiles = tiles;
		this.tileSets = tileSets;
		this.topperSets = topperSets;
	}

	/*
		If our tiles were animated, this is potentially where we could iterate over all of them
		and update either per-tile or per-map animations for appropriately flagged tiles!
	*/
	update(dt) { }

	render() {
		this.tiles.forEach((tileRow) => {
			tileRow.forEach((tile) => {
				tile.render(this.tileSets, this.topperSets);
			});
		});
	}

	/**
	 * Returns the tilemap (x, y) of a tile given the
	 * canvas (x, y) of coordinates in the world space.
	 *
	 * @param {number} x Canvas X
	 * @param {number} y Canvas Y
	 * @returns The tile at the given canvas coordinates.
	 */
	pointToTile(x, y) {
		if (x < 0 ||
			x > this.canvasDimensions.x ||
			y < 0 ||
			y > this.canvasDimensions.y) {
			return null;
		}

		return this.tiles[Math.floor(y / Tile.SIZE)][Math.floor(x / Tile.SIZE)];
	}
}
