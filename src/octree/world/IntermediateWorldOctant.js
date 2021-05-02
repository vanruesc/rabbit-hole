import { WorldOctant } from "./WorldOctant";

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
		 */

		this.children = 0;

	}

}
