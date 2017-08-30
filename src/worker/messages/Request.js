/**
 * A worker request.
 *
 * Requests are sent from the main thread to a worker.
 */

export class Request {

	/**
	 * Constructs a new worker request.
	 *
	 * @param {Action} [action=null] - A worker action.
	 */

	constructor(action = null) {

		/**
		 * A worker action.
		 *
		 * @type {Action}
		 * @default null
		 */

		this.action = action;

		/**
		 * Serialised volume data.
		 *
		 * @type {Object}
		 * @default null
		 */

		this.data = null;

		/**
		 * The world size of the volume data cell.
		 *
		 * @type {Number}
		 * @default 0
		 */

		this.cellSize = 0;

		/**
		 * The world position of the volume data cell as an array.
		 *
		 * Together with the world size, this base position describes the volume's
		 * region in world space.
		 *
		 * @type {Number[]}
		 * @default null
		 */

		this.cellPosition = null;

	}

}
