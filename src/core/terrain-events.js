import { TerrainEvent } from "../events/terrain-event.js";

/**
 * @submodule core
 */

/**
 * Signals the start of a modification task.
 *
 * @event modificationstart
 * @for Terrain
 * @type TerrainEvent
 */

export const MODIFICATION_START = new TerrainEvent("modificationstart");

/**
 * Signals the end of a modification task.
 *
 * @event modificationend
 * @for Terrain
 * @type TerrainEvent
 */

export const MODIFICATION_END = new TerrainEvent("modificationend");

/**
 * Signals the start of an extraction task.
 *
 * @event extractionstart
 * @for Terrain
 * @type TerrainEvent
 */

export const EXTRACTION_START = new TerrainEvent("extractionstart");

/**
 * Signals the end of an extraction task.
 *
 * @event extractionend
 * @for Terrain
 * @type TerrainEvent
 */

export const EXTRACTION_END = new TerrainEvent("extractionend");
