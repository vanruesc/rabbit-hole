import { Action } from "../Action.js";
import { Request } from "./Request.js";

/**
 * A configuration request.
 */

export class ConfigurationRequest extends Request {

	/**
	 * Constructs a new configuration request.
	 */

	constructor() {

		super(Action.CONFIGURE);

		/**
		 * The global grid resolution of the Hermite data chunks.
		 *
		 * @type {Number}
		 * @default 0
		 */

		this.resolution = 0;

	}

}
