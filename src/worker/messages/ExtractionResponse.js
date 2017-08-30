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
		 * An isosurface.
		 *
		 * @type {Isosurface}
		 * @default null
		 */

		this.isosurface = null;

	}

}
