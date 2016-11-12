import { TerrainEvent } from "../events/terrain-event.js";

/**
 * @submodule core
 */

/**
 * Signals the start of a modification task.
 *
 * @event MODIFICATION_START
 * @for Terrain
 * @type TerrainEvent
 */

export const MODIFICATION_START = new TerrainEvent("modificationstart");

/**
 * Signals the end of a modification task.
 *
 * @event MODIFICATION_END
 * @for Terrain
 * @type TerrainEvent
 */

export const MODIFICATION_END = new TerrainEvent("modificationend");

/**
 * Signals the start of an extraction task.
 *
 * @event EXTRACTION_START
 * @for Terrain
 * @type TerrainEvent
 */

export const EXTRACTION_START = new TerrainEvent("extractionstart");

/**
 * Signals the end of an extraction task.
 *
 * @event EXTRACTION_END
 * @for Terrain
 * @type TerrainEvent
 */

export const EXTRACTION_END = new TerrainEvent("extractionend");
