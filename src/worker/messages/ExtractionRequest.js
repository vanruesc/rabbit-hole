import { Action } from "../Action";
import { DataMessage } from "./DataMessage";

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
