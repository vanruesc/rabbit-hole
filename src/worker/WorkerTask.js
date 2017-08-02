import { Task } from "../core/Task.js";

/**
 * A worker task.
 */

export class WorkerTask extends Task {

	/**
	 * Constructs a new worker task.
	 *
	 * @param {Action} action - A worker action.
	 * @param {Chunk} chunk - A volume chunk.
	 * @param {Number} [priority] - The priority.
	 */

	constructor(action, chunk, priority) {

		super(priority);

		/**
		 * A worker action.
		 *
		 * @type {Action}
		 * @default null
		 */

		this.action = action;

		/**
		 * A volume chunk.
		 *
		 * @type {Chunk}
		 */

		this.chunk = chunk;

	}

}
