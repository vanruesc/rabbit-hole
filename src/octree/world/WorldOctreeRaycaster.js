import { Box3, Line3, Ray, Vector3 } from "math-ds";
import { pattern } from "sparse-octree";
import { WorldOctantWrapper } from "./WorldOctantWrapper.js";

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 * @final
 */

const v = new Vector3();

/**
 * A line.
 *
 * @type {Line3}
 * @private
 * @final
 */

const l = new Line3();

/**
 * A box.
 *
 * @type {Box3}
 * @private
 * @final
 */

const b = new Box3();

/**
 * A box.
 *
 * @type {Box3}
 * @private
 * @final
 */

const d = new Box3();

/**
 * A ray.
 *
 * @type {Ray}
 * @private
 * @final
 */

const r = new Ray();

/**
 * A lookup-table containing octant ids. Used to determine the exit plane from
 * an octant.
 *
 * @type {Uint8Array[]}
 * @private
 * @final
 */

const octantTable = [

	new Uint8Array([4, 2, 1]),
	new Uint8Array([5, 3, 8]),
	new Uint8Array([6, 8, 3]),
	new Uint8Array([7, 8, 8]),
	new Uint8Array([8, 6, 5]),
	new Uint8Array([8, 7, 8]),
	new Uint8Array([8, 8, 7]),
	new Uint8Array([8, 8, 8])

];

/**
 * A byte that stores raycasting flags.
 *
 * @type {Number}
 * @private
 */

let flags = 0;

/**
 * Finds the entry plane of the first octant that a ray travels through.
 *
 * Determining the first octant requires knowing which of the t0s is the
 * largest. The tms of the other axes must also be compared against that
 * largest t0.
 *
 * @private
 * @param {Number} tx0 - Ray projection parameter.
 * @param {Number} ty0 - Ray projection parameter.
 * @param {Number} tz0 - Ray projection parameter.
 * @param {Number} txm - Ray projection parameter mean.
 * @param {Number} tym - Ray projection parameter mean.
 * @param {Number} tzm - Ray projection parameter mean.
 * @return {Number} The index of the first octant that the ray travels through.
 */

function findEntryOctant(tx0, ty0, tz0, txm, tym, tzm) {

	let entry = 0;

	// Find the entry plane.
	if(tx0 > ty0 && tx0 > tz0) {

		// YZ-plane.
		if(tym < tx0) {

			entry |= 2;

		}

		if(tzm < tx0) {

			entry |= 1;

		}

	} else if(ty0 > tz0) {

		// XZ-plane.
		if(txm < ty0) {

			entry |= 4;

		}

		if(tzm < ty0) {

			entry |= 1;

		}

	} else {

		// XY-plane.
		if(txm < tz0) {

			entry |= 4;

		}

		if(tym < tz0) {

			entry |= 2;

		}

	}

	return entry;

}

/**
 * Finds the next octant that intersects with the ray based on the exit plane of
 * the current one.
 *
 * @private
 * @param {Number} currentOctant - The index of the current octant.
 * @param {Number} tx1 - Ray projection parameter.
 * @param {Number} ty1 - Ray projection parameter.
 * @param {Number} tz1 - Ray projection parameter.
 * @return {Number} The index of the next octant that the ray travels through.
 */

function findNextOctant(currentOctant, tx1, ty1, tz1) {

	let min;
	let exit = 0;

	// Find the exit plane.
	if(tx1 < ty1) {

		min = tx1;
		exit = 0; // YZ-plane.

	} else {

		min = ty1;
		exit = 1; // XZ-plane.

	}

	if(tz1 < min) {

		exit = 2; // XY-plane.

	}

	return octantTable[currentOctant][exit];

}

/**
 * Recursively traverses the given octant to find (pseudo) leaf octants that
 * intersect with the given ray.
 *
 * @private
 * @param {WorldOctree} world - The world octree.
 * @param {WorldOctant} octant - The current octant.
 * @param {Number} keyX - The X-coordinate of the current octant key.
 * @param {Number} keyY - The Y-coordinate of the current octant key.
 * @param {Number} keyZ - The Z-coordinate of the current octant key.
 * @param {Number} lod - The current LOD.
 * @param {Number} tx0 - Ray projection parameter. Initial tx0 = (minX - rayOriginX) / rayDirectionX.
 * @param {Number} ty0 - Ray projection parameter. Initial ty0 = (minY - rayOriginY) / rayDirectionY.
 * @param {Number} tz0 - Ray projection parameter. Initial tz0 = (minZ - rayOriginZ) / rayDirectionZ.
 * @param {Number} tx1 - Ray projection parameter. Initial tx1 = (maxX - rayOriginX) / rayDirectionX.
 * @param {Number} ty1 - Ray projection parameter. Initial ty1 = (maxY - rayOriginY) / rayDirectionY.
 * @param {Number} tz1 - Ray projection parameter. Initial tz1 = (maxZ - rayOriginZ) / rayDirectionZ.
 * @param {WorldOctant[]} intersects - An array to be filled with the intersecting octants.
 */

function raycastOctant(world, octant, keyX, keyY, keyZ, lod, tx0, ty0, tz0, tx1, ty1, tz1, intersects) {

	let grid, keyDesign;
	let children, offset;

	let currentOctant;
	let txm, tym, tzm;

	let i;

	if(tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0) {

		if(lod === 0 || octant.mesh !== null) {

			intersects.push(octant);

		} else if(octant.children > 0) {

			// Look at the next lower LOD.
			grid = world.getGrid(--lod);
			keyDesign = world.getKeyDesign();
			children = octant.children;

			// Translate the key coordinates to the next lower LOD.
			keyX <<= 1; keyY <<= 1; keyZ <<= 1;

			// Compute means.
			txm = 0.5 * (tx0 + tx1);
			tym = 0.5 * (ty0 + ty1);
			tzm = 0.5 * (tz0 + tz1);

			currentOctant = findEntryOctant(tx0, ty0, tz0, txm, tym, tzm);

			do {

				i = flags ^ currentOctant;

				switch(currentOctant) {

					case 0: {

						if((children & (1 << i)) !== 0) {

							offset = pattern[i];
							v.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
							raycastOctant(world, grid.get(keyDesign.packKey(v)), v.x, v.y, v.z, lod, tx0, ty0, tz0, txm, tym, tzm, intersects);

						}

						currentOctant = findNextOctant(currentOctant, txm, tym, tzm);
						break;

					}

					case 1: {

						if((children & (1 << i)) !== 0) {

							offset = pattern[i];
							v.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
							raycastOctant(world, grid.get(keyDesign.packKey(v)), v.x, v.y, v.z, lod, tx0, ty0, tzm, txm, tym, tz1, intersects);

						}

						currentOctant = findNextOctant(currentOctant, txm, tym, tz1);
						break;

					}

					case 2: {

						if((children & (1 << i)) !== 0) {

							offset = pattern[i];
							v.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
							raycastOctant(world, grid.get(keyDesign.packKey(v)), v.x, v.y, v.z, lod, tx0, tym, tz0, txm, ty1, tzm, intersects);

						}

						currentOctant = findNextOctant(currentOctant, txm, ty1, tzm);
						break;

					}

					case 3: {

						if((children & (1 << i)) !== 0) {

							offset = pattern[i];
							v.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
							raycastOctant(world, grid.get(keyDesign.packKey(v)), v.x, v.y, v.z, lod, tx0, tym, tzm, txm, ty1, tz1, intersects);

						}

						currentOctant = findNextOctant(currentOctant, txm, ty1, tz1);
						break;

					}

					case 4: {

						if((children & (1 << i)) !== 0) {

							offset = pattern[i];
							v.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
							raycastOctant(world, grid.get(keyDesign.packKey(v)), v.x, v.y, v.z, lod, txm, ty0, tz0, tx1, tym, tzm, intersects);

						}

						currentOctant = findNextOctant(currentOctant, tx1, tym, tzm);
						break;

					}

					case 5: {

						if((children & (1 << i)) !== 0) {

							offset = pattern[i];
							v.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
							raycastOctant(world, grid.get(keyDesign.packKey(v)), v.x, v.y, v.z, lod, txm, ty0, tzm, tx1, tym, tz1, intersects);

						}

						currentOctant = findNextOctant(currentOctant, tx1, tym, tz1);
						break;

					}

					case 6: {

						if((children & (1 << i)) !== 0) {

							offset = pattern[i];
							v.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
							raycastOctant(world, grid.get(keyDesign.packKey(v)), v.x, v.y, v.z, lod, txm, tym, tz0, tx1, ty1, tzm, intersects);

						}

						currentOctant = findNextOctant(currentOctant, tx1, ty1, tzm);
						break;

					}

					case 7: {

						if((children & (1 << i)) !== 0) {

							offset = pattern[i];
							v.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
							raycastOctant(world, grid.get(keyDesign.packKey(v)), v.x, v.y, v.z, lod, txm, tym, tzm, tx1, ty1, tz1, intersects);

						}

						// Far top right octant. No other octants can be reached from here.
						currentOctant = 8;
						break;

					}

				}

			} while(currentOctant < 8);

		}

	}

}

/**
 * Finds (pseudo) leaf octants in the given subtree that intersect with the
 * given ray.
 *
 * @private
 * @param {WorldOctree} world - The world octree.
 * @param {WorldOctantWrapper} subtree - A world octant, enriched with positional information.
 * @param {Vector3} keyCoordinates - The key coordinates of the octant.
 * @param {Ray} ray - A ray.
 * @param {WorldOctant[]} intersects - The intersecting octants. Sorted by distance, closest first
 */

function intersectSubtree(world, subtree, keyCoordinates, ray, intersects) {

	// Translate the octant extents to the scene origin.
	const min = b.min.set(0, 0, 0);
	const max = b.max.subVectors(subtree.max, subtree.min);

	const dimensions = subtree.getDimensions(d.min);
	const halfDimensions = d.max.copy(dimensions).multiplyScalar(0.5);

	const origin = r.origin.copy(ray.origin);
	const direction = r.direction.copy(ray.direction);

	let invDirX, invDirY, invDirZ;
	let tx0, tx1, ty0, ty1, tz0, tz1;

	// Translate the ray to the center of the octant.
	origin.sub(subtree.getCenter(v)).add(halfDimensions);

	// Reset all flags.
	flags = 0;

	// Handle rays with negative directions.
	if(direction.x < 0.0) {

		origin.x = dimensions.x - origin.x;
		direction.x = -direction.x;
		flags |= 4;

	}

	if(direction.y < 0.0) {

		origin.y = dimensions.y - origin.y;
		direction.y = -direction.y;
		flags |= 2;

	}

	if(direction.z < 0.0) {

		origin.z = dimensions.z - origin.z;
		direction.z = -direction.z;
		flags |= 1;

	}

	// Improve IEEE double stability.
	invDirX = 1.0 / direction.x;
	invDirY = 1.0 / direction.y;
	invDirZ = 1.0 / direction.z;

	// Project the ray to the octant's boundaries.
	tx0 = (min.x - origin.x) * invDirX;
	tx1 = (max.x - origin.x) * invDirX;
	ty0 = (min.y - origin.y) * invDirY;
	ty1 = (max.y - origin.y) * invDirY;
	tz0 = (min.z - origin.z) * invDirZ;
	tz1 = (max.z - origin.z) * invDirZ;

	// Find the intersecting children.
	raycastOctant(
		world, subtree.octant,
		keyCoordinates.x, keyCoordinates.y, keyCoordinates.z, world.getDepth(),
		tx0, ty0, tz0, tx1, ty1, tz1,
		intersects
	);

}

/**
 * A world octree raycaster.
 *
 * This raycaster is a specialised hybrid that uses a voxel traversal algorithm
 * to iterate over the octants of the highest LOD grid and an octree traversal
 * algorithm to raycast the identified subtrees.
 *
 * The voxel traversal implementation is a 3D supercover variant of the Digital
 * Differential Analyzer (DDA) line algorithm and is similar to the Bresenham
 * algorithm. The octree traversal algorithm relies on octant child existence
 * information to skip empty space and to avoid hashmap lookup misses.
 *
 * References:
 *
 *  "Voxel Traversal along a 3D Line"
 *  by D. Cohen (1994)
 *
 *  "An Efficient Parametric Algorithm for Octree Traversal"
 *  by J. Revelles et al. (2000)
 */

export class WorldOctreeRaycaster {

	/**
	 * Finds (pseudo) leaf octants that intersect with the given ray.
	 *
	 * @param {WorldOctree} world - A world octree.
	 * @param {Ray} ray - A ray.
	 * @param {Array} [intersects] - An optional target list to be filled with the intersecting octants.
	 * @return {WorldOctant[]} The intersecting octants. Sorted by distance, closest first.
	 */

	static intersectWorldOctree(world, ray, intersects = []) {

		const lod = world.getDepth();
		const grid = world.getGrid(lod);
		const cellSize = world.getCellSize(lod);
		const keyDesign = world.getKeyDesign();
		const octantWrapper = new WorldOctantWrapper();

		const keyCoordinates0 = l.start;
		const keyCoordinates1 = l.end;

		// Find the point at which the ray enters the world grid.
		const a = !world.containsPoint(r.copy(ray).origin) ?
			r.intersectBox(world, r.origin) :
			r.origin;

		let key, octant;
		let t, b, n;

		let dx, dy, dz;
		let ax, ay, az, bx, by, bz;
		let sx, sy, sz, exy, exz, ezy;

		// Check if the ray hits the world octree.
		if(a !== null) {

			// Phase 1: Initialisation.

			// Find the ending point.
			t = cellSize << 1;
			b = r.at(t, v);

			// Calculate the starting and ending cell coordinates.
			world.calculateKeyCoordinates(a, lod, keyCoordinates0);
			world.calculateKeyCoordinates(b, lod, keyCoordinates1);

			// Calculate the key coordinate vector from start to end.
			dx = keyCoordinates1.x - keyCoordinates0.x;
			dy = keyCoordinates1.y - keyCoordinates0.y;
			dz = keyCoordinates1.z - keyCoordinates0.z;

			// Prepare step sizes and project the line onto the XY-, XZ- and ZY-plane.
			sx = Math.sign(dx); sy = Math.sign(dy); sz = Math.sign(dz);
			ax = Math.abs(dx); ay = Math.abs(dy); az = Math.abs(dz);
			bx = 2 * ax; by = 2 * ay; bz = 2 * az;
			exy = ay - ax; exz = az - ax; ezy = ay - az;

			// Phase 2: Incremental Traversal.
			for(n = ax + ay + az; n > 0; --n) {

				key = keyDesign.packKey(keyCoordinates0);

				// Check if this cell is populated.
				if(grid.has(key)) {

					octant = grid.get(key);

					if(octant.mesh === null) {

						// Setup a pseudo octree.
						octantWrapper.octant = octant;
						octantWrapper.min.copy(keyCoordinates0);
						octantWrapper.min.multiplyScalar(cellSize);
						octantWrapper.min.add(world.min);
						octantWrapper.max.copy(octantWrapper.min).addScalar(cellSize);

						// Raycast the subtree and collect intersecting children.
						intersectSubtree(world, octantWrapper, keyCoordinates0, ray, intersects);

					} else {

						// The octant contains a mesh. No need to look deeper.
						intersects.push(octant);

					}

				}

				if(exy < 0) {

					if(exz < 0) {

						keyCoordinates0.x += sx;
						exy += by; exz += bz;

					} else {

						keyCoordinates0.z += sz;
						exz -= bx; ezy += by;

					}

				} else if(ezy < 0) {

					keyCoordinates0.z += sz;
					exz -= bx; ezy += by;

				} else {

					keyCoordinates0.y += sy;
					exy -= bx; ezy -= bz;

				}

			}

		}

		return intersects;

	}

}
