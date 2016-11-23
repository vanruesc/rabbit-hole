import { Event } from "./event.js";

/**
 * A terrain event.
 *
 * @class TerrainEvent
 * @submodule events
 * @constructor
 * @param {String} type - The name of the event.
 */

export class TerrainEvent extends Event {

	constructor(type) {

		super(type);

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
