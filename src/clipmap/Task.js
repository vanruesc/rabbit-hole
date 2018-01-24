/**
 * A worker task.
 *
 * @implements {TransferableContainer}
 */

export class Task {

	/**
	 * Constructs a new task.
	 */

	constructor() {

		/**
		 * The primary octant that is involved in this task.
		 *
		 * @type {WorldOctant}
		 */

		this.octant = null;

		/**
		 * The LOD value and the key of the primary octant.
		 *
		 * @type {WorldOctantId}
		 */

		this.octantId = null;

		/**
		 * A list of secondary octants that are involved in this task.
		 *
		 * @type {WorlcOctant[]}
		 */

		this.secondaryOctants = null;

		/**
		 * A list of secondary octant IDs.
		 *
		 * @type {WorldOctantId[]}
		 */

		this.secondaryOctantIds = null;

		/**
		 * A worker request.
		 *
		 * @type {Request}
		 */

		this.request = null;

	}

	/**
	 * Prepares a request that can be sent to a worker thread.
	 *
	 * @return {Request} The request.
	 */

	createRequest() {

		return new Request();

	}

	/**
	 * Reclaims ownership of volume data to complete the round trip.
	 *
	 * @param {Response} response - A worker response.
	 */

	reclaimData(response) {

		this.octant.data = this.octant.data.deserialise(response.data);

	}

	/**
	 * Creates a list of transferable items.
	 *
	 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
	 * @return {Transferable[]} The transfer list.
	 */

	createTransferList(transferList = []) {

		return transferList;

	}

}
