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
		 * A volume chunk.
		 *
		 * @property chunk
		 * @type Chunk
		 * @default null
		 */

		this.chunk = null;

	}

}
