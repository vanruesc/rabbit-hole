import { ClipmapEvent } from "../events/ClipmapEvent.js";

/**
 * Signals the end of a clipmap update for a single LOD shell.
 *
 * This event is dispatched by {@link Clipmap}.
 *
 * @type {ClipmapEvent}
 * @example terrain.addEventListener("update", myListener);
 */

export const update = new ClipmapEvent("update");

/**
 * Signals the occurrence of an unexpected error.
 *
 * This event is dispatched by {@link Clipmap}.
 *
 * @type {ClipmapEvent}
 * @example terrain.addEventListener("error", myListener);
 */

export const error = new ClipmapEvent("error");
