/**
 * A group of transferable containers.
 *
 * @implements {Serializable}
 * @implements {Deserializable}
 * @implements {TransferableContainer}
 */

export class ContainerGroup {

	/**
	 * Constructs a new data container group.
	 *
	 * @param {...TransferableContainer} children - Data containers.
	 */

	constructor(...children) {

		/**
		 * The transferable containers.
		 *
		 * @type {TransferableContainer[]}
		 */

		this.children = children;

	}

	/**
	 * Indicates whether this container group is empty.
	 *
	 * @type {Boolean}
	 */

	get empty() { return (this.children === null || this.children.length === 0); }

	/**
	 * Performs a shallow copy of the provided container group.
	 *
	 * @param {ContainerGroup} containerGroup - A container group.
	 * @return {ContainerGroup} This container group.
	 */

	copy(containerGroup) {

		this.children = containerGroup.children.slice(0);

		return this;

	}

	/**
	 * Performs a batch serialisation of the data containers in this group.
	 *
	 * @return {Object} The serialised data.
	 */

	serialize() {

		const children = this.children;
		const result = [];

		let i, l;

		for(i = 0, l = children.length; i < l; ++i) {

			result.push(children[i].serialise());

		}

		return result;

	}

	/**
	 * Performs a batch deserialisation for the data containers in this group.
	 *
	 * The group should match the given serialised data group.
	 *
	 * @param {Object} object - A serialised data group. Can be null.
	 * @return {Deserializable} This object or null if the given serialised data was null.
	 */

	deserialize(object) {

		const children = this.children;

		let result = this;
		let i, l;

		if(object !== null) {

			// Lengths should always be the same. Sanitise to be safe.
			for(i = 0, l = Math.min(children.length, object.length); i < l; ++i) {

				// Each individual entry may become null.
				children[i] = children[i].deserialize(object[i]);

			}

		} else {

			result = null;

		}

		return result;

	}

	/**
	 * Creates a list of transferable items.
	 *
	 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
	 * @return {Transferable[]} The transfer list.
	 */

	createTransferList(transferList = []) {

		const children = this.children;

		let i, l;

		for(i = 0, l = children.length; i < l; ++i) {

			children[i].createTransferList(transferList);

		}

		return transferList;

	}

}
