/**
 * A terrain event.
 *
 * @class TerrainEvent
 * @submodule events
 * @constructor
 * @param {String} type - The name of the event.
 */

export class TerrainEvent {

	constructor(type) {

		/**
		 * The name of the event.
		 *
		 * @property type
		 * @type String
		 */

		this.type = type;

		/**
		 * A reference to the target to which the event was originally dispatched.
		 *
		 * @property target
		 * @type Object
		 */

		this.target = type;

		/**
		 * A volume chunk.
		 *
		 * @property chunk
		 * @type Chunk
		 * @default null
		 */

		this.chunk = null;

	}

}
