import THREE from "three";

/**
 * Precomputed cube edges.
 *
 * Used for computing the centroid of each boundary cell.
 *
 * @property CUBE_EDGES
 * @type Int32Array
 * @private
 * @static
 * @final
 */

const CUBE_EDGES = (function() {

	let i, j, k, l;
	let edges = new Int32Array(24);

	for(i = 0; i < 8; ++i) {

		for(j = 1; j <= 4; j <<= 1) {

			l = i ^ j;

			if(i <= l) {

				edges[k++] = i;
				edges[k++] = l;

			}

		}

	}

	return edges;

}());

/**
 * Precomputed edge intersection table.
 *
 * This is a 2 ^ (cube configuration) -> 2 ^ (edge configuration) map.
 * There is one entry for each possible cube configuration, and the 
 * output is a 12-bit vector enumerating all edges crossing the 0-level.
 *
 * @property EDGE_TABLE
 * @type Int32Array
 * @private
 * @static
 * @final
 */

const EDGE_TABLE = (function() {

	let i, j, k, l, m;
	let table = new Int32Array(256);

	for(i = 0, k = 0; i < 256; ++i) {

		for(j = 0; j < 24; j += 2) {

			l = !!(i & (1 << CUBE_EDGES[j]));
			m = !!(i & (1 << CUBE_EDGES[j + 1]));

			k |= (l !== m) ? (1 << (j >> 1)) : 0;

		}

		table[i] = k;

	}

	return table;

}());

/**
 * Surface net algorithm for isosurface extraction.
 *
 * Original code by Mikola Lysenko.
 * Based on: S.F. Gibson, "Constrained Elastic Surface Nets". (1998) MERL Tech Report.
 *
 * @class SurfaceNet
 * @constructor
 * @extends BufferGeometry
 * @param {Float32Array} dimensions - The dimensions of the isosurface geometry.
 * @param {Function} potential - The potential function that describes each point inside the 3D bounds of the isosurface.
 * @param {Array} [bounds] - The bounds of the isosurface geometry.
 */

export class SurfaceNet extends THREE.BufferGeometry {

	constructor(dimensions, potential, bounds) {

		super();

		/**
		 * The dimensions of the isosurface geometry.
		 *
		 * @property bounds
		 * @type Float32Array
		 * @private
		 */

		this._dimensions = (dimensions !== undefined) ? dimensions : new Float32Array(3);

		/**
		 * The potential function that describes each point
		 * inside the 3D bounds of the isosurface.
		 *
		 * @property potential
		 * @type Function
		 * @private
		 */

		this._potential = (potential !== undefined) ? potential : function(x, y, z) { return 0; };

		/**
		 * The bounds of the isosurface geometry.
		 *
		 * @property bounds
		 * @type Array
		 * @private
		 */

		this._bounds = (bounds !== undefined) ? bounds : [[0, 0, 0], this.dimensions];

		this.update();

	}

	/**
	 * The dimensions of the isosurface geometry.
	 *
	 * @property bounds
	 * @type Float32Array
	 */

	get dimensions() { return this._dimensions; }
	set dimensions(x) { this._dimensions = x; this.update(); }

	/**
	 * The potential function that describes each point
	 * inside the 3D bounds of the isosurface.
	 *
	 * @property potential
	 * @type Function
	 */

	get potential() { return this._potential; }
	set potential(x) { this._potential = x; this.update(); }

	/**
	 * The bounds of the isosurface geometry.
	 *
	 * @property bounds
	 * @type Array
	 * @default [[0, 0, 0], dimensions]
	 */

	get bounds() { return this._bounds; }
	set bounds(x) { this._bounds = x; this.update(); }

	/**
	 * Constructs a surface net from the current data.
	 *
	 * @method update
	 * @private
	 */

	update() {

		let x = new Uint32Array(3);
		let R = new Float32Array([1, (this.dimensions[0] + 1), (this.dimensions[0] + 1) * (this.dimensions[1] + 1)]);

		let grid = new Float32Array(8);

		let maxVertexCount = R[2] * 2;

		if(maxVertexCount > 65536) {

			throw new Error("The specified dimensions exceed the maximum possible number of vertices (65536).");

		}

		let indices = new Uint16Array(maxVertexCount * 6);
		let vertexIndices = new Uint16Array(maxVertexCount);
		let vertices = new Float32Array(vertexIndices.length * 3);
		let vertexCounter = 0;
		let indexCounter = 0;
		let m;

		let scale = new Float32Array(3);
		let shift = new Float32Array(3);

		let i, j, k, bufferNo, n;
		let mask, g, p;

		let v = new Float32Array(3);
		let edgeMask, edgeCount;
		let e0, e1, g0, g1, t, a, b;
		let s, iu, iv, du, dv;

		for(i = 0; i < 3; ++i) {

			scale[i] = (this.bounds[1][i] - this.bounds[0][i]) / this.dimensions[i];
			shift[i] = this.bounds[0][i];

		}

		// March over the voxel grid.
		for(x[2] = 0, n = 0, bufferNo = 1; x[2] < (this.dimensions[2] - 1); ++x[2], n += this.dimensions[0], bufferNo ^= 1, R[2] =- R[2]) {

			m = 1 + (this.dimensions[0] + 1) * (1 + bufferNo * (this.dimensions[1] + 1));

			// The contents of the vertexIndices will be the indices of the vertices on the previous x/y slice of the volume.
			for(x[1] = 0; x[1] < this.dimensions[1] - 1; ++x[1], ++n, m += 2) {

				for(x[0] = 0, mask = 0, g = 0; x[0] < this.dimensions[0] - 1; ++x[0], ++n, ++m) {

					/* Read in 8 field values around this vertex and store them in an array.
					 * Also calculate 8-bit mask, like in marching cubes, so we can speed up sign checks later.
					 */

					for(k = 0; k < 2; ++k) {

						for(j = 0; j < 2; ++j) {

							for(i = 0; i < 2; ++i, ++g) {

								p = this.potential(
									scale[0] * (x[0] + i) + shift[0],
									scale[1] * (x[1] + j) + shift[1],
									scale[2] * (x[2] + k) + shift[2]
								);

								grid[g] = p;
								mask |= (p < 0) ? (1 << g) : 0;

							}

						}

					}

					// Continue if the cell doesn't intersect the boundary.
					if(mask !== 0 && mask !== 0xff) {

						// Sum up edge intersections.
						edgeMask = EDGE_TABLE[mask];
						v[0] = v[1] = v[2] = 0.0;
						edgeCount = 0;

						// For every edge of the cube.
						for(i = 0; i < 12; ++i) {

							// Use edge mask to check if it is crossed.
							if(edgeMask & (1 << i)) {

								// If it did, increment number of edge crossings.
								++edgeCount;

								// Now find the point of intersection.

								// Unpack vertices.
								e0 = CUBE_EDGES[i << 1];
								e1 = CUBE_EDGES[(i << 1) + 1];

								// Unpack grid values.
								g0 = grid[e0];
								g1 = grid[e1];

								// Compute point of intersection.
								t  = g0 - g1;

								// Threshold check.
								if(Math.abs(t) > 1e-6) {

									t = g0 / t;

									// Interpolate vertices and add up intersections (this can be done without multiplying).
									for(j = 0, k = 1; j < 3; ++j, k <<= 1) {

										a = e0 & k;
										b = e1 & k;

										if(a !== b) {

											v[j] += a ? 1.0 - t : t;

										} else {

											v[j] += a ? 1.0 : 0;

										}

									}

								}

							}

						}

						// Average the edge intersections and add them to coordinate.
						s = 1.0 / edgeCount;

						for(i = 0; i < 3; ++i) {

							v[i] = scale[i] * (x[i] + s * v[i]) + shift[i];

						}

						// Add vertex to vertices, store pointer to vertex in vertexIndices.
						vertexIndices[m] = vertexCounter / 3;
						vertices[vertexCounter++] = v[0];
						vertices[vertexCounter++] = v[1];
						vertices[vertexCounter++] = v[2];

						// Add faces together by looping over 3 basis components.
						for(i = 0; i < 3; ++i) {

							// The first three entries of the edgeMask count the crossings along the edge.
							if(edgeMask & (1 << i)) {

								// i = axes we are pointing along. iu, iv = orthogonal axes.
								iu = (i + 1) % 3;
								iv = (i + 2) % 3;

								// If we are on a boundary, skip.
								if(x[iu] !== 0 && x[iv] !== 0) {

									// Otherwise, look up adjacent edges in vertexIndices.
									du = R[iu];
									dv = R[iv];

									// Remember to flip orientation depending on the sign of the corner.
									if(mask & 1) {

										indices[indexCounter++] = vertexIndices[m];
										indices[indexCounter++] = vertexIndices[m - du];
										indices[indexCounter++] = vertexIndices[m - dv];

										indices[indexCounter++] = vertexIndices[m - dv];
										indices[indexCounter++] = vertexIndices[m - du];
										indices[indexCounter++] = vertexIndices[m - du - dv];

									} else {

										indices[indexCounter++] = vertexIndices[m];
										indices[indexCounter++] = vertexIndices[m - dv];
										indices[indexCounter++] = vertexIndices[m - du];

										indices[indexCounter++] = vertexIndices[m - du];
										indices[indexCounter++] = vertexIndices[m - dv];
										indices[indexCounter++] = vertexIndices[m - du - dv];

									}

								}

							}

						}

					}

				}

			}

		}

		if(indices.length !== indexCounter) { indices = indices.slice(0, indexCounter); }
		if(vertices.length !== vertexCounter) { vertices = vertices.slice(0, vertexCounter); }

		this.setIndex(new THREE.BufferAttribute(indices, 1));
		this.addAttribute("position", new THREE.BufferAttribute(vertices, 3));
		//this.addAttribute("uv", new THREE.BufferAttribute(uvs, 2));

	}

}
