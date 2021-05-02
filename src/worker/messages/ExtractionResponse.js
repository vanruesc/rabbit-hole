import { Action } from "../Action";
import { DataMessage } from "./DataMessage";

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
