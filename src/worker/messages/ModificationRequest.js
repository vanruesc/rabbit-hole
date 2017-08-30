import { Action } from "../Action.js";
import { Request } from "./Request.js";

/**
 * A modification request.
 */

export class ModificationRequest extends Request {

	/**
	 * Constructs a new modification request.
	 */

	constructor() {

		super(Action.MODIFY);

		/**
		 * A serialised SDF.
		 *
		 * @type {Object}
		 * @default null
		 */

		this.sdf = null;

	}

}
