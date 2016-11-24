/**
 * An collection of movement flags.
 *
 * @class MovementState
 * @constructor
 */

export class MovementState {

	constructor() {

		/**
		 * Movement to the left.
		 *
		 * @property left
		 * @type Boolean
		 */

		this.left = false;

		/**
		 * Movement to the right.
		 *
		 * @property right
		 * @type Boolean
		 */

		this.right = false;

		/**
		 * Forward motion.
		 *
		 * @property forward
		 * @type Boolean
		 */

		this.forward = false;

		/**
		 * Backward motion.
		 *
		 * @property backward
		 * @type Boolean
		 */

		this.backward = false;

		/**
		 * Ascension.
		 *
		 * @property up
		 * @type Boolean
		 */

		this.up = false;

		/**
		 * Descent.
		 *
		 * @property down
		 * @type Boolean
		 */

		this.down = false;

		/**
		 * Movement speed boost.
		 *
		 * @property boost
		 * @type Boolean
		 */

		this.boost = false;

	}

}
