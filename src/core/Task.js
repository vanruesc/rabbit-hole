/**
 * A task.
 */

export class Task {

	/**
	 * Constructs a new task.
	 *
	 * @param {Number} [priority=0] - The priority.
	 */

	constructor(priority = 0) {

		/**
		 * The priority of this task.
		 *
		 * @type {Number}
		 * @default 0
		 */

		this.priority = priority;

		/**
		 * The index of this task.
		 *
		 * @type {Number}
		 * @default -1
		 */

		this.index = -1;

	}

}
