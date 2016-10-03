/**
 * A task.
 *
 * @class Task
 * @submodule core
 * @constructor
 * @param {Number} [priority=0] - The priority.
 */

export class Task {

	constructor(priority = 0) {

		/**
		 * The priority of this task.
		 *
		 * @property priority
		 * @type Number
		 * @default 0
		 */

		this.priority = priority;

		/**
		 * The index of this task.
		 *
		 * @property index
		 * @type Number
		 * @default -1
		 */

		this.index = -1;

	}

}
