import { CubicOctant } from "sparse-octree";
import { QEFData } from "../../math/QEFData.js";
import { QEFSolver } from "../../math/QEFSolver.js";
import { Voxel } from "../Voxel.js";

/**
 * A bias for boundary checks.
 *
 * @type {Number}
 * @private
 */

const BIAS = 1e-6;

/**
 * The base QEF error threshold.
 *
 * @type {Number}
 * @private
 */

const THRESHOLD = 1e-2;

/**
 * A QEF error threshold for voxel clustering.
 *
 * @type {Number}
 * @private
 */

let threshold = 0.0;

/**
 * A voxel octant.
 */

export class VoxelCell extends CubicOctant {

	/**
	 * Constructs a new voxel octant.
	 *
	 * @param {Vector3} [min] - The lower bounds.
	 * @param {Number} [size] - The size of the octant.
	 */

	constructor(min, size) {

		super(min, size);

		/**
		 * A voxel that contains draw information.
		 *
		 * @type {Voxel}
		 * @default null
		 */

		this.voxel = null;

	}

	/**
	 * The level of detail.
	 *
	 * @type {Number}
	 */

	get lod() { return threshold; }

	/**
	 * @type {Number}
	 */

	set lod(lod) {

		threshold = THRESHOLD + (lod * lod * lod);

	}

	/**
	 * Checks if the given point lies inside this cell's boundaries.
	 *
	 * @param {Vector3} p - A point.
	 * @return {Boolean} Whether the given point lies inside this cell.
	 */

	contains(p) {

		const min = this.min;
		const size = this.size;

		return (
			p.x >= min.x - BIAS &&
			p.y >= min.y - BIAS &&
			p.z >= min.z - BIAS &&
			p.x <= min.x + size + BIAS &&
			p.y <= min.y + size + BIAS &&
			p.z <= min.z + size + BIAS
		);

	}

	/**
	 * Attempts to simplify this cell.
	 *
	 * @return {Number} The amount of removed voxels.
	 */

	collapse() {

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

			for(v = 0, i = 0; i < 8; ++i) {

				child = children[i];

				removedVoxels += child.collapse();

				voxel = child.voxel;

				if(child.children !== null) {

					// Couldn't simplify the child.
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
