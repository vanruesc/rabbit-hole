/**
 * A world octant.
 *
 * This octant is a volume data container. Its position is implicitly defined
 * by its key while its size is defined by the LOD grid in which it resides.
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
		 * @default null
		 */

		this.data = null;

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

		/**
		 * An isosurface mesh.
		 *
		 * @type {Mesh}
		 * @default null
		 */

		this.mesh = null;

	}

}
