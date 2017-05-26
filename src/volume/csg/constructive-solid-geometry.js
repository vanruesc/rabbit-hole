import { PATTERN } from "sparse-octree";
import { Box3 } from "../../math/box3.js";
import { Vector3 } from "../../math/vector3.js";
import { Material } from "../material.js";
import { EdgeData } from "../edge-data.js";
import { HermiteData } from "../hermite-data.js";
import { Edge } from "../edge.js";
import { OperationType } from "./operation-type.js";
import { Union } from "./union.js";
import { Difference } from "./difference.js";
import { Intersection } from "./intersection.js";

/**
 * Finds out which grid points lie inside the area of the given operation.
 *
 * @private
 * @param {Chunk} chunk - A volume chunk.
 * @param {Operation} operation - A CSG operation.
 * @return {Box3} The index bounds.
 */

function computeIndexBounds(chunk, operation) {

	const s = chunk.size;
	const n = chunk.resolution;

	const min = new Vector3(0, 0, 0);
	const max = new Vector3(n, n, n);

	const region = new Box3(chunk.min, chunk.max);

	if(operation.type !== OperationType.INTERSECTION) {

		if(operation.boundingBox.intersectsBox(region)) {

			min.copy(operation.boundingBox.min).max(region.min).sub(region.min);

			min.x = Math.ceil(min.x * n / s);
			min.y = Math.ceil(min.y * n / s);
			min.z = Math.ceil(min.z * n / s);

			max.copy(operation.boundingBox.max).min(region.max).sub(region.min);

			max.x = Math.floor(max.x * n / s);
			max.y = Math.floor(max.y * n / s);
			max.z = Math.floor(max.z * n / s);

		} else {

			// The chunk is unaffected by this operation.
			min.set(n, n, n);
			max.set(0, 0, 0);

		}

	}

	return new Box3(min, max);

}

/**
 * Combines material indices.
 *
 * @private
 * @param {Chunk} chunk - A volume chunk
 * @param {Operation} operation - A CSG operation.
 * @param {HermiteData} data0 - A target data set.
 * @param {HermiteData} data1 - A predominant data set.
 * @param {Box3} bounds - Grid iteration limits.
 */

function combineMaterialIndices(chunk, operation, data0, data1, bounds) {

	const m = chunk.resolution + 1;
	const mm = m * m;

	const X = bounds.max.x;
	const Y = bounds.max.y;
	const Z = bounds.max.z;

	let x, y, z;

	for(z = bounds.min.z; z <= Z; ++z) {

		for(y = bounds.min.y; y <= Y; ++y) {

			for(x = bounds.min.x; x <= X; ++x) {

				operation.updateMaterialIndex((z * mm + y * m + x), data0, data1);

			}

		}

	}

}

/**
 * Generates material indices.
 *
 * @private
 * @param {Chunk} chunk - A volume chunk
 * @param {DensityFunction} operation - A CSG operation.
 * @param {HermiteData} data - A target data set.
 * @param {Box3} bounds - Grid iteration limits.
 */

function generateMaterialIndices(chunk, operation, data, bounds) {

	const s = chunk.size;
	const n = chunk.resolution;
	const m = n + 1;
	const mm = m * m;

	const materialIndices = data.materialIndices;

	const base = chunk.min;
	const offset = new Vector3();
	const position = new Vector3();

	const X = bounds.max.x;
	const Y = bounds.max.y;
	const Z = bounds.max.z;

	let materialIndex;
	let materials = 0;

	let x, y, z;

	for(z = bounds.min.z; z <= Z; ++z) {

		offset.z = z * s / n;

		for(y = bounds.min.y; y <= Y; ++y) {

			offset.y = y * s / n;

			for(x = bounds.min.x; x <= X; ++x) {

				offset.x = x * s / n;

				materialIndex = operation.generateMaterialIndex(position.addVectors(base, offset));

				if(materialIndex !== Material.AIR) {

					materialIndices[z * mm + y * m + x] = materialIndex;

					++materials;

				}

			}

		}

	}

	data.materials = materials;

}

/**
 * Combines edges.
 *
 * @private
 * @param {Chunk} chunk - A volume chunk
 * @param {Operation} operation - A CSG operation.
 * @param {HermiteData} data0 - A target data set.
 * @param {HermiteData} data1 - A predominant data set.
 * @return {Object} The generated edge data.
 */

function combineEdges(chunk, operation, data0, data1) {

	const m = chunk.resolution + 1;
	const indexOffsets = new Uint32Array([1, m, m * m]);

	const materialIndices = data0.materialIndices;

	const edge1 = new Edge();
	const edge0 = new Edge();

	const edgeData1 = data1.edgeData;
	const edgeData0 = data0.edgeData;
	const edgeData = new EdgeData(chunk.resolution); // edgeData0.edges.length + edgeData1.edges.length
	const lengths = new Uint32Array(3);

	let edges1, zeroCrossings1, normals1;
	let edges0, zeroCrossings0, normals0;
	let edges, zeroCrossings, normals;

	let indexA1, indexB1;
	let indexA0, indexB0;

	let m1, m2;
	let edge;

	let c, d, i, j, il, jl;

	// Process the edges along the X-axis, then Y and finally Z.
	for(c = 0, d = 0; d < 3; c = 0, ++d) {

		edges1 = edgeData1.edges[d];
		edges0 = edgeData0.edges[d];
		edges = edgeData.edges[d];

		zeroCrossings1 = edgeData1.zeroCrossings[d];
		zeroCrossings0 = edgeData0.zeroCrossings[d];
		zeroCrossings = edgeData.zeroCrossings[d];

		normals1 = edgeData1.normals[d];
		normals0 = edgeData0.normals[d];
		normals = edgeData.normals[d];

		il = edges1.length;
		jl = edges0.length;

		// Process all generated edges.
		for(i = 0, j = 0; i < il; ++i) {

			indexA1 = edges1[i];
			indexB1 = indexA1 + indexOffsets[d];

			m1 = materialIndices[indexA1];
			m2 = materialIndices[indexB1];

			if(m1 !== m2 && (m1 === Material.AIR || m2 === Material.AIR)) {

				edge1.t = zeroCrossings1[i];
				edge1.n.x = normals1[i * 3];
				edge1.n.y = normals1[i * 3 + 1];
				edge1.n.z = normals1[i * 3 + 2];

				if(operation.type === OperationType.DIFFERENCE) {

					edge1.n.negate();

				}

				edge = edge1;

				// Process existing edges up to the generated edge.
				while(j < jl && edges0[j] <= indexA1) {

					indexA0 = edges0[j];
					indexB0 = indexA0 + indexOffsets[d];

					edge0.t = zeroCrossings0[j];
					edge0.n.x = normals0[j * 3];
					edge0.n.y = normals0[j * 3 + 1];
					edge0.n.z = normals0[j * 3 + 2];

					m1 = materialIndices[indexA0];

					if(indexA0 < indexA1) {

						m2 = materialIndices[indexB0];

						if(m1 !== m2 && (m1 === Material.AIR || m2 === Material.AIR)) {

							// The edge exhibits a material change and there is no conflict.
							edges[c] = indexA0;
							zeroCrossings[c] = edge0.t;
							normals[c * 3] = edge0.n.x;
							normals[c * 3 + 1] = edge0.n.y;
							normals[c * 3 + 2] = edge0.n.z;

							++c;

						}

					} else {

						// Resolve the conflict.
						edge = operation.selectEdge(edge0, edge1, (m1 === Material.SOLID));

					}

					++j;

				}

				edges[c] = indexA1;
				zeroCrossings[c] = edge.t;
				normals[c * 3] = edge.n.x;
				normals[c * 3 + 1] = edge.n.y;
				normals[c * 3 + 2] = edge.n.z;

				++c;

			}

		}

		// Collect remaining edges.
		while(j < jl) {

			indexA0 = edges0[j];
			indexB0 = indexA0 + indexOffsets[d];

			m1 = materialIndices[indexA0];
			m2 = materialIndices[indexB0];

			if(m1 !== m2 && (m1 === Material.AIR || m2 === Material.AIR)) {

				edges[c] = indexA0;
				zeroCrossings[c] = zeroCrossings0[j];
				normals[c * 3] = normals0[j * 3];
				normals[c * 3 + 1] = normals0[j * 3 + 1];
				normals[c * 3 + 2] = normals0[j * 3 + 2];

				++c;

			}

			++j;

		}

		lengths[d] = c;

	}

	return { edgeData, lengths };

}

/**
 * Generates edge data.
 *
 * @private
 * @param {Chunk} chunk - A volume chunk
 * @param {DensityFunction} operation - A CSG operation.
 * @param {HermiteData} data - A target data set.
 * @param {Box3} bounds - Grid iteration limits.
 * @return {Object} The generated edge data.
 */

function generateEdges(chunk, operation, data, bounds) {

	const s = chunk.size;
	const n = chunk.resolution;
	const m = n + 1;
	const mm = m * m;

	const indexOffsets = new Uint32Array([1, m, mm]);
	const materialIndices = data.materialIndices;

	const base = chunk.min;
	const offsetA = new Vector3();
	const offsetB = new Vector3();
	const edge = new Edge();

	const edgeData = new EdgeData(n);
	const lengths = new Uint32Array(3);

	let edges, zeroCrossings, normals;
	let indexA, indexB;

	let minX, minY, minZ;
	let maxX, maxY, maxZ;

	let c, d, a, axis;
	let x, y, z;

	// Process the edges along the X-axis, then Y and finally Z.
	for(a = 4, c = 0, d = 0; d < 3; a >>= 1, c = 0, ++d) {

		// X: [1, 0, 0] Y: [0, 1, 0] Z: [0, 0, 1].
		axis = PATTERN[a];

		edges = edgeData.edges[d];
		zeroCrossings = edgeData.zeroCrossings[d];
		normals = edgeData.normals[d];

		minX = bounds.min.x; maxX = bounds.max.x;
		minY = bounds.min.y; maxY = bounds.max.y;
		minZ = bounds.min.z; maxZ = bounds.max.z;

		/* Include edges that straddle the bounding box and avoid processing grid
		points at chunk borders. */
		switch(d) {

			case 0:
				minX = Math.max(minX - 1, 0);
				maxX = Math.min(maxX, n - 1);
				break;

			case 1:
				minY = Math.max(minY - 1, 0);
				maxY = Math.min(maxY, n - 1);
				break;

			case 2:
				minZ = Math.max(minZ - 1, 0);
				maxZ = Math.min(maxZ, n - 1);
				break;

		}

		for(z = minZ; z <= maxZ; ++z) {

			for(y = minY; y <= maxY; ++y) {

				for(x = minX; x <= maxX; ++x) {

					indexA = z * mm + y * m + x;
					indexB = indexA + indexOffsets[d];

					// Check if the edge exhibits a material change.
					if(materialIndices[indexA] !== materialIndices[indexB]) {

						offsetA.set(
							x * s / n,
							y * s / n,
							z * s / n
						);

						offsetB.set(
							(x + axis[0]) * s / n,
							(y + axis[1]) * s / n,
							(z + axis[2]) * s / n
						);

						edge.a.addVectors(base, offsetA);
						edge.b.addVectors(base, offsetB);

						// Create and store the edge data.
						operation.generateEdge(edge);

						edges[c] = indexA;
						zeroCrossings[c] = edge.t;
						normals[c * 3] = edge.n.x;
						normals[c * 3 + 1] = edge.n.y;
						normals[c * 3 + 2] = edge.n.z;

						++c;

					}

				}

			}

		}

		lengths[d] = c;

	}

	return { edgeData, lengths };

}

/**
 * Either generates or combines volume data based on the operation type.
 *
 * @private
 * @param {Chunk} chunk - A volume chunk.
 * @param {Operation} operation - A CSG operation.
 * @param {HermiteData} data0 - A target data set. May be empty or full.
 * @param {HermiteData} [data1] - A predominant data set. Cannot be null.
 */

function update(chunk, operation, data0, data1) {

	const bounds = computeIndexBounds(chunk, operation);

	let result, edgeData, lengths, d;
	let done = false;

	if(operation.type === OperationType.DENSITY_FUNCTION) {

		generateMaterialIndices(chunk, operation, data0, bounds);

	} else if(data0.empty) {

		if(operation.type === OperationType.UNION) {

			data0.set(data1);
			done = true;

		}

	} else {

		combineMaterialIndices(chunk, operation, data0, data1, bounds);

	}

	if(!done && !data0.empty && !data0.full) {

		result = (operation.type === OperationType.DENSITY_FUNCTION) ?
			generateEdges(chunk, operation, data0, bounds) :
			combineEdges(chunk, operation, data0, data1);

		edgeData = result.edgeData;
		lengths = result.lengths;

		// Cut off empty data.
		for(d = 0; d < 3; ++d) {

			edgeData.edges[d] = edgeData.edges[d].slice(0, lengths[d]);
			edgeData.zeroCrossings[d] = edgeData.zeroCrossings[d].slice(0, lengths[d]);
			edgeData.normals[d] = edgeData.normals[d].slice(0, lengths[d] * 3);

		}

		data0.edgeData = edgeData;

	}

}

/**
 * Executes the given operation.
 *
 * @private
 * @param {Chunk} chunk - A volume chunk.
 * @param {Operation} operation - An operation.
 * @return {HermiteData} The generated data or null if the data is empty.
 */

function execute(chunk, operation) {

	const children = operation.children;

	let result, data;
	let i, l;

	if(operation.type === OperationType.DENSITY_FUNCTION) {

		// Create a data target.
		result = new HermiteData();

		// Use the density function to generate data.
		update(chunk, operation, result);

	}

	// Union, Difference or Intersection.
	for(i = 0, l = children.length; i < l; ++i) {

		// Generate the full result of the child operation recursively.
		data = execute(chunk, children[i]);

		if(result === undefined) {

			result = data;

		} else if(data !== null) {

			if(result === null) {

				if(operation.type === OperationType.UNION) {

					// Build upon the first non-empty data.
					result = data;

				}

			} else {

				// Combine the two data sets.
				update(chunk, operation, result, data);

			}

		} else if(operation.type === OperationType.INTERSECTION) {

			// An intersection with nothing results in nothing.
			result = null;

		}

		if(result === null && operation.type !== OperationType.UNION) {

			// Further subtractions and intersections would have no effect.
			break;

		}

	}

	return (result !== null && result.empty) ? null : result;

}

/**
 * Constructive Solid Geometry combines Signed Distance Functions by using
 * Boolean operators to generate and transform volume data.
 */

export class ConstructiveSolidGeometry {

	/**
	 * Transforms the given chunk of hermite data in two steps:
	 *
	 *  1. Generate data by executing the given SDF
	 *  2. Combine the generated data with the chunk data
	 *
	 * @param {Chunk} chunk - The volume chunk that should be modified.
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	static run(chunk, sdf) {

		if(chunk.data === null) {

			if(sdf.operation === OperationType.UNION) {

				chunk.data = new HermiteData();
				chunk.data.edgeData = new EdgeData(0);

			}

		} else {

			chunk.data.decompress();

		}

		// Step 1.
		let operation = sdf.toCSG();

		const data = (chunk.data !== null) ? execute(chunk, operation) : null;

		if(data !== null) {

			// Wrap the operation in a super operation.
			switch(sdf.operation) {

				case OperationType.UNION:
					operation = new Union(operation);
					break;

				case OperationType.DIFFERENCE:
					operation = new Difference(operation);
					break;

				case OperationType.INTERSECTION:
					operation = new Intersection(operation);
					break;

			}

			// Step 2.
			update(chunk, operation, chunk.data, data);

			// Provoke a geometry extraction.
			chunk.data.lod = -1;

		}

		if(chunk.data !== null) {

			if(chunk.data.empty) {

				chunk.data = null;

			} else {

				chunk.data.compress();

			}

		}

	}

}
