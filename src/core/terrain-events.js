import { TerrainEvent } from "../events/TerrainEvent.js";

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

/**
 * Signals the end of a volume data loading process.
 *
 * This event is dispatched by {@link Terrain}.
 *
 * @type {TerrainEvent}
 * @example terrain.addEventListener("load", myListener);
 */

export const load = new TerrainEvent("load");

/**
 * Signals the occurrence of an unexpected error.
 *
 * This event is dispatched by {@link Terrain}.
 *
 * @type {TerrainEvent}
 * @example terrain.addEventListener("error", myListener);
 */

export const error = new TerrainEvent("error");
