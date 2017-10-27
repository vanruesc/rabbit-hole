import { HermiteData } from "../../volume/HermiteData.js";
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
		 * @default HermiteData.resolution
		 */

		this.resolution = HermiteData.resolution;

		/**
		 * An error threshold for QEF-based mesh simplification.
		 *
		 * @type {Number}
		 * @default 1e-2
		 */

		this.errorThreshold = 1e-2;

	}

}
