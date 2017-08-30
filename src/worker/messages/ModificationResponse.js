import { Action } from "../Action.js";
import { Response } from "./Response.js";

/**
 * A modification response.
 */

export class ModificationResponse extends Response {

	/**
	 * Constructs a new modification response.
	 */

	constructor() {

		super(Action.MODIFY);

	}

}
