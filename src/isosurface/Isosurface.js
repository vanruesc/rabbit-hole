/**
 * An isosurface, the result of a contouring process.
 *
 * @implements {Serializable}
 * @implements {Deserializable}
 * @implements {TransferableContainer}
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

	/**
	 * Serialises this isosurface.
	 *
	 * @return {Object} The serialised isosurface.
	 */

	serialize() {

		return {
			indices: this.indices,
			positions: this.positions,
			normals: this.normals,
			uvs: this.uvs,
			materials: this.materials
		};

	}

	/**
	 * Adopts the given serialised isosurface.
	 *
	 * @param {Object} object - A serialised isosurface. Can be null.
	 * @return {Deserializable} This object or null if the given serialised isosurface was null.
	 */

	deserialize(object) {

		let result = this;

		if(object !== null) {

			this.indices = object.indices;
			this.positions = object.positions;
			this.normals = object.normals;
			this.uvs = object.uvs;
			this.materials = object.materials;

		} else {

			result = null;

		}

		return result;

	}

	/**
	 * Creates a list of transferable items.
	 *
	 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
	 * @return {Transferable[]} The transfer list.
	 */

	createTransferList(transferList = []) {

		transferList.push(this.indices.buffer);
		transferList.push(this.positions.buffer);
		transferList.push(this.normals.buffer);
		transferList.push(this.uvs.buffer);
		transferList.push(this.materials.buffer);

		return transferList;

	}

}
