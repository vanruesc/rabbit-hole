import { Event } from "./Event";

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
		 * A world octant.
		 *
		 * @type {WorldOctant}
		 */

		this.octant = null;

		/**
		 * The Identifier of the world octant.
		 *
		 * @type {WorldOctantId}
		 */

		this.octantId = null;

		/**
		 * An error event.
		 *
		 * @type {ErrorEvent}
		 */

		this.error = null;

	}

}
