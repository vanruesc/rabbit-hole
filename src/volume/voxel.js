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
		 * @private
		 * @default 0
		 */

		this.materials = 0;

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
		 * @default null
		 */

		this.position = null;

		/**
		 * The normal of the vertex that lies inside this voxel.
		 *
		 * @property normal
		 * @type Vector3
		 * @default null
		 */

		this.normal = null;

		/**
		 * A QEF data construct. Used to calculate the vertex position.
		 *
		 * @property qef
		 * @type QEFData
		 * @default null
		 */

		this.qef = null;

	}

}

/**
 * Describes all possible voxel corner connections.
 *
 * @property EDGES
 * @type Array
 * @static
 * @final
 */

export const EDGES = [

	// X-Axis.
	new Uint8Array([0, 4]),
	new Uint8Array([1, 5]),
	new Uint8Array([2, 6]),
	new Uint8Array([3, 7]),

	// Y-Axis.
	new Uint8Array([0, 2]),
	new Uint8Array([1, 3]),
	new Uint8Array([4, 6]),
	new Uint8Array([5, 7]),

	// Z-Axis.
	new Uint8Array([0, 1]),
	new Uint8Array([2, 3]),
	new Uint8Array([4, 5]),
	new Uint8Array([6, 7])

];
