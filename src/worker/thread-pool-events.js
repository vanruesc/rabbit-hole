import { WorkerEvent } from "../events/worker-event.js";

/**
 * @submodule worker
 */

/**
 * A worker message event.
 *
 * @event message
 * @for ThreadPool
 * @type WorkerEvent
 */

export const MESSAGE = new WorkerEvent("message");
