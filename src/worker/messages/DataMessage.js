import { Message } from "./Message.js";

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
		 * A group of data containers.
		 *
		 * @type {Array}
		 * @default null
		 */

		this.containerGroup = null;

	}

}
