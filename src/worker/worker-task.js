import { Task } from "../core/task.js";

/**
 * A worker task.
 *
 * @class WorkerTask
 * @submodule worker
 * @extends Task
 * @constructor
 * @param {Action} action - A worker action.
 * @param {Chunk} chunk - A volume chunk.
 * @param {Number} [priority] - The priority.
 */

export class WorkerTask extends Task {

	constructor(action, chunk, priority) {

		super(priority);

		/**
		 * A worker action.
		 *
		 * @property action
		 * @type Action
		 * @default null
		 */

		this.action = action;

		/**
		 * A volume chunk.
		 *
		 * @property chunk
		 * @type Chunk
		 */

		this.chunk = chunk;

	}

}
