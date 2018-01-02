/**
 * A scene that consists of several concentric geometry rings.
 */

export class Scene {

	/**
	 * Constructs a new scene.
	 *
	 * @param {Number} levels - The amount of LOD rings.
	 */

	constructor(levels) {


	}

	/**
	 * The number of detail levels.
	 *
	 * @type {Number}
	 */

	get levels() {

		return this.something.length;

	}

	/**
	 * Clones this scene.
	 */

	clone() {

		return new this.constructor(this.levels);

	}

}
