import { OperationType } from "../volume/csg/operation-type.js";

/**
 * An operation history.
 *
 * @class History
 * @submodule core
 * @constructor
 */

export class History {

	/**
	 * Constructs a new operation history.
	 */

	constructor() {

		/**
		 * The elements that have been executed during the current session.
		 *
		 * @type {SignedDistanceFunction[]}
		 * @private
		 */

		this.elements = [];

	}

	/**
	 * Adds an SDF to the operation history.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 * @return {Number} The new length of the history list.
	 */

	push(sdf) {

		return this.elements.push(sdf);

	}

	/**
	 * Removes the SDF that was last added to the history and returns it.
	 *
	 * @return {SignedDistanceFunction} An SDF.
	 */

	pop() {

		return this.elements.pop();

	}

	/**
	 * Combines all operations into one.
	 *
	 * @return {SignedDistanceFunction} An SDF consisting of all past operations, or null if there are none.
	 */

	combine() {

		const elements = this.elements;

		let a = null;
		let b = null;

		let i, l;

		for(i = 0, l = elements.length; i < l; ++i) {

			b = elements[i];

			if(a !== null) {

				switch(b.operation) {

					case OperationType.UNION:
						a.union(b);
						break;

					case OperationType.DIFFERENCE:
						a.subtract(b);
						break;

					case OperationType.INTERSECTION:
						a.intersect(b);
						break;

				}

			} else {

				a = b;

			}

		}

		return a;

	}

	/**
	 * Clears this history.
	 */

	clear() {

		this.elements = [];

	}

}
