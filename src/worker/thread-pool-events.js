import { WorkerEvent } from "../events/worker-event.js";

/**
 * A worker message event.
 *
 * This event is dispatched by {@link ThreadPool}.
 *
 * @type {WorkerEvent}
 * @example threadPool.addEventListener("message", myListener);
 */

export const message = new WorkerEvent("message");
