import { Event } from "./event.js";

/**
 * A worker event.
 *
 * @class WorkerEvent
 * @submodule events
 * @constructor
 * @param {String} type - The name of the event.
 */

export class WorkerEvent extends Event {

	constructor(type) {

		super(type);

		/**
		 * A worker.
		 *
		 * @property worker
		 * @type Worker
		 * @default null
		 */

		this.worker = null;

		/**
		 * A message.
		 *
		 * @property data
		 * @type Object
		 * @default null
		 */

		this.data = null;

	}

}
