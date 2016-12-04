import Stats from "stats.js";

/**
 * A terrain stats monitor.
 *
 * @class TerrainStats
 * @implements EventListener
 * @constructor
 * @param {Terrain} terrain - A terrain instance.
 */

export class TerrainStats {

	constructor(terrain) {

		/**
		 * A stats monitor.
		 *
		 * @property stats
		 * @type Stats
		 */

		this.stats = new Stats();

		/**
		 * The terrain.
		 *
		 * @property terrain
		 * @type Terrain
		 * @private
		 */

		this.terrain = terrain;

		/**
		 * A panel for volume modifications.
		 *
		 * @property modificationPanel
		 * @type Panel
		 * @private
		 */

		this.modificationPanel = this.stats.addPanel(new Stats.Panel("CSG", "#ff8", "#221"));

		/**
		 * A panel for surface extractions.
		 *
		 * @property extractionPanel
		 * @type Panel
		 * @private
		 */

		this.extractionPanel = this.stats.addPanel(new Stats.Panel("DC", "#f8f", "#212"));

		/**
		 * Measured delta times.
		 *
		 * @property deltas
		 * @type Map
		 * @private
		 */

		this.deltas = new Map();

		/**
		 * Measured delta time maxima.
		 *
		 * @property maxDeltas
		 * @type Map
		 * @private
		 */

		this.maxDeltas = new Map();

		this.setEnabled(true);

	}

	/**
	 * Handles terrain events.
	 *
	 * @method handleEvent
	 * @param {TerrainEvent} event - A terrain event.
	 */

	handleEvent(event) {

		switch(event.type) {

			case "extractionstart":
			case "modificationstart":
				this.deltas.set(event.chunk, performance.now());
				break;

			case "modificationend":
				this.measureTime(event, this.modificationPanel);
				break;

			case "extractionend":
				this.measureTime(event, this.extractionPanel);
				break;

		}

	}

	/**
	 * Measures execution time.
	 *
	 * @method measureTime
	 * @private
	 * @param {TerrainEvent} event - A terrain event.
	 * @param {Panel} panel - The panel to update.
	 */

	measureTime(event, panel) {

		const maxDeltas = this.maxDeltas;
		const deltas = this.deltas;

		const delta = performance.now() - deltas.get(event.chunk);
		const maxDelta = maxDeltas.has(event.type) ? maxDeltas.get(event.type) : 0.0;

		if(delta > maxDelta) {

			maxDeltas.set(event.type, delta);

		}

		panel.update(delta, maxDelta);
		deltas.delete(event.chunk);

	}

	/**
	 * Enables or disables this stats monitor.
	 *
	 * @method setEnabled
	 * @param {Boolean} enabled - Whether this monitor should be enabled or disabled.
	 */

	setEnabled(enabled) {

		const terrain = this.terrain;

		if(enabled) {

			terrain.addEventListener("modificationstart", this);
			terrain.addEventListener("extractionstart", this);
			terrain.addEventListener("modificationend", this);
			terrain.addEventListener("extractionend", this);

		} else {

			terrain.removeEventListener("modificationstart", this);
			terrain.removeEventListener("extractionstart", this);
			terrain.removeEventListener("modificationend", this);
			terrain.removeEventListener("extractionend", this);

		}

	}

	/**
	 * Removes all event listeners.
	 *
	 * @method dispose
	 */

	dispose() { this.setEnabled(false); }

}
