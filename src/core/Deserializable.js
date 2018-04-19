/**
 * The Deserializable contract.
 *
 * Implemented by objects that can adopt serialised data.
 *
 * @interface
 */

export class Deserializable {

	/**
	 * Adopts the given serialised data.
	 *
	 * @param {Object} object - Serialised data.
	 * @return {Deserializable} This object.
	 */

	deserialize(object) {}

}
