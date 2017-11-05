import { Action } from "../Action.js";
import { Response } from "./Response.js";

/**
 * An extraction response.
 */

export class ExtractionResponse extends Response {

	/**
	 * Constructs a new extraction response.
	 */

	constructor() {

		super(Action.EXTRACT);

		/**
		 * A serialised isosurface.
		 *
		 * @type {Object}
		 * @default null
		 */

		this.isosurface = null;

	}

}
