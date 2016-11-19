import { Vector3 } from "../math/vector3.js";

/**
 * A cubic voxel that holds information about the surface of a volume.
 *
 * @class Voxel
 * @submodule volume
 * @constructor
 */

export class Voxel {

	constructor() {

		/**
		 * Holds binary material information about all eight corners of this voxel.
		 *
		 * A value of 0 means that this voxel is completely outside of the volume,
		 * whereas a value of 255 means that it's fully inside of it. Any other
		 * value indicates a material change which implies that the voxel contains
		 * the surface.
		 *
		 * @property materials
		 * @type Number
		 * @default 0
		 */

		this.materials = 0;

		/**
		 * The amount of edges that exhibit a material change in this voxel.
		 *
		 * @property edgeCount
		 * @type Number
		 * @default 0
		 */

		this.edgeCount = 0;

		/**
		 * A generated index for this voxel's vertex. Used during the construction
		 * of the final polygons.
		 *
		 * @property index
		 * @type Number
		 * @default -1
		 */

		this.index = -1;

		/**
		 * The vertex that lies inside this voxel.
		 *
		 * @property position
		 * @type Vector3
		 */

		this.position = new Vector3();

		/**
		 * The normal of the vertex that lies inside this voxel.
		 *
		 * @property normal
		 * @type Vector3
		 */

		this.normal = new Vector3();

		/**
		 * A QEF data construct. Used to calculate the vertex position.
		 *
		 * @property qefData
		 * @type QEFData
		 * @default null
		 */

		this.qefData = null;

	}

}
