import { CubicOctant } from "sparse-octree";
import { QEFData, QEFSolver } from "../../math";
import { Voxel } from "../voxel.js";

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

	/**
	 * Checks if the given point lies inside this cell's boundaries.
	 *
	 * @method contains
	 * @param {Vector3} p - A point.
	 * @return {Boolean} Whether the given point lies inside this cell.
	 */

	contains(p) {

		const min = this.min;
		const maxX = min.x + this.size;
		const maxY = min.y + this.size;
		const maxZ = min.z + this.size;

		return (
			p.x >= min.x && p.y >= min.y && p.z >= min.z &&
			p.x <= maxX && p.y <= maxY && p.z <= maxZ
		);

	}

	/**
	 * Attempts to simplify this cell.
	 *
	 * @method collapse
	 * @param {Number} threshold - A QEF error threshold.
	 * @return {Number} The amount of removed voxels.
	 */

	collapse(threshold) {

		const children = this.children;

		const signs = new Int16Array([
			-1, -1, -1, -1,
			-1, -1, -1, -1
		]);

		let midSign = -1;
		let collapsible = (children !== null);

		let removedVoxels = 0;

		let qefData, qefSolver;
		let child, sign, voxel;
		let position;

		let v, i;

		if(collapsible) {

			qefData = new QEFData();

			for(v = 0, i = 0; collapsible && i < 8; ++i) {

				child = children[i];

				removedVoxels += child.collapse(threshold);

				voxel = child.voxel;

				if(child.children !== null) {

					collapsible = false;

				} else if(voxel !== null) {

					qefData.addData(voxel.qefData);

					midSign = (voxel.materials >> (7 - i)) & 1;
					signs[i] = (voxel.materials >> i) & 1;

					++v;

				}

			}

			if(collapsible) {

				qefSolver = new QEFSolver();
				position = qefSolver.setData(qefData).solve();

				if(qefSolver.computeError() <= threshold) {

					voxel = new Voxel();
					voxel.position.copy(this.contains(position) ? position : qefSolver.massPoint);

					for(i = 0; i < 8; ++i) {

						sign = signs[i];
						child = children[i];

						if(sign === -1) {

							// Undetermined, use mid sign instead.
							voxel.materials |= (midSign << i);

						} else {

							voxel.materials |= (sign << i);

							// Accumulate normals.
							voxel.normal.add(child.voxel.normal);

						}

					}

					voxel.normal.normalize();
					voxel.qefData = qefData;

					this.voxel = voxel;
					this.children = null;

					// Removed existing voxels and created a new one.
					removedVoxels += v - 1;

				}

			}

		}

		return removedVoxels;

	}

}
