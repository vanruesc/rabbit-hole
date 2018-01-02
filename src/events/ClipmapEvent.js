import { Event } from "synthetic-event";

/**
 * A clipmap event.
 */

export class ClipmapEvent extends Event {

	/**
	 * Constructs a new clipmap event.
	 *
	 * @param {String} type - The name of the event.
	 */

	constructor(type) {

		super(type);

		/**
		 * The LOD shell.
		 *
		 * @type {Number}
		 */

		this.lod = -1;

		/**
		 * A list of world octant Identifiers that have left the LOD shell.
		 *
		 * @type {WorldOctantId[]}
		 */

		this.left = null;

		/**
		 * A list of world octant Identifiers that have entered the LOD shell.
		 *
		 * @type {WorldOctantId[]}
		 */

		this.entered = null;

		/**
		 * An error event.
		 *
		 * @type {ErrorEvent}
		 */

		this.error = null;

	}

}
