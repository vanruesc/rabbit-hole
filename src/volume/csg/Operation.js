import { Box3 } from "three";

/**
 * A CSG operation.
 */

export class Operation {

	/**
	 * Constructs a new operation.
	 *
	 * @param {OperationType} type - The type of this operation.
	 * @param {Operation} ...children - Child operations.
	 */

	constructor(type, ...children) {

		/**
		 * The type of this operation.
		 *
		 * @type {OperationType}
		 */

		this.type = type;

		/**
		 * A list of operations.
		 *
		 * Right-hand side operands have precedence, meaning that the result of the
		 * first item in the list will be dominated by the result of the second one,
		 * etc.
		 *
		 * @type {Operation[]}
		 * @private
		 */

		this.children = children;

		/**
		 * The bounding box of this operation.
		 *
		 * @type {Box3}
		 * @private
		 */

		this.boundingBox = null;

	}

	/**
	 * Calculates the complete bounding box of this CSG operation if it doesn't
	 * exist yet and returns it.
	 *
	 * @return {Box3} The bounding box.
	 */

	getBoundingBox() {

		if(this.boundingBox === null) {

			this.boundingBox = this.computeBoundingBox();

		}

		return this.boundingBox;

	}

	/**
	 * Calculates the bounding box of this CSG operation while taking all child
	 * operations into account.
	 *
	 * @return {Box3} The bounding box.
	 */

	computeBoundingBox() {

		const children = this.children;
		const boundingBox = new Box3();

		let i, l;

		for(i = 0, l = children.length; i < l; ++i) {

			boundingBox.union(children[i].getBoundingBox());

		}

		return boundingBox;

	}

}
