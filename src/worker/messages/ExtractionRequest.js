import { Action } from "../Action.js";
import { Request } from "./Request.js";

/**
 * An extraction request.
 */

export class ExtractionRequest extends Request {

	/**
	 * Constructs a new extraction request.
	 */

	constructor() {

		super(Action.EXTRACT);

	}

}
