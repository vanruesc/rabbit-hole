import { Message } from "./Message";

/**
 * A worker message that contains transferable data.
 */

export class DataMessage extends Message {

	/**
	 * Constructs a new data message.
	 *
	 * @param {Action} [action=null] - A worker action.
	 */

	constructor(action = null) {

		super(action);

		/**
		 * A serialised data container.
		 *
		 * @type {Object}
		 */

		this.data = null;

	}

}
