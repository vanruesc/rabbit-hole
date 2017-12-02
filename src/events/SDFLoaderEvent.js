import { Event } from "synthetic-event";

/**
 * An SDF loader event.
 */

export class SDFLoaderEvent extends Event {

	/**
	 * Constructs a new SDF loader event.
	 *
	 * @param {String} type - The name of the event.
	 */

	constructor(type) {

		super(type);

		/**
		 * A list of serialised SDFs.
		 *
		 * @type {Array}
		 */

		this.descriptions = null;

	}

}
