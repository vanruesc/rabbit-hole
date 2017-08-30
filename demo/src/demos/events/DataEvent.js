import { Event } from "synthetic-event";

/**
 * A data event.
 */

export class DataEvent extends Event {

	/**
	 * Constructs a new data event.
	 *
	 * @param {String} type - The name of the event.
	 */

	constructor(type) {

		super(type);

		/**
		 * A set of QEF data.
		 *
		 * @type {QEFData}
		 * @default null
		 */

		this.qefData = null;

	}

}
