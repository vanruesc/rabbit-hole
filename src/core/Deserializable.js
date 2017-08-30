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
	 * @throws {Error} An error is thrown if the method is not overridden.
	 * @param {Object} object - Serialised data.
	 * @return {Deserializable} This object.
	 */

	deserialize(object) {

		throw new Error("Deserializable#deserialise method not implemented!");

	}

}
