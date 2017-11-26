/**
 * The Disposable contract.
 *
 * Implemented by objects that can free internal resources.
 *
 * @interface
 */

export class Disposable {

	/**
	 * Frees internal resources.
	 *
	 * @throws {Error} An error is thrown if the method is not overridden.
	 */

	dispose() {

		throw new Error("Disposable#dispose method not implemented!");

	}

}
