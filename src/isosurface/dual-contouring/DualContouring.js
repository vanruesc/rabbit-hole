import { edges } from "sparse-octree";
import { Material } from "../../volume/Material.js";
import { Isosurface } from "../Isosurface.js";
import * as tables from "./tables.js";

/**
 * The maximum number of vertices. Vertex indices use 16 bits.
 *
 * @type {Number}
 * @private
 */

const MAX_VERTEX_COUNT = Math.pow(2, 16) - 1;

/**
 * An edge contouring sub-procedure.
 *
 * @private
 * @param {Array} octants - Four leaf octants.
 * @param {Number} dir - A direction index.
 * @param {Array} indexBuffer - An output list for vertex indices.
 */

function contourProcessEdge(octants, dir, indexBuffer) {

	const indices = [-1, -1, -1, -1];
	const signChange = [false, false, false, false];

	let minSize = Infinity;
	let minIndex = 0;
	let flip = false;

	let c1, c2, m1, m2;
	let octant, edge;
	let i;

	for(i = 0; i < 4; ++i) {

		octant = octants[i];
		edge = tables.procEdgeMask[dir][i];

		c1 = edges[edge][0];
		c2 = edges[edge][1];

		m1 = (octant.voxel.materials >> c1) & 1;
		m2 = (octant.voxel.materials >> c2) & 1;

		if(octant.size < minSize) {

			minSize = octant.size;
			minIndex = i;
			flip = (m1 !== Material.AIR);

		}

		indices[i] = octant.voxel.index;
		signChange[i] = (m1 !== m2);

	}

	if(signChange[minIndex]) {

		if(!flip) {

			indexBuffer.push(indices[0]);
			indexBuffer.push(indices[1]);
			indexBuffer.push(indices[3]);

			indexBuffer.push(indices[0]);
			indexBuffer.push(indices[3]);
			indexBuffer.push(indices[2]);

		} else {

			indexBuffer.push(indices[0]);
			indexBuffer.push(indices[3]);
			indexBuffer.push(indices[1]);

			indexBuffer.push(indices[0]);
			indexBuffer.push(indices[2]);
			indexBuffer.push(indices[3]);

		}

	}

}

/**
 * An edge contouring procedure.
 *
 * @private
 * @param {Array} octants - Four edge octants.
 * @param {Number} dir - A direction index.
 * @param {Array} indexBuffer - An output list for vertex indices.
 */

function contourEdgeProc(octants, dir, indexBuffer) {

	const c = [0, 0, 0, 0];

	let edgeOctants;
	let octant;
	let i, j;

	if(octants[0].voxel !== null && octants[1].voxel !== null &&
		octants[2].voxel !== null && octants[3].voxel !== null) {

		contourProcessEdge(octants, dir, indexBuffer);

	} else {

		for(i = 0; i < 2; ++i) {

			c[0] = tables.edgeProcEdgeMask[dir][i][0];
			c[1] = tables.edgeProcEdgeMask[dir][i][1];
			c[2] = tables.edgeProcEdgeMask[dir][i][2];
			c[3] = tables.edgeProcEdgeMask[dir][i][3];

			edgeOctants = [];

			for(j = 0; j < 4; ++j) {

				octant = octants[j];

				if(octant.voxel !== null) {

					edgeOctants[j] = octant;

				} else if(octant.children !== null) {

					edgeOctants[j] = octant.children[c[j]];

				} else {

					break;

				}

			}

			if(j === 4) {

				contourEdgeProc(edgeOctants, tables.edgeProcEdgeMask[dir][i][4], indexBuffer);

			}

		}

	}

}

/**
 * A face contouring procedure.
 *
 * @private
 * @param {Array} octants - Two face octants.
 * @param {Number} dir - A direction index.
 * @param {Array} indexBuffer - An output list for vertex indices.
 */

function contourFaceProc(octants, dir, indexBuffer) {

	const c = [0, 0, 0, 0];

	const orders = [
		[0, 0, 1, 1],
		[0, 1, 0, 1]
	];

	let faceOctants, edgeOctants;
	let order, octant;
	let i, j;

	if(octants[0].children !== null || octants[1].children !== null) {

		for(i = 0; i < 4; ++i) {

			c[0] = tables.faceProcFaceMask[dir][i][0];
			c[1] = tables.faceProcFaceMask[dir][i][1];

			faceOctants = [
				(octants[0].children === null) ? octants[0] : octants[0].children[c[0]],
				(octants[1].children === null) ? octants[1] : octants[1].children[c[1]]
			];

			contourFaceProc(faceOctants, tables.faceProcFaceMask[dir][i][2], indexBuffer);

		}

		for(i = 0; i < 4; ++i) {

			c[0] = tables.faceProcEdgeMask[dir][i][1];
			c[1] = tables.faceProcEdgeMask[dir][i][2];
			c[2] = tables.faceProcEdgeMask[dir][i][3];
			c[3] = tables.faceProcEdgeMask[dir][i][4];

			order = orders[tables.faceProcEdgeMask[dir][i][0]];

			edgeOctants = [];

			for(j = 0; j < 4; ++j) {

				octant = octants[order[j]];

				if(octant.voxel !== null) {

					edgeOctants[j] = octant;

				} else if(octant.children !== null) {

					edgeOctants[j] = octant.children[c[j]];

				} else {

					break;

				}

			}

			if(j === 4) {

				contourEdgeProc(edgeOctants, tables.faceProcEdgeMask[dir][i][5], indexBuffer);

			}

		}

	}

}

/**
 * The main contouring procedure.
 *
 * @private
 * @param {Octant} octant - An octant.
 * @param {Array} indexBuffer - An output list for vertex indices.
 */

function contourCellProc(octant, indexBuffer) {

	const children = octant.children;
	const c = [0, 0, 0, 0];

	let faceOctants, edgeOctants;
	let i;

	if(children !== null) {

		for(i = 0; i < 8; ++i) {

			contourCellProc(children[i], indexBuffer);

		}

		for(i = 0; i < 12; ++i) {

			c[0] = tables.cellProcFaceMask[i][0];
			c[1] = tables.cellProcFaceMask[i][1];

			faceOctants = [
				children[c[0]],
				children[c[1]]
			];

			contourFaceProc(faceOctants, tables.cellProcFaceMask[i][2], indexBuffer);

		}

		for(i = 0; i < 6; ++i) {

			c[0] = tables.cellProcEdgeMask[i][0];
			c[1] = tables.cellProcEdgeMask[i][1];
			c[2] = tables.cellProcEdgeMask[i][2];
			c[3] = tables.cellProcEdgeMask[i][3];

			edgeOctants = [
				children[c[0]],
				children[c[1]],
				children[c[2]],
				children[c[3]]
			];

			contourEdgeProc(edgeOctants, tables.cellProcEdgeMask[i][4], indexBuffer);

		}

	}

}

/**
 * Collects positions and normals from the voxel information of the given octant
 * and its children. The generated vertex indices are stored in the respective
 * voxels during the octree traversal.
 *
 * @private
 * @param {Octant} octant - An octant.
 * @param {Array} vertexBuffer - An array to be filled with vertices.
 * @param {Array} normalBuffer - An array to be filled with normals.
 * @param {Number} index - The next vertex index.
 */

function generateVertexIndices(octant, positions, normals, index) {

	let i, voxel;

	if(octant.children !== null) {

		for(i = 0; i < 8; ++i) {

			index = generateVertexIndices(octant.children[i], positions, normals, index);

		}

	} else if(octant.voxel !== null) {

		voxel = octant.voxel;
		voxel.index = index;

		positions[index * 3] = voxel.position.x;
		positions[index * 3 + 1] = voxel.position.y;
		positions[index * 3 + 2] = voxel.position.z;

		normals[index * 3] = voxel.normal.x;
		normals[index * 3 + 1] = voxel.normal.y;
		normals[index * 3 + 2] = voxel.normal.z;

		++index;

	}

	return index;

}

/**
 * Dual Contouring is an isosurface extraction technique that was originally
 * presented by Tao Ju in 2002:
 *  http://www.cs.wustl.edu/~taoju/research/dualContour.pdf
 */

export class DualContouring {

	/**
	 * Contours the given volume data.
	 *
	 * @param {SparseVoxelOctree} svo - A voxel octree.
	 * @return {Isosurface} The generated isosurface or null if no data was generated.
	 */

	static run(svo) {

		const indexBuffer = [];

		// Each voxel contains one vertex.
		const vertexCount = svo.voxelCount;

		let result = null;
		let positions = null;
		let normals = null;
		let uvs = null;
		let materials = null;

		if(vertexCount > MAX_VERTEX_COUNT) {

			console.warn(
				"Could not create geometry for cell at position", svo.min,
				"(vertex count of", vertexCount, "exceeds limit of ", MAX_VERTEX_COUNT, ")"
			);

		} else if(vertexCount > 0) {

			positions = new Float32Array(vertexCount * 3);
			normals = new Float32Array(vertexCount * 3);
			uvs = new Float32Array(vertexCount * 2);
			materials = new Uint8Array(vertexCount);

			generateVertexIndices(svo.root, positions, normals, 0);
			contourCellProc(svo.root, indexBuffer);

			result = new Isosurface(
				new Uint16Array(indexBuffer),
				positions,
				normals,
				uvs,
				materials
			);

		}

		return result;

	}

}
