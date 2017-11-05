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
		 * The world size of the volume data cells.
		 *
		 * @type {Array}
		 * @default null
		 */

		this.cellSizes = null;

		/**
		 * The world positions of the volume data cells.
		 *
		 * Together with the world sizes, these base positions describes the region
		 * of the volume data cells in world space.
		 *
		 * @type {Number[]}
		 * @default null
		 */

		this.cellPositions = null;

	}

}
