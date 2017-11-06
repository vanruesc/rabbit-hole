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
	 * @param {Float32Array} uvs - Generated uvs.
	 * @param {Uint8Array} materials - Generated materials.
	 */

	constructor(indices, positions, normals, uvs, materials) {

		/**
		 * A set of vertex indices that describe triangles.
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

		/**
		 * A set of material indices.
		 *
		 * @type {Float32Array}
		 * @default null
		 */

		this.uvs = null;

		/**
		 * A set of material indices.
		 *
		 * @type {Uint8Array}
		 * @default null
		 */

		this.materials = null;

	}

}
