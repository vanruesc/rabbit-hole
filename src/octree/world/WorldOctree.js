import { Vector3 } from "math-ds";
import { KeyDesign } from "./KeyDesign.js";

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
 *
 * @implements {Iterable}
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

		return target.copy(this.min).add(this.max).multiplyScalar(0.5);

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

		return target.copy(this.max).sub(this.min);

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
	 * Removed all octants.
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

	contains(point) {

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

		return this.grids[level];

	}

	/**
	 * Retrieves the octant of the specified LOD that contains the given point.
	 *
	 * @param {Number} key - An octant key.
	 * @param {Number} [lod=0] - A LOD value.
	 * @return {WorldOctant} The requested octant or undefined if it doesn't exist.
	 */

	getOctant(key, lod = 0) {

		const grid = this.getGrid(lod);

		let result;

		if(grid !== undefined) {

			result = grid.get(key);

		} else {

			console.error("Invalid LOD", lod);

		}

		return result;

	}

	/**
	 * Retrieves the octant of the specified LOD that contains the given point.
	 *
	 * @param {Vector3} point - A point.
	 * @param {Number} [lod=0] - A LOD value.
	 * @return {WorldOctant} The octant that contains the point or undefined if it doesn't exist.
	 */

	getOctantXXX(point, lod = 0) {

		const keyDesign = this.keyDesign;
		const cellSize = this.cellSize;
		const grid = this.getGrid(lod);

		let result;

		if(grid !== undefined) {

			if(this.contains(point)) {

				// Translate to unsigned integer coordinates.
				p.set(

					Math.trunc(point.x / cellSize),
					Math.trunc(point.y / cellSize),
					Math.trunc(point.z / cellSize)

				).sub(this.min);

				// create Octant if not exist

				result = grid.get(keyDesign.packKey(p));

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
	 * @return {Octant[]} The intersecting octants.
	 */

	raycast(raycaster, intersects = []) {

		return intersects;

	}

	/**
	 * Creates an iterator that returns the LOD zero octants.
	 *
	 * When a cull region is provided, the iterator will only return octants that
	 * intersect with that region.
	 *
	 * @param {Frustum|Box3} [region] - A cull region.
	 * @return {WorldOctreeIterator} An iterator.
	 */

	cull(region) {

		return null;

	}

	/**
	 * Creates an iterator that returns the LOD zero octants.
	 *
	 * @return {WorldOctreeIterator} An iterator.
	 */

	[Symbol.iterator]() {

		return null;

	}

}
