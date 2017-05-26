import { TerrainEvent } from "../events/terrain-event.js";

/**
 * Signals the start of a modification task.
 *
 * This event is dispatched by {@link Terrain}.
 *
 * @type {TerrainEvent}
 * @example terrain.addEventListener("modificationstart", myListener);
 */

export const modificationstart = new TerrainEvent("modificationstart");

/**
 * Signals the end of a modification task.
 *
 * This event is dispatched by {@link Terrain}.
 *
 * @type {TerrainEvent}
 * @example terrain.addEventListener("modificationend", myListener);
 */

export const modificationend = new TerrainEvent("modificationend");

/**
 * Signals the start of an extraction task.
 *
 * This event is dispatched by {@link Terrain}.
 *
 * @type {TerrainEvent}
 * @example terrain.addEventListener("extractionstart", myListener);
 */

export const extractionstart = new TerrainEvent("extractionstart");

/**
 * Signals the end of an extraction task.
 *
 * This event is dispatched by {@link Terrain}.
 *
 * @type {TerrainEvent}
 * @example terrain.addEventListener("extractionend", myListener);
 */

export const extractionend = new TerrainEvent("extractionend");
