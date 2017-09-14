import { WorldOctant } from "./WorldOctant.js";

/**
 * A world octant that resides in LOD zero.
 *
 * This octant contains the base volume data. Additionally, it can store a queue
 * of pending CSG operations.
 */

export class LeafWorldOctant extends WorldOctant {

	/**
	 * Constructs a new world octant.
	 */

	constructor() {

		super();

		/**
		 * A CSG operation queue.
		 *
		 * If this queue is not empty, the volume data has to be modified before it
		 * can be contoured.
		 *
		 * @type {Queue}
		 * @default null
		 */

		this.csg = null;

	}

}
