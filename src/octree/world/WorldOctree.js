import { Vector3 } from "math-ds";
import { pattern } from "sparse-octree";
import { KeyDesign } from "./KeyDesign.js";
import { WorldOctantIterator } from "./WorldOctantIterator.js";
import { WorldOctantWrapper } from "./WorldOctantWrapper.js";
import { WorldOctreeCSG } from "./WorldOctreeCSG.js";
import { WorldOctreeRaycaster } from "./WorldOctreeRaycaster.js";

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 * @final
 */

const v = new Vector3();

/**
 * Calculates an offset index from octant key coordinates.
 *
 * The index identifies the octant's positional offset relative to its parent:
 *
 * ```text
 *  0: [0, 0, 0]
 *  1: [0, 0, 1]
 *  2: [0, 1, 0]
 *  3: [0, 1, 1]
 *  4: [1, 0, 0]
 *  5: [1, 0, 1]
 *  6: [1, 1, 0]
 *  7: [1, 1, 1]
 * ```
 *
 * Note: This binary pattern is defined by the external sparse-octree module.
 *
 * @private
 * @param {Number} x - The X-coordinate of the octant key.
 * @param {Number} y - The Y-coordinate of the octant key.
 * @param {Number} z - The Z-coordinate of the octant key.
 * @return {Number} The index of the relative position offset.
 */

function calculateOffsetIndex(x, y, z) {

	const offsetX = x % 2;
	const offsetY = y % 2;
	const offsetZ = z % 2;

	return offsetX * 4 + offsetY * 2 + offsetZ;

}

/**
 * Recursively deletes octant children.
 *
 * @param {WorldOctree} world - A world octree.
 * @param {WorldOctant} octant - The current octant.
 * @param {Number} keyX - The X-coordinate of the current octant key.
 * @param {Number} keyY - The Y-coordinate of the current octant key.
 * @param {Number} keyZ - The Z-coordinate of the current octant key.
 * @param {Number} lod - The current LOD value.
 */

function removeChildren(world, octant, keyX, keyY, keyZ, lod) {

	let grid, keyDesign;
	let children, child;
	let offset, key, i;

	// The octants from LOD zero have no children.
	if(lod > 0) {

		// Look at the next lower LOD.
		--lod;

		grid = world.getGrid(lod);
		keyDesign = world.getKeyDesign();
		children = octant.children;

		// Translate the key coordinates to the next lower LOD.
		keyX <<= 1; keyY <<= 1; keyZ <<= 1;

		for(i = 0; i < 8; ++i) {

			// Check if the child exists.
			if(children & (1 << i) !== 0) {

				offset = pattern[i];

				v.set(
					keyX + offset[0],
					keyY + offset[1],
					keyZ + offset[2]
				);

				key = keyDesign.packKey(v);

				// Fetch the child and remove it from the grid.
				child = grid.get(key);
				grid.delete(key);

				removeChildren(world, child, v.x, v.y, v.z, lod);

			}

		}

		octant.children = 0;

	}

}

/**
 * Recursively removes empty parent nodes.
 *
 * @param {WorldOctree} world - A world octree.
 * @param {Number} keyX - The X-coordinate of the deleted octant's key.
 * @param {Number} keyY - The Y-coordinate of the deleted octant's key.
 * @param {Number} keyZ - The Z-coordinate of the deleted octant's key.
 * @param {Number} lod - The current LOD value.
 */

function prune(world, keyX, keyY, keyZ, lod) {

	let grid, i, key, parent;

	if(++lod < world.levels) {

		// Look at the next higher LOD grid.
		grid = world.getGrid(lod);

		// Determine the position of the deleted octant relative to its parent.
		i = calculateOffsetIndex(keyX, keyY, keyZ);

		// Translate the key coordinates to the next higher LOD.
		v.set(keyX >> 1, keyY >> 1, keyZ >> 1);

		// The resulting coordinates identify the parent octant.
		key = world.getKeyDesign().packKey(v);
		parent = grid.get(key);

		// Unset the existence flag of the deleted child.
		parent.children &= ~(1 << i);

		// Check if there are any children left.
		if(parent.children === 0) {

			// Remove the empty parent and recur.
			grid.delete(key);
			prune(world, v.x, v.y, v.z, lod);

		}

	}

}

/**
 * An octree that subdivides space for fast spatial searches.
 *
 * The purpose of this linear octree is to efficiently organise volume data. It
 * allows direct access to different LOD layers, octant neighbors and parents.
 *
 * The world octree is axis-aligned and cannot be rotated.
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

		levels = Math.max(levels, 1);

		while(this.grids.length < levels) {

			this.grids.push(new Map());

		}

		/**
		 * An empty octant wrapper that merely holds the bounds of this world.
		 *
		 * @type {WorldOctantWrapper}
		 * @private
		 */

		this.bounds = new WorldOctantWrapper();

		this.bounds.min.copy(this.keyDesign.halfRange).multiplyScalar(-this.cellSize);
		this.bounds.max.copy(this.keyDesign.halfRange).multiplyScalar(this.cellSize);

	}

	/**
	 * The lower bounds of this world.
	 *
	 * @type {Vector3}
	 */

	get min() { return this.bounds.min; }

	/**
	 * The upper bounds of this world.
	 *
	 * @type {Vector3}
	 */

	get max() { return this.bounds.max; }

	/**
	 * The amount of detail levels. This value can not be changed.
	 *
	 * @type {Number}
	 */

	get levels() { return this.grids.length; }

	/**
	 * The LOD zero octant grid.
	 *
	 * @type {Number}
	 */

	get lodZero() { return this.grids[0]; }

	/**
	 * Returns the key design.
	 *
	 * @return {KeyDesign} The key design.
	 */

	getKeyDesign() {

		return this.keyDesign;

	}

	/**
	 * Returns the size of the cells in the specified LOD grid.
	 *
	 * @param {Number} [lod=0] - The LOD.
	 * @return {Number} The cell size.
	 */

	getCellSize(lod = 0) {

		return this.cellSize << lod;

	}

	/**
	 * Computes the center of this world.
	 *
	 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
	 * @return {Vector3} A vector that describes the center of this world.
	 */

	getCenter(target) {

		return this.bounds.getCenter(target);

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

	getDimensions(target) {

		return this.bounds.getDimensions(target);

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

		return (lod >= 0 && lod < this.grids.length) ? this.grids[lod] : undefined;

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

		return this.bounds.containsPoint(point);

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
	 * Calculates key coordinates based on a given position and LOD.
	 *
	 * @param {Vector3} position - A position.
	 * @param {Number} lod - The target LOD.
	 * @param {Vector3} [target] - A vector to store the result in. If none is provided, a new one will be created.
	 * @return {Vector3} The key coordinates.
	 */

	calculateKeyCoordinates(position, lod, target = new Vector3()) {

		const cellSize = this.cellSize << lod;

		// Translate to the origin (zero-based unsigned coordinates).
		v.subVectors(position, this.min);

		target.set(
			Math.trunc(v.x / cellSize),
			Math.trunc(v.y / cellSize),
			Math.trunc(v.z / cellSize)
		);

		return target;

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
		const grid = this.getGrid(lod);

		let result;

		if(grid !== undefined) {

			if(this.containsPoint(point)) {

				this.calculateKeyCoordinates(point, lod, v);
				result = grid.get(keyDesign.packKey(v));

			} else {

				console.error("Position out of range", point);

			}

		} else {

			console.error("Invalid LOD", lod);

		}

		return result;

	}

	/**
	 * Removes a specific octant by a given key.
	 *
	 * Children and empty parent nodes will be removed as well.
	 *
	 * @param {Number} key - The key of the octant that should be removed.
	 * @param {Number} [lod=0] - The LOD of the octant.
	 */

	removeOctant(key, lod = 0) {

		const keyDesign = this.keyDesign;
		const grid = this.getGrid(lod);

		let keyX, keyY, keyZ;

		if(grid !== undefined) {

			if(grid.has(key)) {

				// Note: the vector v will be modified by removeChildren and prune.
				keyDesign.unpackKey(key, v);
				keyX = v.x; keyY = v.y; keyZ = v.z;

				// Recursively delete all children in the lower LOD grids.
				removeChildren(this, grid.get(key), keyX, keyY, keyZ, lod);

				// Remove the octant.
				grid.delete(key);

				// Recursively delete empty parent nodes.
				prune(this, keyX, keyY, keyZ, lod);

			} else {

				console.error("No octant found", key);

			}

		} else {

			console.error("Invalid LOD", lod);

		}

	}

	/**
	 * Applies the given SDF to the affected octants.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	applyCSG(sdf) {

		WorldOctreeCSG.applyCSG(this, sdf);

	}

	/**
	 * Finds the octants that intersect with the given ray. The intersecting
	 * octants are sorted by distance, closest first. Empty octants will not be
	 * included in the result.
	 *
	 * @param {Raycaster} raycaster - A raycaster.
	 * @param {Array} [intersects] - An optional target list to be filled with the intersecting octants.
	 * @return {WorldOctant[]} The intersecting octants.
	 */

	raycast(raycaster, intersects = []) {

		return WorldOctreeRaycaster.intersectWorldOctree(this, raycaster, intersects);

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
