import { Density, VoxelOctree, EDGES } from "../volume";
import * as tables from "./tables.js";

/**
 * An edge contouring sub-procedure.
 *
 * @method contourProcessEdge
 * @private
 * @static
 * @param {Array} octants - A list of octants.
 * @param {Number} dir - A direction index.
 * @param {Array} indexBuffer - An output list for vertex indices.
 */

function contourProcessEdge(octants, dir, indexBuffer) {

	const indices = [-1, -1, -1, -1];
	const signChange = [false, false, false, false];

	let minSize = Infinity;
	let minIndex = 0;
	let flip = false;

	let i;
	let edge;
	let c1, c2, m1, m2;

	for(i = 0; i < 4; ++i) {

		edge = tables.PROC_EDGE_MASK[dir][i];

		c1 = EDGES[edge][0];
		c2 = EDGES[edge][1];

		m1 = (octants[i].voxel.materials >> c1) & 1;
		m2 = (octants[i].voxel.materials >> c2) & 1;

		if(octants[i].size < minSize) {

			minSize = octants[i].size;
			minIndex = i;
			flip = (m1 !== Density.HOLLOW);

		}

		indices[i] = octants[i].voxel.index;
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
 * @method contourEdgeProc
 * @private
 * @static
 * @param {Array} octants - A list of octants.
 * @param {Number} dir - A direction index.
 * @param {Array} indexBuffer - An output list for vertex indices.
 */

function contourEdgeProc(octants, dir, indexBuffer) {

	const c = [0, 0, 0, 0];

	let i, j;
	let edgeOctants;

	if(octants[0].children === null && octants[1].children === null &&
		octants[2].children === null && octants[3].children === null) {

		contourProcessEdge(octants, dir, indexBuffer);

	} else {

		for(i = 0; i < 2; ++i) {

			c[0] = tables.EDGE_PROC_EDGE_MASK[dir][i][0];
			c[1] = tables.EDGE_PROC_EDGE_MASK[dir][i][1];
			c[2] = tables.EDGE_PROC_EDGE_MASK[dir][i][2];
			c[3] = tables.EDGE_PROC_EDGE_MASK[dir][i][3];

			edgeOctants = [];

			for(j = 0; j < 4; ++j) {

				if(octants[j].children === null) {

					edgeOctants[j] = octants[j];

				} else {

					edgeOctants[j] = octants[j].children[c[j]];

				}

			}

			contourEdgeProc(edgeOctants, tables.EDGE_PROC_EDGE_MASK[dir][i][4], indexBuffer);

		}

	}

}

/**
 * A face contouring procedure.
 *
 * @method contourFaceProc
 * @private
 * @static
 * @param {Array} octants - A list of octants.
 * @param {Number} dir - A direction index.
 * @param {Array} indexBuffer - An output list for vertex indices.
 */

function contourFaceProc(octants, dir, indexBuffer) {

	const c = [0, 0, 0, 0];

	const orders = [
		[0, 0, 1, 1],
		[0, 1, 0, 1]
	];

	let i, j;
	let order, faceOctants, edgeNodes;

	if(octants[0].children !== null || octants[1].children !== null) {

		for(i = 0; i < 4; ++i) {

			c[0] = tables.FACE_PROC_FACE_MASK[dir][i][0];
			c[1] = tables.FACE_PROC_FACE_MASK[dir][i][1];

			faceOctants = [];

			for(j = 0; j < 2; ++j) {

				if(octants[j].children === null) {

					faceOctants[j] = octants[j];

				} else {

					faceOctants[j] = octants[j].children[c[j]];

				}

			}

			contourFaceProc(faceOctants, tables.FACE_PROC_FACE_MASK[dir][i][2], indexBuffer);

		}

		for(i = 0; i < 4; ++i) {

			c[0] = tables.FACE_PROC_EDGE_MASK[dir][i][1];
			c[1] = tables.FACE_PROC_EDGE_MASK[dir][i][2];
			c[2] = tables.FACE_PROC_EDGE_MASK[dir][i][3];
			c[3] = tables.FACE_PROC_EDGE_MASK[dir][i][4];

			edgeNodes = [];

			order = orders[tables.FACE_PROC_EDGE_MASK[dir][i][0]];

			for(j = 0; j < 4; ++j) {

				if(octants[order[j]].children === null) {

					edgeNodes[j] = octants[order[j]];

				} else {

					edgeNodes[j] = octants[order[j]].children[c[j]];

				}

			}

			contourEdgeProc(edgeNodes, tables.FACE_PROC_EDGE_MASK[dir][i][5], indexBuffer);

		}

	}

}

/**
 * The main contouring procedure.
 *
 * @method contourCellProc
 * @private
 * @static
 * @param {Octant} octant - An octant.
 * @param {Array} indexBuffer - An output list for vertex indices.
 */

function contourCellProc(octant, indexBuffer) {

	const c = [0, 0, 0, 0];

	let i, j;
	let faceOctants, edgeNodes;

	if(octant.children !== null) {

		for(i = 0; i < 8; ++i) {

			contourCellProc(octant.children[i], indexBuffer);

		}

		for(i = 0; i < 12; ++i) {

			c[0] = tables.CELL_PROC_FACE_MASK[i][0];
			c[1] = tables.CELL_PROC_FACE_MASK[i][1];

			faceOctants = [
				octant.children[c[0]],
				octant.children[c[1]]
			];

			contourFaceProc(faceOctants, tables.CELL_PROC_FACE_MASK[i][2], indexBuffer);

		}

		for(i = 0; i < 6; ++i) {

			c[0] = tables.CELL_PROC_EDGE_MASK[i][0];
			c[1] = tables.CELL_PROC_EDGE_MASK[i][1];
			c[2] = tables.CELL_PROC_EDGE_MASK[i][2];
			c[3] = tables.CELL_PROC_EDGE_MASK[i][3];

			edgeNodes = [];

			for(j = 0; j < 4; ++j) {

				edgeNodes[j] = octant.children[c[j]];

			}

			contourEdgeProc(edgeNodes, tables.CELL_PROC_EDGE_MASK[i][4], indexBuffer);

		}

	}

}

/**
 * Collects positions and normals from the voxel information of the given octant
 * and its children. The generated vertex indices are stored in the respective
 * voxels.
 *
 * @method generateVertexIndices
 * @private
 * @static
 * @param {Octant} octant - An octant.
 * @param {Array} vertexBuffer - An array to fill with vertices.
 * @param {Array} normalBuffer - An array to fill with normals.
 */

function generateVertexIndices(octant, vertexBuffer, normalBuffer) {

	let i, voxel;

	if(octant.children !== null) {

		for(i = 0; i < 8; ++i) {

			generateVertexIndices(octant.children[i], vertexBuffer, normalBuffer);

		}

	} else if(octant.voxel !== null) {

		voxel = octant.voxel;
		voxel.index = vertexBuffer.length;

		vertexBuffer.push(voxel.position);
		normalBuffer.push(voxel.normal);

	}

}

/**
 * Dual Contouring is an isosurface extraction technique that was originally
 * presented by Tao Ju in 2002:
 *
 *  http://www.cs.wustl.edu/~taoju/research/dualContour.pdf
 *
 * @class DualContouring
 * @submodule isosurface
 * @static
 */

export class DualContouring {

	/**
	 * Contours the given chunk of hermite data and generates vertices, normals
	 * and vertex indices.
	 *
	 * @method run
	 * @static
	 * @param {Chunk} chunk - A chunk of hermite data.
	 * @param {Number} qefThreshold - An error tolerance for the octree simplification.
	 * @param {Array} indexBuffer - An array to fill with indices.
	 * @param {Array} vertexBuffer - An array to fill with vertices.
	 * @param {Array} normalBuffer - An array to fill with normals.
	 * @return {Number} The amount of generated vertices.
	 */

	static run(chunk, qefThreshold, indexBuffer, vertexBuffer, normalBuffer) {

		const octree = new VoxelOctree(chunk);

		if(qefThreshold >= 0.0) {

			octree.simplify(qefThreshold);

		}

		generateVertexIndices(octree.root, vertexBuffer, normalBuffer);
		contourCellProc(octree.root, indexBuffer);

		return vertexBuffer.length;

	}

}
