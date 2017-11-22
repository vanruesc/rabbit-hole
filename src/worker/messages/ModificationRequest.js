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
		 * @default null
		 */

		this.sdf = null;

		/**
		 * The world size of the volume data cell.
		 *
		 * @type {Number}
		 * @default 0
		 */

		this.cellSize = 0;

		/**
		 * The world positions of the volume data cells.
		 *
		 * Together with the world size, this base position describes the region of
		 * the volume data cell in world space.
		 *
		 * @type {Number[]}
		 * @default null
		 */

		this.cellPosition = null;

	}

}
