/**
 * A worker response.
 *
 * Responses are sent from a worker to the main thread.
 */

export class Response {

	/**
	 * Constructs a new worker response.
	 *
	 * @param {Action} [action=null] - A worker action.
	 */

	constructor(action = null) {

		/**
		 * A worker action.
		 *
		 * @type {Action}
		 * @default null
		 */

		this.action = action;

		/**
		 * Serialised volume data.
		 *
		 * @type {Object}
		 * @default null
		 */

		this.data = null;

		/**
		 * An error.
		 *
		 * @type {ErrorEvent}
		 * @default null
		 */

		this.error = null;

	}

}
