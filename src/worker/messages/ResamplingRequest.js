import { Action } from "../Action.js";
import { DataMessage } from "./DataMessage.js";

/**
 * A resampling request.
 */

export class ResamplingRequest extends DataMessage {

	/**
	 * Constructs a new resampling request.
	 */

	constructor() {

		super(Action.RESAMPLE);

	}

}
