import { SDFLoaderEvent } from "../events/SDFLoaderEvent.js";

/**
 * A load event.
 *
 * This event is dispatched by {@link SDFLoader}.
 *
 * @type {SDFLoaderEvent}
 * @example sdfLoader.addEventListener("load", myListener);
 */

export const load = new SDFLoaderEvent("load");
