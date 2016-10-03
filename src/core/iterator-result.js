/**
 * An iterator result.
 *
 * @class IteratorResult
 * @submodule core
 * @constructor
 * @param {Vector3} [value=null] - A value.
 * @param {Vector3} [done=false] - Whether this result is past the end of the iterated sequence.
 */

export class IteratorResult {

	constructor(value = null, done = false) {

		/**
		 * The value.
		 *
		 * @property value
		 * @type Object
		 * @default null
		 */

		this.value = value;

		/**
		 * Whether this result is past the end of the iterated sequence.
		 *
		 * @property done
		 * @type Boolean
		 * @default false
		 */

		this.done = done;

	}

}
