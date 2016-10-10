import { PATTERN } from "sparse-octree";
import { Box3, Vector3 } from "../../math";
import { SDFType, Sphere, Box, Plane, Torus, Heightfield } from "../sdf";
import { Edge } from "../edge.js";
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
 * @method combine
 * @private
 * @static
 * @param {Chunk} chunk - A volume chunk
 * @param {Operation} operation - A CSG operation.
 * @param {HermiteData} data0 - A target data set.
 * @param {HermiteData} data1 - A predominant data set.
 * @param {Box3} bounds - Grid iteration limits.
 */

function updateMaterialIndices(chunk, operation, data0, data1, bounds) {

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
 * @param {Box3} bounds - Grid iteration limits.
 * @return {Object} The generated edge data.
 */

function combineEdges(chunk, operation, data0, data1, bounds) {

	const n = chunk.resolution;
	const m = n + 1;
	const maxEdges = 3 * m * m * n;

	//const materialIndices = data.materialIndices;
	//const edge = new Edge();

	// Allocate space for the maximum amount of edges.
	const edges = new Uint32Array(maxEdges * 2);
	const t = new Float32Array(maxEdges);
	const normals = new Float32Array(maxEdges * 3);

	const edges0 = data0.edges;
	const t0 = data0.t;
	const normals0 = data0.normals;

	const edges1 = data1.edges;
	const t1 = data1.t;
	const normals1 = data1.normals;

	let edgeCount = 0;

	let i0 = 0;
	let i1 = 0;
	let i2 = 0;

	let i3 = 0;
	let i4 = 0;
	let i5 = 0;

	let l = data.edges.length;

	while(i0 < l) {

		indexA = data.edges[i0++];
		indexB = data.edges[i0++];

		

	}

	if(operation.type === OperationType.UNION || operation.type === OperationType.DIFFERENCE) {

		// Collect remaining edges.
		edges.set(edges0.subarray(i4), i1);
		t.set(t0.subarray(i3), i0);
		normals.set(normals0.subarray(i5), i2);

		edgeCount

	}

	return {
		edges: edges,
		t: t,
		normals: normals,
		edgeCount: i0
	};

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
	const maxEdges = 3 * mm * n;

	const base = chunk.min;
	const offsetA = new Vector3();
	const offsetB = new Vector3();

	const indexOffsets = new Uint32Array([1, m, mm]);

	const materialIndices = data.materialIndices;
	const edge = new Edge();

	// Allocate space for the maximum amount of edges.
	const edges = new Uint32Array(maxEdges * 2);
	const t = new Float32Array(maxEdges);
	const normals = new Float32Array(maxEdges * 3);

	// Include edges that straddle the bounding box.
	bounds.min.set(
		Math.max(bounds.min.x - 1, 0),
		Math.max(bounds.min.y - 1, 0),
		Math.max(bounds.min.z - 1, 0)
	);

	const X = bounds.max.x;
	const Y = bounds.max.y;
	const Z = bounds.max.z;

	let edgeCount = 0;

	let i0 = 0;
	let i1 = 0;
	let i2 = 0;

	let x, y, z;

	let c, plane, xyz;
	let combination;

	for(z = bounds.min.z; z <= Z; ++z) {

		offsetA.z = z * s / n;

		for(y = bounds.min.y; y <= Y; ++y) {

			offsetA.y = y * s / n;

			for(x = bounds.min.x; x <= X; ++x) {

				offsetA.x = x * s / n;

				indexA = z * mm + y * m + x;
				edge.a.addVectors(base, offsetA);

				// Process the edge in the X-plane, then Y and finally Z.
				for(c = 0, plane = 4; c < 3; ++c, plane >>= 1) {

					// Select the grid point index of the current plane.
					switch(c) {

						case 0: xyz = x; break;
						case 1: xyz = y; break;
						case 2: xyz = z; break;

					}

					// Check if an edge exists in this plane.
					if(xyz < n) {

						indexB = indexA + indexOffsets[c];

						// Check if the edge exhibits a material change.
						if(materialIndices[indexA] !== materialIndices[indexB]) {

							// X: [1, 0, 0] Y: [0, 1, 0] Z: [0, 0, 1].
							combination = PATTERN[plane];

							offsetB.set(
								(x + combination[0]) * s / n,
								(y + combination[1]) * s / n,
								(z + combination[2]) * s / n
							);

							edge.b.addVectors(base, offsetB);
							operation.generateEdge(edge);

							// Push the created edge data.
							edges[i1++] = indexA;
							edges[i1++] = indexB;

							t[i0++] = edge.t;

							normals[i2++] = edge.n.x;
							normals[i2++] = edge.n.y;
							normals[i2++] = edge.n.z;

						}

					}

				}

			}

		}

	}

	return {
		edges: edges,
		t: t,
		normals: normals,
		edgeCount: i0
	};

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
 * @param {HermiteData} [data1] - Predominant data set.
 */

function update(chunk, operation, data0, data1) {

	const bounds = computeIndexBounds(chunk, operation);

	let edgeData;

	if(operation.type === OperationType.DENSITY_FUNCTION) {

		generateMaterialIndices(chunk, operation, data0, bounds);

	} else {

		combineMaterialIndices(chunk, operation, data0, data1, bounds);

	}

	if(!data.empty && !data.full) {

		edgeData = (operation.type === OperationType.DENSITY_FUNCTION) ?
			generateEdges(chunk, operation, bounds) :
			combineEdges(chunk, operation, data0, data1, bounds);

		// Cut off empty data.
		data0.edges = edgeData.edges.slice(0, edgeData.edgeCount * 2);
		data0.t = edgeData.t.slice(0, edgeData.edgeCount);
		data0.normals = edgeData.normals.slice(0, edgeData.edgeCount * 3);

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
 * boolean operators to generate and transform volume data.
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
