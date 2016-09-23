import { Queue } from "./queue.js";

/**
 * A queue that maintains elements in a hierarchy. Elements with a high priority
 * will be served before elements with a lower priority.
 *
 * Elements are kept in sets to avoid duplicates.
 *
 * @class PriorityQueue
 * @submodule core
 * @constructor
 * @param {Number} [tiers=1] - The number of priority tiers. The lowest tier represents the lowest priority.
 */

export class PriorityQueue extends Queue {

	constructor(tiers = 1) {

		super();

		while(tiers-- > 0) {

			this.elements.push(new Set());

		}

	}

	/**
	 * Adds an element.
	 *
	 * @method add
	 * @chainable
	 * @param {Object} element - The element.
	 * @param {Number} [priority=0] - The priority of the element.
	 * @return {PriorityQueue} This queue.
	 */

	add(element, priority = 0) {

		if(!this.elements[priority].has(element)) {

			this.elements[priority].add(element);

			if(priority > this.head) { this.head = priority; }

			++this.size;

		}

		return this;

	}

	/**
	 * Deletes an element.
	 *
	 * @method remove
	 * @param {Object} element - The element.
	 * @param {Number} [priority=0] - The priority of the element.
	 * @return {Boolean} Whether the element was in the queue.
	 */

	remove(element, priority = 0) {

		const existed = this.elements[priority].delete(element);

		if(existed) {

			--this.size;

			while(this.head > 0 && this.elements[this.head].size === 0) {

				--this.head;

			}

		}

		return existed;

	}

	/**
	 * Retrieves, but does not remove, the head of the queue, or returns null if
	 * the queue is empty.
	 *
	 * @method peek
	 * @return {Object} The head of the queue.
	 */

	peek() {

		let element = null;

		if(this.size > 0) {

			element = this.elements[this.head].values().next();

		}

		return element;

	}

	/**
	 * Retrieves the head of the queue, or returns null if the queue is empty.
	 *
	 * @method poll
	 * @return {Object} The head of the queue.
	 */

	poll() {

		let element = null;

		if(this.size > 0) {

			element = this.elements[this.head].values().next();
			this.remove(element, this.head);

		}

		return element;

	}

	/**
	 * Clears this queue.
	 *
	 * @method clear
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
