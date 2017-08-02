import { Queue } from "./Queue.js";

/**
 * A queue that maintains elements in a hierarchy. Elements with a high priority
 * will be served before elements with a lower priority.
 */

export class PriorityQueue extends Queue {

	/**
	 * Constructs a new priority queue.
	 *
	 * @param {Number} [tiers=1] - The number of priority tiers. The lowest tier represents the lowest priority.
	 */

	constructor(tiers = 1) {

		super();

		tiers = Math.max(1, tiers);

		while(tiers-- > 0) {

			this.elements.push(new Queue());

		}

	}

	/**
	 * The amount of priority tiers.
	 *
	 * @type {Number}
	 */

	get tiers() { return this.elements.length; }

	/**
	 * Adds an element.
	 *
	 * @param {Object} element - The element.
	 * @param {Number} [priority] - The priority of the element.
	 * @return {Number} The index of the added element.
	 */

	add(element, priority) {

		let index = -1;

		if(priority >= 0 && priority < this.elements.length) {

			index = this.elements[priority].add(element);

			if(priority > this.head) {

				this.head = priority;

			}

			++this.size;

		}

		return index;

	}

	/**
	 * Deletes an element.
	 *
	 * @param {Object} index - The index of the element.
	 * @param {Number} [priority] - The priority of the element.
	 * @return {Object} The removed element or null if there was none.
	 */

	remove(index, priority) {

		let element = null;

		if(priority >= 0 && priority < this.elements.length) {

			element = this.elements[priority].remove(index);

			if(element !== null) {

				--this.size;

				while(this.head > 0 && this.elements[this.head].size === 0) {

					--this.head;

				}

			}

		}

		return element;

	}

	/**
	 * Retrieves, but does not remove, the head of the queue, or returns null if
	 * the queue is empty.
	 *
	 * @return {Object} The head of the queue.
	 */

	peek() {

		return (this.size > 0) ? this.elements[this.head].peek() : null;

	}

	/**
	 * Retrieves the head of the queue, or returns null if the queue is empty.
	 *
	 * @return {Object} The head of the queue.
	 */

	poll() {

		let element = null;

		if(this.size > 0) {

			element = this.elements[this.head].poll();

			--this.size;

			while(this.head > 0 && this.elements[this.head].size === 0) {

				--this.head;

			}

		}

		return element;

	}

	/**
	 * Clears this queue.
	 */

	clear() {

		let i;

		for(i = this.elements.length - 1; i >= 0; --i) {

			this.elements[i].clear();

		}

		this.head = 0;
		this.size = 0;

	}

}
