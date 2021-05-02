import { Queue } from "../../core/Queue";

/**
 * A world octant.
 *
 * This octant serves as a volume data container. Its position is implicitly
 * defined by its key while its size is defined by the LOD grid in which it
 * resides. Additionally, it can store a queue of pending CSG operations.
 */

export class WorldOctant {

	/**
	 * Constructs a new world octant.
	 */

	constructor() {

		/**
		 * Hermite data.
		 *
		 * @type {HermiteData}
		 */

		this.data = null;

		/**
		 * A CSG operation queue.
		 *
		 * If this queue is not empty, the volume data has to be modified before it
		 * can be contoured.
		 *
		 * @type {Queue}
		 */

		this.csg = new Queue();

		/**
		 * A generated isosurface mesh.
		 *
		 * @type {Isosurface}
		 */

		this.isosurface = null;

	}

}
