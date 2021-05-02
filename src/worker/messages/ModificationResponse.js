import { Action } from "../Action";
import { DataMessage } from "./DataMessage";

/**
 * A modification response.
 */

export class ModificationResponse extends DataMessage {

	/**
	 * Constructs a new modification response.
	 */

	constructor() {

		super(Action.MODIFY);

		/**
		 * A serialised SDF.
		 *
		 * @type {Object}
		 */

		this.sdf = null;

	}

}
