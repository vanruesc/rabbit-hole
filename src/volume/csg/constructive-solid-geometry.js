import { PATTERN } from "sparse-octree";
import { Box3, Vector3 } from "../../math";
import { SDFType, Sphere, Box, Plane, Torus, Heightfield } from "../sdf";
import { Edge } from "../edge.js";
import { EdgeData } from "./edge-data.js";
import { HermiteData } from "./hermite-data.js";
import { OperationType } from "./operation-type.js";
import { Union } from "./union.js";
import { Difference } from "./difference.js";
import { Intersection } from "./intersection.js";

/**
 * Finds out which grid points lie inside the area of the given operation.
 *
 * @method computeIndexBounds
 * @private
 * @static
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

			min.x = Math.ceil(min.x * s / n);
			min.y = Math.ceil(min.y * s / n);
			min.z = Math.ceil(min.z * s / n);

			max.copy(operation.boundingBox.max).min(region.max).sub(region.min);

			max.x = Math.floor(max.x * s / n);
			max.y = Math.floor(max.y * s / n);
			max.z = Math.floor(max.z * s / n);

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
 * @method combineMaterialIndices
 * @private
 * @static
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
 * @method generateMaterialIndices
 * @private
 * @static
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

	const base = chunk.min;
	const offset = new Vector3();
	const position = new Vector3();

	const X = bounds.max.x;
	const Y = bounds.max.y;
	const Z = bounds.max.z;

	let x, y, z;

	for(z = bounds.min.z; z <= Z; ++z) {

		offset.z = z * s / n;

		for(y = bounds.min.y; y <= Y; ++y) {

			offset.y = y * s / n;

			for(x = bounds.min.x; x <= X; ++x) {

				offset.x = x * s / n;

				position.addVectors(base, offset);
				operation.generateMaterialIndex((z * mm + y * m + x), position, data);

			}

		}

	}

}

/**
 * Combines edges.
 *
 * @method combineEdges
 * @private
 * @static
 * @param {Chunk} chunk - A volume chunk
 * @param {Operation} operation - A CSG operation.
 * @param {HermiteData} data0 - A target data set.
 * @param {HermiteData} data1 - A predominant data set.
 * @return {Object} The generated edge data.
 */

function combineEdges(chunk, operation, data0, data1) {

	const materialIndices = data0.materialIndices;
	const indexOffsets = new Uint32Array([1, chunk.resolution + 1, (chunk.resolution + 1) ** 2]);

	const edge1 = new Edge();
	const edge0 = new Edge();

	const edgeData1 = data1.edgeData;
	const edgeData0 = data0.edgeData;
	const edgeData = new EdgeData(chunk.resolution);

	// Edge counters.
	const lengths = new Uint32Array(3);
	const i = new Uint32Array(3);
	const j = new Uint32Array(3);

	let edges1, zeroCrossings1, normals1;
	let edges0, zeroCrossings0, normals0;
	let edges, zeroCrossings, normals;

	let edge;
	let indexA, indexB;

	let d, i, j, il, jl;

	function pushEdge(edge, indexA, d) {

		edges[lengths[d]] = indexA;

		zeroCrossings[lengths[d]] = edge.t;

		normals[lengths[d] * 3] = edge.n.x;
		normals[lengths[d] * 3 + 1] = edge.n.y;
		normals[lengths[d] * 3 + 2] = edge.n.z;

		++lengths[d];

	}

	// Process the edges in the X-plane, then Y and finally Z.
	for(d = 0; d < 3; ++d) {

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

		// Iterate over the generated edges.
		for(i = 0, j = 0; i < il; ++i) {

			indexA = edges1[i];

			// Catch up.
			while(edges0[j] < indexA) {

				++j;

			}

			if(edges0[j] === indexA) {

				edge = operation.updateEdge(edge0, edge1);

			} else {

				edge = operation.updateEdge(edge0, null);

			}

		}

		if(operation.type === OperationType.UNION || operation.type === OperationType.DIFFERENCE) {

			// Collect remaining edges.
			edges[d].set(edges[d].subarray(), i0[d]);
			zeroCrossings[d].set(zeroCrossings[d].subarray(), i1[d]);
			normals[d].set(normals[d].subarray(), i2[d]);

		}

	}

	return { edgeData, lengths };

}

/**
 * Generates edge data.
 *
 * @method generateEdges
 * @private
 * @static
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

	const materialIndices = data.materialIndices;

	const base = chunk.min;
	const offsetA = new Vector3();
	const offsetB = new Vector3();
	const edge = new Edge();

	const indexOffsets = new Uint32Array([1, m, mm]);

	// Allocate space for the maximum amount of edges.
	const edgeData = new EdgeData(n);

	// Edge counters for three dimensions.
	const lengths = new Uint32Array(3);

	let edges, zeroCrossings, normals;
	let indexA, indexB;

	let minX, minY, minZ;
	let maxX, maxY, maxZ;

	let c, d, p, plane;
	let x, y, z;

	// Process the edge in the X-plane, then Y and finally Z.
	for(c = 0, d = 0, p = 4; d < 3; ++d, p >>= 1) {

		edges = edgeData.edges[d];
		zeroCrossings = edgeData.zeroCrossings[d];
		normals = edgeData.normals[d];

		// X: [1, 0, 0] Y: [0, 1, 0] Z: [0, 0, 1].
		plane = PATTERN[p];

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
							(x + plane[0]) * s / n,
							(y + plane[1]) * s / n,
							(z + plane[2]) * s / n
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
 * @method update
 * @private
 * @static
 * @param {Chunk} chunk - A volume chunk.
 * @param {Operation} operation - A CSG operation.
 * @param {HermiteData} data0 - A target data set.
 * @param {HermiteData} [data1] - A predominant data set.
 */

function update(chunk, operation, data0, data1) {

	const bounds = computeIndexBounds(chunk, operation);

	let result, edgeData, lengths, d;

	if(operation.type === OperationType.DENSITY_FUNCTION) {

		generateMaterialIndices(chunk, operation, data0, bounds);

	} else {

		combineMaterialIndices(chunk, operation, data0, data1, bounds);

	}

	if(!data0.empty && !data0.full) {

		result = (operation.type === OperationType.DENSITY_FUNCTION) ?
			generateEdges(chunk, operation, bounds) :
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
 * @method execute
 * @private
 * @static
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
 *
 * @class ConstructiveSolidGeometry
 * @submodule csg
 * @static
 */

export class ConstructiveSolidGeometry {

	/**
	 * Transforms the given chunk of hermite data in two steps:
	 *
	 *  1. Generate data by executing the given SDF.
	 *  2. Combine the generated data with the chunk data.
	 *
	 * @method run
	 * @static
	 * @param {Chunk} chunk - The volume chunk that should be modified.
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	static run(chunk, sdf) {

		if(chunk.data === null) {

			if(sdf.operation !== OperationType.DIFFERENCE) {

				chunk.data = new HermiteData();

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

		if(chunk.data.empty) {

			chunk.data = null;

		} else {

			chunk.data.compress();

		}

	}

	/**
	 * Creates an SDF from the given description.
	 *
	 * @method reviveSDF
	 * @static
	 * @param {Object} description - A description.
	 * @return {SignedDistanceFunction} An SDF.
	 * @todo Use a single abstract SDF and serialise sampling method with expressions.
	 */

	static reviveSDF(description) {

		let sdf, i, l;

		switch(description.type) {

			case SDFType.SPHERE:
				sdf = new Sphere(description.parameters, description.material);
				break;

			case SDFType.BOX:
				sdf = new Box(description.parameters, description.material);
				break;

			case SDFType.TORUS:
				sdf = new Torus(description.parameters, description.material);
				break;

			case SDFType.PLANE:
				sdf = new Plane(description.parameters, description.material);
				break;

			case SDFType.HEIGHTFIELD:
				sdf = new Heightfield(description.parameters, description.material);
				break;

		}

		for(i = 0, l = description.children.length; i < l; ++i) {

			sdf.children.push(this.reviveSDF(description.children[i]));

		}

		return sdf;

	}

}
