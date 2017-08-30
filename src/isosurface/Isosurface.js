/**
 * An isosurface, the result of a contouring process.
 */

export class Isosurface {

	/**
	 * Constructs a new isosurface.
	 *
	 * @param {Uint16Array} indices - Triangle indices.
	 * @param {Float32Array} positions - Generated vertices.
	 * @param {Float32Array} normals - Generated normals.
	 */

	constructor(indices, positions, normals) {

		/**
		 * A set of vertex indices that describes triangles.
		 *
		 * @type {Uint16Array}
		 * @default null
		 */

		this.indices = null;

		/**
		 * A set of vertices.
		 *
		 * @type {Float32Array}
		 * @default null
		 */

		this.positions = null;

		/**
		 * A set of normals.
		 *
		 * @type {Float32Array}
		 * @default null
		 */

		this.normals = null;

	}

}
