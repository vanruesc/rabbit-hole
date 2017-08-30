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
	 * @throws {Error} An error is thrown if the method is not overridden.
	 * @return {Object} The serialised data.
	 */

	serialize() {

		throw new Error("Serializable#serialise method not implemented!");

	}

}
