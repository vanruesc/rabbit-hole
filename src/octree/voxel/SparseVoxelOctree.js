import { Octree, pattern, edges } from "sparse-octree";
import { Vector3 } from "math-ds";
import { QEFData } from "../../math/QEFData.js";
import { QEFSolver } from "../../math/QEFSolver.js";
import { HermiteData } from "../../volume/HermiteData.js";
import { Material } from "../../volume/Material.js";
import { Voxel } from "../../volume/Voxel.js";
import { VoxelCell } from "./VoxelCell.js";

/**
 * Creates intermediate voxel cells down to the leaf octant that is described
 * by the given local grid coordinates and returns it.
 *
 * @private
 * @param {VoxelCell} cell - The root octant.
 * @param {Number} n - The grid resolution.
 * @param {Number} x - A local grid point X-coordinate.
 * @param {Number} y - A local grid point Y-coordinate.
 * @param {Number} z - A local grid point Z-coordinate.
 * @return {VoxelCell} A leaf voxel cell.
 */

function getCell(cell, n, x, y, z) {

	let i = 0;

	for(n = n >> 1; n > 0; n >>= 1, i = 0) {

		// YZ.
		if(x >= n) {

			i += 4; x -= n;

		}

		// XZ.
		if(y >= n) {

			i += 2; y -= n;

		}

		// XY.
		if(z >= n) {

			i += 1; z -= n;

		}

		if(cell.children === null) {

			cell.split();

		}

		cell = cell.children[i];

	}

	return cell;

}

/**
 * Creates a voxel and builds a material configuration code from the materials
 * in the voxel corners.
 *
 * @private
 * @param {Number} n - The grid resolution.
 * @param {Number} x - A local grid point X-coordinate.
 * @param {Number} y - A local grid point Y-coordinate.
 * @param {Number} z - A local grid point Z-coordinate.
 * @param {Uint8Array} materialIndices - The material indices.
 * @return {Voxel} A voxel.
 */

function createVoxel(n, x, y, z, materialIndices) {

	const m = n + 1;
	const mm = m * m;

	const voxel = new Voxel();

	let materials, edgeCount;
	let material, offset, index;
	let c1, c2, m1, m2;

	let i;

	// Pack the material information of the eight corners into a single byte.
	for(materials = 0, i = 0; i < 8; ++i) {

		// Translate the coordinates into a one-dimensional grid point index.
		offset = pattern[i];
		index = (z + offset[2]) * mm + (y + offset[1]) * m + (x + offset[0]);

		// Convert the identified material index into a binary value.
		material = Math.min(materialIndices[index], Material.SOLID);

		// Store the value in bit i.
		materials |= (material << i);

	}

	// Find out how many edges intersect with the implicit surface.
	for(edgeCount = 0, i = 0; i < 12; ++i) {

		c1 = edges[i][0];
		c2 = edges[i][1];

		m1 = (materials >> c1) & 1;
		m2 = (materials >> c2) & 1;

		// Check if there is a material change on the edge.
		if(m1 !== m2) {

			++edgeCount;

		}

	}

	voxel.materials = materials;
	voxel.edgeCount = edgeCount;
	voxel.qefData = new QEFData();

	return voxel;

}

/**
 * A sparse, cubic voxel octree.
 */

export class SparseVoxelOctree extends Octree {

	/**
	 * Constructs a new voxel octree.
	 *
	 * @param {HermiteData} data - A set of volume data.
	 * @param {Vector3} [min] - The lower bounds of this octree.
	 * @param {Number} [size=1] - The size of this octree.
	 */

	constructor(data, min = new Vector3(), size = 1) {

		super();

		/**
		 * The root octant.
		 *
		 * @type {VoxelCell}
		 */

		this.root = new VoxelCell(min, size);

		/**
		 * The amount of voxels in this octree.
		 *
		 * @type {Number}
		 */

		this.voxelCount = 0;

		if(data !== null && data.edgeData !== null) {

			this.construct(data);

		}

		if(VoxelCell.errorThreshold >= 0) {

			this.simplify();

		}

	}

	/**
	 * Attempts to simplify the octree by clustering voxels.
	 *
	 * @private
	 */

	simplify() {

		this.voxelCount -= this.root.collapse();

	}

	/**
	 * Constructs voxel cells from volume data.
	 *
	 * @private
	 * @param {HermiteData} data - The volume data.
	 */

	construct(data) {

		const n = HermiteData.resolution;
		const edgeData = data.edgeData;
		const materialIndices = data.materialIndices;

		const qefSolver = new QEFSolver();
		const intersection = new Vector3();

		const edgeIterators = [
			edgeData.edgesX(this.min, this.root.size),
			edgeData.edgesY(this.min, this.root.size),
			edgeData.edgesZ(this.min, this.root.size)
		];

		const sequences = [
			new Uint8Array([0, 1, 2, 3]),
			new Uint8Array([0, 1, 4, 5]),
			new Uint8Array([0, 2, 4, 6])
		];

		let voxelCount = 0;

		let edges, edge;
		let sequence, offset;
		let cell, voxel;

		let x, y, z;
		let d, i;

		// Process edges X -> Y -> Z.
		for(d = 0; d < 3; ++d) {

			sequence = sequences[d];
			edges = edgeIterators[d];

			for(edge of edges) {

				edge.computeZeroCrossingPosition(intersection);

				// Each edge can belong to up to four voxel cells.
				for(i = 0; i < 4; ++i) {

					// Rotate around the edge.
					offset = pattern[sequence[i]];

					x = edge.coordinates.x - offset[0];
					y = edge.coordinates.y - offset[1];
					z = edge.coordinates.z - offset[2];

					// Check if the adjusted coordinates still lie inside the grid bounds.
					if(x >= 0 && y >= 0 && z >= 0 && x < n && y < n && z < n) {

						cell = getCell(this.root, n, x, y, z);

						if(cell.voxel === null) {

							// The existence of the edge guarantees that the voxel contains the surface.
							cell.voxel = createVoxel(n, x, y, z, materialIndices);

							++voxelCount;

						}

						// Add the edge data to the voxel.
						voxel = cell.voxel;
						voxel.normal.add(edge.n);
						voxel.qefData.add(intersection, edge.n);

						if(voxel.qefData.numPoints === voxel.edgeCount) {

							// Finalise the voxel by solving the accumulated data.
							qefSolver.setData(voxel.qefData).solve(voxel.position);

							if(!cell.contains(voxel.position)) {

								voxel.position.copy(qefSolver.massPoint);

							}

							voxel.normal.normalize();

						}

					}

				}

			}

		}

		this.voxelCount = voxelCount;

	}

}
