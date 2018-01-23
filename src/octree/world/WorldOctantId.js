/**
 * A world octant identifier.
 *
 * Each octant can be identified by a LOD index and a positional key.
 */

export class WorldOctantId {

	/**
	 * Constructs a new world octant identifier.
	 *
	 * @param {Number} [lod=0] - The LOD index.
	 * @param {Number} [key=0] - The key.
	 */

	constructor(lod = 0, key = 0) {

		/**
		 * The LOD grid in which the world octant resides.
		 *
		 * @type {Number}
		 */

		this.lod = lod;

		/**
		 * The unique key of the world octant.
		 *
		 * @type {Number}
		 */

		this.key = key;

	}

	/**
	 * Sets the LOD index and key.
	 *
	 * @param {Number} lod - The LOD index.
	 * @param {Number} key - The key.
	 * @return {WorldOctantId} This octant identifier.
	 */

	set(lod, key) {

		this.lod = lod;
		this.key = key;

	}

	/**
	 * Copies the given octant identifier.
	 *
	 * @param {WorldOctantId} id - An octant identifier.
	 * @return {WorldOctantId} This octant identifier.
	 */

	copy(id) {

		this.lod = id.lod;
		this.key = id.key;

		return this;

	}

	/**
	 * Clones this octant identifier.
	 *
	 * @return {WorldOctantId} The cloned octant identifier.
	 */

	clone() {

		return new this.constructor().copy(this);

	}

}
