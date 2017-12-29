/**
 * A base class for performance tests.
 */

export class Test {

	/**
	 * Constructs a new test.
	 *
	 * @param {String} name - The name of the test.
	 */

	constructor(name = null) {

		/**
		 * The name of this test.
		 *
		 * @type {String}
		 */

		this.name = name;

	}

	/**
	 * Initialises this test.
	 *
	 * @throws {Error} An error is thrown if the method is not overridden.
	 * @return {Test} This test.
	 */

	initialize() {

		throw new Error("Test#initialize method not implemented!");

	}

	/**
	 * Clears this test.
	 *
	 * @throws {Error} An error is thrown if the method is not overridden.
	 * @return {Test} This test.
	 */

	clear() {

		throw new Error("Test#clear method not implemented!");

	}

	/**
	 * Runs this test.
	 *
	 * @throws {Error} An error is thrown if the method is not overridden.
	 * @return {String} A result message.
	 */

	run() {

		throw new Error("Test#run method not implemented!");

	}

}
