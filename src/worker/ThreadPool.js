import { EventTarget } from "synthetic-event";
import { ConfigurationMessage, Message } from "./messages";
import { Action } from "./Action.js";
import * as events from "./thread-pool-events.js";

import worker from "./worker.tmp";

/**
 * Manages worker threads.
 *
 * @implements {Disposable}
 * @implements {EventListener}
 */

export class ThreadPool extends EventTarget {

	/**
	 * Constructs a new thread pool.
	 *
	 * @param {Number} [maxWorkers=navigator.hardwareConcurrency] - Limits the amount of active workers. The default limit is the amount of logical processors.
	 */

	constructor(maxWorkers = navigator.hardwareConcurrency) {

		super();

		/**
		 * An object URL that points to the worker program.
		 *
		 * @type {String}
		 * @private
		 */

		this.workerURL = URL.createObjectURL(new Blob([worker], { type: "text/javascript" }));

		/**
		 * The maximum number of active worker threads.
		 *
		 * @type {Number}
		 */

		this.maxWorkers = Math.min(navigator.hardwareConcurrency, Math.max(maxWorkers, 1));

		/**
		 * A list of existing workers.
		 *
		 * @type {Worker[]}
		 * @private
		 */

		this.workers = [];

		/**
		 * Keeps track of workers that are currently busy.
		 *
		 * @type {WeakSet}
		 * @private
		 */

		this.busyWorkers = new WeakSet();

		/**
		 * A configuration message.
		 *
		 * This object will be sent to each newly created worker.
		 *
		 * @type {ConfigurationMessage}
		 */

		this.configurationMessage = new ConfigurationMessage();

	}

	/**
	 * Handles events.
	 *
	 * @param {Event} event - An event.
	 */

	handleEvent(event) {

		switch(event.type) {

			case "message": {

				this.busyWorkers.delete(event.target);

				events.message.worker = event.target;
				events.message.response = event.data;

				this.dispatchEvent(events.message);

				if(this.workers.length > this.maxWorkers) {

					this.closeWorker(event.target);

				}

				break;

			}

			case "error": {

				// Errors are being handled in the worker.
				console.error("Encountered an unexpected error", event);
				break;

			}

		}

	}

	/**
	 * Closes a worker.
	 *
	 * @param {Worker} worker - The worker to close.
	 */

	closeWorker(worker) {

		const index = this.workers.indexOf(worker);

		if(this.busyWorkers.has(worker)) {

			this.busyWorkers.delete(worker);
			worker.terminate();

		} else {

			worker.postMessage(new Message(Action.CLOSE));

		}

		worker.removeEventListener("message", this);
		worker.removeEventListener("error", this);

		if(index >= 0) {

			this.workers.splice(index, 1);

		}

	}

	/**
	 * Creates a new worker.
	 *
	 * @private
	 * @return {Worker} The worker.
	 */

	createWorker() {

		const worker = new Worker(this.workerURL);

		this.workers.push(worker);

		worker.addEventListener("message", this);
		worker.addEventListener("error", this);

		worker.postMessage(this.configurationMessage);

		return worker;

	}

	/**
	 * Polls an available worker and returns it. The worker will be excluded from
	 * subsequent polls until it finishes its task and sends a message back.
	 *
	 * @return {Worker} A worker or null if all resources are currently exhausted.
	 */

	getWorker() {

		let worker = null;

		let i, l;

		// Check if an existing worker is available.
		for(i = 0, l = this.workers.length; i < l; ++i) {

			if(!this.busyWorkers.has(this.workers[i])) {

				worker = this.workers[i];
				this.busyWorkers.add(worker);

				break;

			}

		}

		// Try to create a new worker if all existing ones are busy.
		if(worker === null && this.workers.length < this.maxWorkers) {

			if(this.workerURL !== null) {

				worker = this.createWorker();
				this.busyWorkers.add(worker);

			}

		}

		return worker;

	}

	/**
	 * Resets this thread pool by closing all workers.
	 */

	clear() {

		while(this.workers.length > 0) {

			this.closeWorker(this.workers.pop());

		}

	}

	/**
	 * Removes all active workers and releases the worker program blob.
	 */

	dispose() {

		this.clear();

		URL.revokeObjectURL(this.workerURL);

		this.workerURL = null;

	}

}
