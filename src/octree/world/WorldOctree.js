import { Vector3 } from "math-ds";
import { KeyDesign } from "./KeyDesign.js";
import { WorldOctantIterator } from "./WorldOctantIterator.js";

/**
 * A point.
 *
 * @type {Vector3}
 * @private
 */

const p = new Vector3();

/**
 * An octree that subdivides space for fast spatial searches.
 *
 * The purpose of this linear octree is to efficiently organise volume data. It
 * allows direct access to different LOD layers, octant neighbors and parents.
 *
 * The world octree is axis-aligned and can't be rotated.
 */

export class WorldOctree {

	/**
	 * Constructs a new world octree.
	 *
	 * Each octant can be uniquely identified by a 3D coordinate and a LOD value.
	 * The individual values for X, Y and Z are combined into a 53bit key.
	 *
	 * @param {Number} [cellSize=20] - The size of the smallest octants in LOD zero.
	 * @param {Number} [levels=16] - The amount of detail levels.
	 * @param {Number} [keyDesign] - The bit allotments for the octant coordinates.
	 */

	constructor(cellSize = 20, levels = 16, keyDesign = new KeyDesign()) {

		/**
		 * The LOD zero cell size. 
		 *
		 * @type {Number}
		 * @private
		 */

		this.cellSize = cellSize;

		/**
		 * The octant key design. 
		 *
		 * @type {KeyDesign}
		 * @private
		 */

		this.keyDesign = keyDesign;

		/**
		 * The octant LOD grids. 
		 *
		 * @type {Map[]}
		 * @private
		 */

		this.grids = [];

		while(this.grids.length < levels) {

			this.grids.push(new Map());

		}

		/**
		 * The lower bounds of this world.
		 *
		 * @type {Vector3}
		 */

		this.min = this.keyDesign.halfRange.clone().multiplyScalar(-this.cellSize);

		/**
		 * The upper bounds of this world.
		 *
		 * @type {Vector3}
		 */

		this.max = this.keyDesign.halfRange.clone().multiplyScalar(this.cellSize);

	}

	/**
	 * The amount of detail levels. This value can not be changed.
	 *
	 * @type {Number}
	 */

	get levels() { return this.grids.length; }

	/**
	 * Computes the center of this world.
	 *
	 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
	 * @return {Vector3} A vector that describes the center of this world.
	 */

	getCenter(target = new Vector3()) {

		return target.addVectors(this.min, this.max).multiplyScalar(0.5);

	}

	/**
	 * Sets the center of this world.
	 *
	 * Keeping the center at (0, 0, 0) is recommended because a large offset can
	 * lead to floating point coordinate imprecisions.
	 *
	 * @param {Vector3} center - The new center.
	 */

	setCenter(center) {

		this.min.copy(this.keyDesign.halfRange).multiplyScalar(-this.cellSize).add(center);
		this.max.copy(this.keyDesign.halfRange).multiplyScalar(this.cellSize).add(center);

	}

	/**
	 * Computes the size of this world.
	 *
	 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
	 * @return {Vector3} A vector that describes the size of this world.
	 */

	getDimensions(target = new Vector3()) {

		return target.subVectors(this.max, this.min);

	}

	/**
	 * The world octree depth is constant and corresponds to the amount of detail
	 * levels. 
	 *
	 * @return {Number} The octree depth.
	 */

	getDepth() {

		return this.grids.length - 1;

	}

	/**
	 * Returns a specific LOD grid.
	 *
	 * @param {Number} lod - The LOD of the grid.
	 * @return {Map} The requested LOD grid or undefined if the given LOD is out of bounds.
	 */

	getGrid(lod) {

		return (lod > 0 && lod < this.grids.length) ? this.grids[lod] : undefined;

	}

	/**
	 * Removes all octants.
	 */

	clear() {

		let i, l;

		for(i = 0, l = this.grids.length; i < l; ++i) {

			this.grids[i].clear();

		}

	}

	/**
	 * Checks if the given point lies inside this octree's boundaries.
	 *
	 * @param {Vector3} point - A point.
	 * @return {Boolean} Whether the given point lies inside this octree.
	 */

	containsPoint(point) {

		const min = this.min;
		const max = this.max;

		return (
			point.x >= min.x &&
			point.y >= min.y &&
			point.z >= min.z &&
			point.x <= max.x &&
			point.y <= max.y &&
			point.z <= max.z
		);

	}

	/**
	 * Fetches all octants of the specified LOD.
	 *
	 * @param {Number} level - The LOD.
	 * @return {Iterable} A collection that contains the octants of the specified LOD.
	 */

	findOctantsByLevel(level) {

		return this.octants(level);

	}

	/**
	 * Retrieves the octant of a specific LOD that contains the given point.
	 *
	 * @param {Vector3} point - A point.
	 * @param {Number} [lod=0] - A LOD value.
	 * @return {WorldOctant} The octant that contains the point or undefined if it doesn't exist.
	 */

	getOctantByPoint(point, lod = 0) {

		const keyDesign = this.keyDesign;
		const cellSize = this.cellSize;
		const grid = this.getGrid(lod);

		let result;

		if(grid !== undefined) {

			if(this.containsPoint(point)) {

				// Translate to zero-based unsigned coordinates.
				a.copy(point).sub(this.min);

				// Calculate integer coordinates.
				b.set(
					Math.trunc(a.x / cellSize),
					Math.trunc(a.y / cellSize),
					Math.trunc(a.z / cellSize)
				);

				result = grid.get(keyDesign.packKey(b));

			} else {

				console.error("Position out of range", point);

			}

		} else {

			console.error("Invalid LOD", lod);

		}

		return result;

	}

	/**
	 * Finds the octants that intersect with the given ray. The intersecting
	 * octants are sorted by distance, closest first.
	 *
	 * @param {Raycaster} raycaster - A raycaster.
	 * @param {Array} [intersects] - An optional target list to be filled with the intersecting octants.
	 * @param {Array} [earlyExit=false] - Whether the method should return on the first hit.
	 * @return {Octant[]} The intersecting octants.
	 */

	raycast(raycaster, intersects = [], earlyExit = false) {

		return intersects;

	}

	/**
	 * Returns a new world octant iterator.
	 *
	 * The octants returned by this iterator are augmented with explicit
	 * positional information. See {@link WorldOctantWrapper} for more details.
	 *
	 * @param {Number} [lod=0] - The LOD grid to consider.
	 * @return {WorldOctantIterator} An iterator.
	 */

	octants(lod = 0) {

		return new WorldOctantIterator(this, lod);

	}

}
