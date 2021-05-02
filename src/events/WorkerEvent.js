import { Event } from "./Event";

/**
 * A worker event.
 */

export class WorkerEvent extends Event {

	/**
	 * Constructs a new worker event.
	 *
	 * @param {String} type - The name of the event.
	 */

	constructor(type) {

		super(type);

		/**
		 * A worker.
		 *
		 * @type {Worker}
		 */

		this.worker = null;

		/**
		 * A worker response.
		 *
		 * @type {Response}
		 */

		this.response = null;

	}

}
