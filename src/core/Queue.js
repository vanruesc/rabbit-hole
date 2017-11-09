/**
 * A FIFO queue.
 *
 * Elements are added to the end of the queue and removed from the front.
 *
 * Based on:
 *  http://code.stephenmorley.org/javascript/queues/
 */

export class Queue {

	/**
	 * Constructs a new queue.
	 */

	constructor() {

		/**
		 * A list of elements.
		 *
		 * @type {Object[]}
		 * @private
		 */

		this.elements = [];

		/**
		 * The head of the queue.
		 *
		 * @type {Number}
		 * @private
		 */

		this.head = 0;

	}

	/**
	 * The current size of the queue.
	 *
	 * @type {Number}
	 */

	get size() {

		return (this.elements.length - this.head);

	}

	/**
	 * Returns true if the queue is empty, and false otherwise.
	 *
	 * @type {Boolean}
	 */

	get empty() {

		return (this.elements.length === 0);

	}

	/**
	 * Adds an element to the queue.
	 *
	 * @param {Object} element - An arbitrary object.
	 */

	add(element) {

		this.elements.push(element);

	}

	/**
	 * Retrieves, but does not remove, the head of the queue.
	 *
	 * @return {Object} The head of the queue, or undefined if the queue is empty.
	 */

	peek() {

		return (this.elements.length > 0) ? this.elements[this.head] : undefined;

	}

	/**
	 * Retrieves and removes the head of the queue.
	 *
	 * @return {Object} The head of the queue, or undefined if the queue is empty.
	 */

	poll() {

		const elements = this.elements;
		const length = elements.length;

		let element;

		if(length > 0) {

			element = elements[this.head++];

			// Remove free space if necessary.
			if(this.head * 2 >= length) {

				this.elements = elements.slice(this.head);
				this.head = 0;

			}

		}

		return element;

	}

	/**
	 * Resets this queue.
	 */

	clear() {

		this.elements = [];
		this.head = 0;

	}

}
