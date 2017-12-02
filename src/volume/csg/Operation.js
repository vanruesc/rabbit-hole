import { Box3 } from "math-ds";

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

		this.bbox = null;

	}

	/**
	 * The bounding box of this operation.
	 *
	 * @type {Box3}
	 */

	get boundingBox() {

		return (this.bbox !== null) ? this.bbox : this.computeBoundingBox();

	}

	/**
	 * Calculates the bounding box of this operation.
	 *
	 * @return {Box3} The bounding box.
	 */

	computeBoundingBox() {

		const children = this.children;

		let i, l;

		this.bbox = new Box3();

		for(i = 0, l = children.length; i < l; ++i) {

			this.bbox.union(children[i].boundingBox);

		}

		return this.bbox;

	}

}
