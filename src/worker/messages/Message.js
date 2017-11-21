/**
 * A message.
 *
 * Messages are exchanged between different execution contexts such as a worker
 * and the main thread.
 */

export class Message {

	/**
	 * Constructs a new message.
	 *
	 * @param {Action} [action=null] - A worker action.
	 */

	constructor(action = null) {

		/**
		 * A worker action.
		 *
		 * When a message is sent to another execution context, it will be copied
		 * using the Structured Clone algorithm. This automatic process turns the
		 * message into a plain object. The explicit action flag serves as a
		 * reliable identifier.
		 *
		 * @type {Action}
		 * @default null
		 */

		this.action = action;

		/**
		 * An error.
		 *
		 * If this is not null, something went wrong.
		 *
		 * @type {ErrorEvent}
		 * @default null
		 */

		this.error = null;

	}

}
