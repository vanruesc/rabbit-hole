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
	 * @return {Number} The index of the added element.
	 */

	add(element) {

		const index = this.elements.length;

		this.elements.push(element);

		++this.size;

		return index;

	}

	/**
	 * Removes an element from the queue.
	 *
	 * @method remove
	 * @param {Number} index - The index of the element.
	 * @return {Object} The removed element or null if there was none.
	 */

	remove(index) {

		const elements = this.elements;
		const length = elements.length;

		let element = null;

		if(this.size > 0 && index >= 0 && index < length) {

			element = elements[index];

			if(element !== null) {

				elements[index] = null;

				--this.size;

				if(this.size > 0) {

					while(this.head < length && elements[this.head] === null) {

						++this.head;

					}

					if(this.head === length) {

						this.clear();

					}

				} else {

					this.clear();

				}

			}

		}

		return element;

	}

	/**
	 * Retrieves, but does not remove, the head of the queue, or returns null if
	 * the queue is empty.
	 *
	 * @method peek
	 * @return {Object} The head of the queue.
	 */

	peek() {

		return (this.size > 0) ? this.elements[this.head] : null;

	}

	/**
	 * Retrieves and removes the head of the queue, or returns null if the queue
	 * is empty.
	 *
	 * @method poll
	 * @return {Object} The head of the queue.
	 */

	poll() {

		const elements = this.elements;
		const length = elements.length;

		let element = null;

		if(this.size > 0) {

			element = elements[this.head++];

			while(this.head < length && elements[this.head] === null) {

				++this.head;

			}

			if(this.head === length) {

				this.clear();

			} else {

				--this.size;

			}

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
