/**
 * A terrain event.
 *
 * @class TerrainEvent
 * @submodule events
 * @extends Event
 * @constructor
 * @param {String} [typeArg] - The name of the event.
 */

export class TerrainEvent extends Event {

	constructor(typeArg) {

		super(typeArg);

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
