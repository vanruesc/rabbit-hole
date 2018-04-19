/**
 * The Serializable contract.
 *
 * Implemented by objects that can provide a flat representation of the data
 * they contain.
 *
 * @interface
 */

export class Serializable {

	/**
	 * Serialises this data.
	 *
	 * @param {Boolean} [deflate=false] - Whether the data should be compressed if possible.
	 * @return {Object} The serialised data.
	 */

	serialize(deflate = false) {}

}
