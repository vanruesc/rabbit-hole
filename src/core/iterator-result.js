/**
 * An iterator result.
 *
 * @class IteratorResult
 * @submodule core
 * @constructor
 * @param {Vector3} [value] - A value.
 * @param {Vector3} [done] - Whether this result is past the end of the iterated sequence.
 */

export class IteratorResult {

	constructor(value, done) {

		/**
		 * The value.
		 *
		 * @property value
		 * @type Object
		 * @default null
		 */

		this.value = (value !== undefined) ? value : null;

		/**
		 * Whether this result is past the end of the iterated sequence.
		 *
		 * @property done
		 * @type Boolean
		 * @default false
		 */

		this.done = (done !== undefined) ? done : false;

	}

}
