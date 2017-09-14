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
		 * A generated isosurface mesh.
		 *
		 * @type {Mesh}
		 * @default null
		 */

		this.mesh = null;

	}

}
