import { Box3, Vector3 } from "math-ds";
import { pattern } from "sparse-octree";
import { Queue } from "../../core/Queue.js";
import { OperationType } from "../../volume/csg/OperationType.js";
import { KeyDesign } from "./KeyDesign.js";
import { IntermediateWorldOctant } from "./IntermediateWorldOctant.js";
import { LeafWorldOctant } from "./LeafWorldOctant.js";
import { WorldOctantIterator } from "./WorldOctantIterator.js";

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 * @final
 */

const a = new Vector3();

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 */

const b = new Vector3();

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 */

const c = new Vector3();

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 */

const d = new Vector3();

/**
 * A point.
 *
 * @type {Vector3}
 * @private
 */

const p = new Vector3();

/**
 * A bounding box.
 *
 * @type {Box3}
 * @private
 */

const box = new Box3();

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
	 * Modifies all octants in the specified region with the given SDF.
	 *
	 * Octants that don't exist will be created across all LOD grids.
	 *
	 * @param {Box3} region - The affected region (zero-based unsigned coordinates).
	 * @param {SignedDistanceFunction} sdf - An SDF with a primary Union CSG type.
	 */

	applyUnion(region, sdf) {

		const grids = this.grids;
		const lodZero = grids[0];
		const cellSize = this.cellSize;
		const keyDesign = this.keyDesign;

		let grid, size, halfSize;
		let key, octant, combination;
		let n, i;

		// Process LOD N to 1.
		for(n = this.levels - 1; n > 0; --n) {

			grid = grids[n];
			size = cellSize << n;
			halfSize = size >> 1;

			// Calculate integer coordinates.
			a.set(
				Math.trunc(region.min.x / size),
				Math.trunc(region.min.y / size),
				Math.trunc(region.min.z / size)
			);

			b.set(
				Math.trunc(region.max.x / size),
				Math.trunc(region.max.y / size),
				Math.trunc(region.max.z / size)
			);

			for(key of keyDesign.keyRange(a, b)) {

				if(!grid.has(key)) {

					octant = new IntermediateWorldOctant();
					grid.set(key, octant);

					// Determine the existence of the child octants.
					keyDesign.unpackKey(key, c);
					c.multiplyScalar(size);
					d.copy(c).addScalar(halfSize);

					for(i = 0; i < 8; ++i) {

						combination = pattern[i];

						p.set(
							(combination[0] === 0) ? c.x : d.x,
							(combination[1] === 0) ? c.y : d.y,
							(combination[2] === 0) ? c.z : d.z
						);

						if(region.containsPoint(p)) {

							// The child exists; store the information in bit i.
							octant.children |= (1 << i);

						}

					}

				}

			}

		}

		// Finally, process LOD 0 and add the SDF to ALL leaf octants.
		a.set(
			Math.trunc(region.min.x / cellSize),
			Math.trunc(region.min.y / cellSize),
			Math.trunc(region.min.z / cellSize)
		);

		b.set(
			Math.trunc(region.max.x / cellSize),
			Math.trunc(region.max.y / cellSize),
			Math.trunc(region.max.z / cellSize)
		);

		for(key of keyDesign.keyRange(a, b)) {

			if(!lodZero.has(key)) {

				octant = new LeafWorldOctant();
				octant.csg = new Queue();
				lodZero.set(key, octant);

			} else {

				octant = lodZero.get(key);

				if(octant.csg === null) {

					octant.csg = new Queue();

				}

			}

			octant.csg.add(sdf);

		}

	}

	/**
	 * Modifies existing octants in the specified region with the given SDF.
	 *
	 * @param {Box3} region - The affected region (zero-based unsigned coordinates).
	 * @param {SignedDistanceFunction} sdf - An SDF with a primary Difference CSG type.
	 */

	applyDifference(region, sdf) {

	}

	/**
	 * Modifies all existing octants.
	 *
	 * This CSG operation is rarely used as a primary operation. It should rather
	 * be used in CSG composites where it can only affect local data.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF with a primary Intersection CSG type.
	 */

	applyIntersection(sdf) {

		const lodZero = this.grids[0];

		let octant;

		for(octant of lodZero.values()) {

			if(octant.csg === null) {

				octant.csg = new Queue();

			}

			octant.csg.add(sdf);

		}

	}

	/**
	 * Applies the given SDF to the affected octants.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	applyCSG(sdf) {

		// Calculate the area of effect.
		const region = box.copy(sdf.completeBoundingBox);

		// Limit the affected region to the world boundaries.
		region.min.max(this.min);
		region.max.min(this.max);

		// Translate the region to the origin (zero-based unsigned coordinates).
		region.min.sub(this.min);
		region.max.sub(this.min);

		switch(sdf.operation) {

			case OperationType.UNION:
				this.applyUnion(region, sdf);
				break;

			case OperationType.DIFFERENCE:
				this.applyDifference(region, sdf);
				break;

			case OperationType.INTERSECTION:
				this.applyIntersection(sdf);
				break;

		}

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
