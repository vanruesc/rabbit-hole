import { Box3, Vector3 } from "math-ds";
import { pattern } from "sparse-octree";
import { OperationType } from "../../volume/csg/OperationType.js";
import { IntermediateWorldOctant } from "./IntermediateWorldOctant.js";
import { WorldOctant } from "./WorldOctant.js";

/**
 * A point.
 *
 * @type {Vector3}
 * @private
 */

const p = new Vector3();

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 */

const v = new Vector3();

/**
 * A box.
 *
 * @type {Box3}
 * @private
 */

const b0 = new Box3();

/**
 * A box.
 *
 * @type {Box3}
 * @private
 */

const b1 = new Box3();

/**
 * A box.
 *
 * @type {Box3}
 * @private
 */

const b2 = new Box3();

/**
 * A list of key coordinate ranges used for octant culling during the recursive
 * octree traversal.
 *
 * @type {Box3[]}
 * @private
 */

const ranges = [];

/**
 * Recursively applies the given SDF to existing octants in the affected region.
 *
 * This is a depth-first approach.
 *
 * @private
 * @param {WorldOctree} world - The world octree.
 * @param {SignedDistanceFunction} sdf - An SDF with a primary Difference CSG type.
 * @param {WorldOctant} octant - The current octant.
 * @param {Number} keyX - The X-coordinate of the current octant's key.
 * @param {Number} keyY - The Y-coordinate of the current octant's key.
 * @param {Number} keyZ - The Z-coordinate of the current octant's key.
 * @param {Number} lod - The current LOD.
 */

function applyDifference(world, sdf, octant, keyX, keyY, keyZ, lod) {

	let grid, keyDesign, children;
	let range, offset, i;

	octant.csg.add(sdf);

	if(lod > 0) {

		// Look at the next lower LOD.
		--lod;

		grid = world.getGrid(lod);
		keyDesign = world.getKeyDesign();
		children = octant.children;
		range = ranges[lod];

		// Translate the key coordinates to the next lower LOD.
		keyX <<= 1; keyY <<= 1; keyZ <<= 1;

		for(i = 0; i < 8; ++i) {

			// Check if the child exists.
			if((children & (1 << i)) !== 0) {

				offset = pattern[i];

				p.set(
					keyX + offset[0],
					keyY + offset[1],
					keyZ + offset[2]
				);

				// Check if the child is affected.
				if(range.containsPoint(p)) {

					// Apply the difference operation to the child.
					applyDifference(world, sdf, grid.get(keyDesign.packKey(p)), p.x, p.y, p.z, lod);

				}

			}

		}

	}

}

/**
 * A world octree CSG operation manager.
 */

export class WorldOctreeCSG {

	/**
	 * Modifies all octants in the specified region with the given SDF.
	 *
	 * Octants that don't exist will be created across all LOD grids.
	 *
	 * @private
	 * @param {WorldOctree} world - A world octree.
	 * @param {Box3} region - The affected region.
	 * @param {SignedDistanceFunction} sdf - An SDF with a primary Union CSG type.
	 */

	static applyUnion(world, region, sdf) {

		const keyDesign = world.getKeyDesign();
		const lodZero = world.lodZero;

		const a = b1.min;
		const b = b1.max;
		const c = b2.min;
		const d = b2.max;
		const range = b2;

		let key, offset;
		let grid, octant;
		let lod, i;

		// Process LOD N to 1.
		for(lod = world.getDepth(); lod > 0; --lod) {

			grid = world.getGrid(lod);

			// Calculate a key coordinate range for this LOD and the next lower LOD.
			world.calculateKeyCoordinates(region.min, lod, a);
			world.calculateKeyCoordinates(region.max, lod, b);
			world.calculateKeyCoordinates(region.min, lod - 1, c);
			world.calculateKeyCoordinates(region.max, lod - 1, d);

			for(key of keyDesign.keyRange(a, b)) {

				if(!grid.has(key)) {

					octant = new IntermediateWorldOctant();
					octant.csg.add(sdf);
					grid.set(key, octant);

					// Translate the key coordinates to the next lower LOD.
					keyDesign.unpackKey(key, v);
					v.x <<= 1; v.y <<= 1; v.z <<= 1;

					// Determine the existence of the child octants.
					for(i = 0; i < 8; ++i) {

						offset = pattern[i];

						p.set(
							v.x + offset[0],
							v.y + offset[1],
							v.z + offset[2]
						);

						if(range.containsPoint(p)) {

							// The child exists! store the information in bit i.
							octant.children |= (1 << i);

						}

					}

				}

			}

		}

		// Finally, process LOD zero and add the SDF to the leaf octants.
		world.calculateKeyCoordinates(region.min, 0, a);
		world.calculateKeyCoordinates(region.max, 0, b);

		for(key of keyDesign.keyRange(a, b)) {

			if(!lodZero.has(key)) {

				octant = new WorldOctant();
				lodZero.set(key, octant);

			} else {

				octant = lodZero.get(key);

			}

			octant.csg.add(sdf);

		}

	}

	/**
	 * Modifies existing octants in the specified region with the given SDF.
	 *
	 * Calculating an entry LOD depending on the longest side of the affected
	 * region could improve performance, but by skipping higher LOD grid some
	 * intermediate octants won't be affected by the SDF.
	 *
	 * ```js
	 * const min = region.min;
	 * const max = region.max;
	 *
	 * const s = Math.max(
	 * 	Math.max(Math.max(Math.abs(min.x), Math.abs(min.y)), Math.abs(min.z)),
	 * 	Math.max(Math.max(Math.abs(max.x), Math.abs(max.y)), Math.abs(max.z))
	 * );
	 *
	 * const quotientCeiled = Math.ceil(s / world.getCellSize());
	 * const doublingsCeiled = Math.ceil(Math.log2(quotientCeiled));
	 * const lod = Math.min(doublingsCeiled, world.getDepth());
	 * ```
	 *
	 * @private
	 * @param {WorldOctree} world - A world octree.
	 * @param {Box3} region - The affected region.
	 * @param {SignedDistanceFunction} sdf - An SDF with a primary Difference CSG type.
	 */

	static applyDifference(world, region, sdf) {

		const lod = world.getDepth();
		const keyDesign = world.getKeyDesign();
		const grid = world.getGrid(lod);

		// Consider all octants of the entry LOD grid that lie in the given region.
		const a = world.calculateKeyCoordinates(region.min, lod, b1.min);
		const b = world.calculateKeyCoordinates(region.max, lod, b1.max);

		let i, l;
		let range;
		let key;

		// Precompute key coordinate ranges for the lower LOD grids.
		for(i = 0, l = lod - 1; i < l; ++i) {

			if(i < ranges.length) {

				// Reuse a cached box.
				range = ranges[i];

				world.calculateKeyCoordinates(region.min, i, range.min);
				world.calculateKeyCoordinates(region.max, i, range.max);

			} else {

				// Create a new box for this LOD and cache it.
				ranges.push(new Box3(
					world.calculateKeyCoordinates(region.min, i),
					world.calculateKeyCoordinates(region.max, i)
				));

			}

		}

		// Delve into the octant structures.
		for(key of keyDesign.keyRange(a, b)) {

			if(grid.has(key)) {

				keyDesign.unpackKey(key, v);

				// Recursively modify affected LOD zero cells.
				applyDifference(world, sdf, grid.get(key), v.x, v.y, v.z, lod);

			}

		}

	}

	/**
	 * Modifies all existing octants.
	 *
	 * Warning: This CSG operation is highly destructive and expensive when used
	 * as a primary operation. It should rather be used in CSG composites where it
	 * can only affect local data.
	 *
	 * @private
	 * @param {WorldOctree} world - A world octree.
	 * @param {SignedDistanceFunction} sdf - An SDF with a primary Intersection CSG type.
	 */

	static applyIntersection(world, sdf) {

		let lod, octant;

		for(lod = world.getDepth(); lod >= 0; --lod) {

			for(octant of world.getGrid(lod).values()) {

				octant.csg.add(sdf);

			}

		}

	}

	/**
	 * Applies the given SDF to the affected octants.
	 *
	 * @param {WorldOctree} world - A world octree.
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	static applyCSG(world, sdf) {

		// Calculate the area of effect.
		const region = b0.copy(sdf.completeBoundingBox);

		// Limit the affected region to the world boundaries.
		region.min.max(world.min);
		region.max.min(world.max);

		switch(sdf.operation) {

			case OperationType.UNION:
				this.applyUnion(world, region, sdf);
				break;

			case OperationType.DIFFERENCE:
				this.applyDifference(world, region, sdf);
				break;

			case OperationType.INTERSECTION:
				this.applyIntersection(world, sdf);
				break;

			default:
				console.error("No CSG operation type specified", sdf);
				break;

		}

	}

}
