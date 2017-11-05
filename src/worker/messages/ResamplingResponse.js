import { Action } from "../Action.js";
import { DataMessage } from "./DataMessage.js";

/**
 * A resampling response.
 */

export class ResamplingResponse extends DataMessage {

	/**
	 * Constructs a new resampling response.
	 */

	constructor() {

		super(Action.RESAMPLE);

		/**
		 * Serialised volume data.
		 *
		 * @type {Object}
		 * @default null
		 */

		this.data = null;

	}

}
