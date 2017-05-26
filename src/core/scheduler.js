import { PriorityQueue } from "./priority-queue.js";

/**
 * A task scheduler.
 */

export class Scheduler extends PriorityQueue {

	/**
	 * Constructs a new task.
	 *
	 * @param {Number} tiers - The number of priority tiers.
	 */

	constructor(tiers) {

		super(tiers);

		/**
		 * Keeps track of associations between elements and tasks.
		 *
		 * @type {WeakMap}
		 * @private
		 */

		this.registry = new WeakMap();

		/**
		 * The highest priority.
		 *
		 * @type {Number}
		 */

		this.maxPriority = this.tiers - 1;

	}

	/**
	 * Cancels the task that is currently scheduled for the given element.
	 *
	 * @param {Object} element - The element.
	 * @return {Boolean} Whether the cancellation succeeded.
	 */

	cancel(element) {

		const result = this.registry.has(element);

		let task;

		if(result) {

			task = this.registry.get(element);

			this.remove(task.index, task.priority);
			this.registry.delete(element);

		}

		return result;

	}

	/**
	 * Schedules a task for the given element. Other tasks that are scheduled for
	 * that element will be cancelled.
	 *
	 * @param {Object} element - The element.
	 * @param {Task} task - The task.
	 * @return {Boolean} Whether the task was scheduled.
	 */

	schedule(element, task) {

		const result = !this.registry.has(element);

		if(result) {

			if(task !== null) {

				this.remove(task.index, task.priority);
				this.registry.delete(element);

			}

			task.index = this.add(task, task.priority);
			this.registry.set(element, task);

		}

		return result;

	}

	/**
	 * Checks if a task is scheduled for the given element.
	 *
	 * @param {Object} element - The element.
	 * @return {Boolean} Whether a task is currently scheduled.
	 */

	hasTask(element) {

		return this.registry.has(element);

	}

	/**
	 * Retrieves the task for the given element.
	 *
	 * @param {Object} element - The element.
	 * @return {Task} The task or undefined if there is none.
	 */

	getTask(element) {

		return this.registry.get(element);

	}

	/**
	 * Retrieves the head of the queue, or returns null if the queue is empty.
	 *
	 * @return {Task} The task with the highest priority or null if there is none.
	 */

	poll() {

		const element = super.poll();

		if(element !== null) {

			this.registry.delete(element.chunk);

		}

		return element;

	}

	/**
	 * Removes all tasks.
	 */

	clear() {

		super.clear();

		this.registry = new WeakMap();

	}

}
