/**
 * An event.
 */

export class Event {

	/**
	 * Creates a new event.
	 *
	 * @param {String} type - The name of the event.
	 */

	constructor(type) {

		/**
		 * The name of the event.
		 *
		 * @type {String}
		 */

		this.type = type;

		/**
		 * A reference to the target to which the event was originally dispatched.
		 *
		 * @type {EventTarget}
		 */

		this.target = null;

	}

}
