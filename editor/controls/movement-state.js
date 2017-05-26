/**
 * An collection of movement flags.
 */

export class MovementState {

	/**
	 * Constructs a new movement state.
	 */

	constructor() {

		/**
		 * Movement to the left.
		 *
		 * @type {Boolean}
		 */

		this.left = false;

		/**
		 * Movement to the right.
		 *
		 * @type {Boolean}
		 */

		this.right = false;

		/**
		 * Forward motion.
		 *
		 * @type {Boolean}
		 */

		this.forward = false;

		/**
		 * Backward motion.
		 *
		 * @type {Boolean}
		 */

		this.backward = false;

		/**
		 * Ascension.
		 *
		 * @type {Boolean}
		 */

		this.up = false;

		/**
		 * Descent.
		 *
		 * @type {Boolean}
		 */

		this.down = false;

		/**
		 * Movement speed boost.
		 *
		 * @type {Boolean}
		 */

		this.boost = false;

	}

	/**
	 * Resets this state.
	 */

	reset() {

		this.left = false;
		this.right = false;
		this.forward = false;
		this.backward = false;

		this.up = false;
		this.down = false;
		this.boost = false;

	}

}
