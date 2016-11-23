/**
 * A basic event.
 *
 * @class Event
 * @submodule events
 * @constructor
 * @param {String} type - The name of the event.
 */

export class Event {

	constructor(type) {

		/**
		 * The name of the event.
		 *
		 * @property type
		 * @type String
		 */

		this.type = type;

		/**
		 * A reference to the target to which the event was originally dispatched.
		 *
		 * @property target
		 * @type Object
		 * @default null
		 */

		this.target = null;

	}

}
