import { Event } from "synthetic-event";

/**
 * A terrain event.
 */

export class TerrainEvent extends Event {

	/**
	 * Constructs a new terrain event.
	 *
	 * @param {String} type - The name of the event.
	 */

	constructor(type) {

		super(type);

		/**
		 * A volume chunk.
		 *
		 * @type {Chunk}
		 * @default null
		 */

		this.chunk = null;

		/**
		 * An error event.
		 *
		 * @type {ErrorEvent}
		 * @default null
		 */

		this.error = null;

	}

}
