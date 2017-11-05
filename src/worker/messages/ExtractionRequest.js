import { Action } from "../Action.js";
import { DataMessage } from "./DataMessage.js";

/**
 * An extraction request.
 */

export class ExtractionRequest extends DataMessage {

	/**
	 * Constructs a new extraction request.
	 */

	constructor() {

		super(Action.EXTRACT);

	}

}
