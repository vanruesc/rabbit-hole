import { CubicOctant } from "sparse-octree";

/**
 * A voxel octant.
 *
 * @class VoxelCell
 * @submodule octree
 * @extends CubicOctant
 * @constructor
 * @param {Vector3} [min] - The lower bounds.
 * @param {Number} [size] - The size of the octant.
 */

export class VoxelCell extends CubicOctant {

	constructor(min, size) {

		super(min, size);

		/**
		 * A voxel that contains draw information.
		 *
		 * @property voxel
		 * @type Voxel
		 * @default null
		 */

		this.voxel = null;

	}

}
