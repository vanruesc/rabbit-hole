import { Action } from "../Action.js";
import { DataMessage } from "./DataMessage.js";

/**
 * A modification request.
 */

export class ModificationRequest extends DataMessage {

	/**
	 * Constructs a new modification request.
	 */

	constructor() {

		super(Action.MODIFY);

		/**
		 * A serialised SDF.
		 *
		 * @type {Object}
		 */

		this.sdf = null;

		/**
		 * The world size of the volume data cell.
		 *
		 * @type {Number}
		 */

		this.cellSize = 0;

		/**
		 * The world positions of the volume data cell.
		 *
		 * Together with the world size, this base position describes the region of
		 * the volume data cell in world space.
		 *
		 * @type {Number[]}
		 */

		this.cellPosition = null;

	}

}
