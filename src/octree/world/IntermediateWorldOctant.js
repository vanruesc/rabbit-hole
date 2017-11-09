import { WorldOctant } from "./WorldOctant.js";

/**
 * A world octant that doesn't reside in LOD zero.
 *
 * This octant is a container for resampled volume data. Additionally, it stores
 * information about the existence of its potential children.
 */

export class IntermediateWorldOctant extends WorldOctant {

	/**
	 * Constructs a new intermediate world octant.
	 */

	constructor() {

		super();

		/**
		 * An 8-bit mask that indicates the existence of the eight potential
		 * children.
		 *
		 * The order of the children follows the common octant layout from the
		 * external `sparse-octree` module:
		 *
		 * ```text
		 *    3____7
		 *  2/___6/|
		 *  | 1__|_5
		 *  0/___4/
		 * ```
		 *
		 * @type {Number}
		 * @default 0
		 */

		this.children = 0;

	}

	/**
	 * Removes the mesh data and the resampled volume data from this octant.
	 *
	 * The octant may be processed again to generate new data if needed.
	 *
	 * @return {IntermediateWorldOctant} This octant.
	 */

	clear() {

		this.data = null;
		this.mesh = null;

		return this;

	}

}
