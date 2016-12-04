import { EventTarget } from "../events/event-target.js";
import { WorkerEvent } from "../events/worker-event.js";
import { Action } from "./action.js";
import worker from "./worker.tmp";

/**
 * A worker message event.
 *
 * @event message
 * @type WorkerEvent
 */

const MESSAGE = new WorkerEvent("message");

/**
 * Manages worker threads.
 *
 * @class ThreadPool
 * @submodule worker
 * @extends EventTarget
 * @implements EventListener
 * @constructor
 * @param {Number} [maxWorkers] - Limits the amount of active workers. The default limit is the amount of logical processors.
 */

export class ThreadPool extends EventTarget {

	constructor(maxWorkers = navigator.hardwareConcurrency) {

		super();

		/**
		 * An object URL to the worker program.
		 *
		 * @property workerURL
		 * @type String
		 * @private
		 */

		this.workerURL = URL.createObjectURL(new Blob([worker], { type: "text/javascript" }));

		/**
		 * The maximum number of active worker threads.
		 *
		 * @property maxWorkers
		 * @type Number
		 * @default navigator.hardwareConcurrency
		 */

		this.maxWorkers = Math.min(navigator.hardwareConcurrency, Math.max(maxWorkers, 1));

		/**
		 * A list of existing workers.
		 *
		 * @property workers
		 * @type Array
		 * @private
		 */

		this.workers = [];

		/**
		 * Keeps track of workers that are currently busy.
		 *
		 * @property busyWorkers
		 * @type WeakSet
		 * @private
		 */

		this.busyWorkers = new WeakSet();

	}

	/**
	 * Handles events.
	 *
	 * @method handleEvent
	 * @param {Event} event - An event.
	 */

	handleEvent(event) {

		switch(event.type) {

			case "message":
				this.busyWorkers.delete(event.target);
				MESSAGE.worker = event.target;
				MESSAGE.data = event.data;
				this.dispatchEvent(MESSAGE);
				break;

			case "error":
				// Errors are being handled in the worker.
				console.warn("Encountered an unexpected error.", event.message);
				break;

		}

	}

	/**
	 * Closes a worker.
	 *
	 * @method closeWorker
	 * @param {Worker} worker - The worker to close.
	 */

	closeWorker(worker) {

		const index = this.workers.indexOf(worker);

		if(this.busyWorkers.has(worker)) {

			this.busyWorkers.delete(worker);
			worker.terminate();

		} else {

			worker.postMessage({
				action: Action.CLOSE
			});

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
	 * @method createWorker
	 * @private
	 * @return {Worker} The worker.
	 */

	createWorker() {

		const worker = new Worker(this.workerURL);

		this.workers.push(worker);

		worker.addEventListener("message", this);
		worker.addEventListener("error", this);

		return worker;

	}

	/**
	 * Polls an available worker and returns it. The worker will be excluded from
	 * subsequent polls until it finishes its task and sends a message back.
	 *
	 * @method getWorker
	 * @return {Worker} A worker or null if all resources are currently exhausted.
	 */

	getWorker() {

		let worker = null;

		let i;

		for(i = this.workers.length - 1; i >= 0; --i) {

			if(!this.busyWorkers.has(this.workers[i])) {

				worker = this.workers[i];
				this.busyWorkers.add(worker);

				break;

			}

		}

		// Check if all existing workers are busy.
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
	 *
	 * @method clear
	 */

	clear() {

		while(this.workers.length > 0) {

			this.closeWorker(this.workers.pop());

		}

	}

	/**
	 * Removes all active workers and releases the worker program blob.
	 *
	 * @method dispose
	 */

	dispose() {

		this.clear();

		URL.revokeObjectURL(this.workerURL);
		this.workerURL = null;

	}

}
