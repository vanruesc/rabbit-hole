/**
 * A basic object queue.
 *
 * @class Queue
 * @submodule core
 * @constructor
 */

export class Queue {

	constructor() {

		/**
		 * A list of elements.
		 *
		 * @property elements
		 * @type Array
		 * @private
		 */

		this.elements = [];

		/**
		 * The head of the queue.
		 *
		 * @property head
		 * @type Number
		 * @private
		 */

		this.head = 0;

		/**
		 * The current size of the queue.
		 *
		 * @property size
		 * @type Number
		 */

		this.size = 0;

	}

	/**
	 * Adds an element to the queue.
	 *
	 * @method add
	 * @param {Object} element - An arbitrary object.
	 */

	add(element) {

		this.elements.push(element);

		++this.size;

	}

	/**
	 * Retrieves, but does not remove, the head of the queue, or returns null if
	 * the queue is empty.
	 *
	 * @method peek
	 * @return {Object} The head of the queue.
	 */

	peek() {

		return (this.head < this.elements.length) ? this.elements[this.head] : null;

	}

	/**
	 * Retrieves and removes the head of the queue, or returns null if the queue
	 * is empty.
	 *
	 * @method poll
	 * @return {Object} The head of the queue.
	 */

	poll() {

		const element = (this.head < this.elements.length) ? this.elements[this.head++] : null;

		if(this.head === this.elements.length) {

			this.clear();

		} else {

			--this.size;

		}

		return element;

	}

	/**
	 * Clears this queue.
	 *
	 * @method clear
	 */

	clear() {

		this.elements = [];
		this.head = 0;
		this.size = 0;

	}

}
