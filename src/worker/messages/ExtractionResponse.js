import { Action } from "../Action.js";
import { DataMessage } from "./DataMessage.js";

/**
 * An extraction response.
 */

export class ExtractionResponse extends DataMessage {

	/**
	 * Constructs a new extraction response.
	 */

	constructor() {

		super(Action.EXTRACT);

		/**
		 * A serialised isosurface.
		 *
		 * @type {Object}
		 */

		this.isosurface = null;

	}

}
