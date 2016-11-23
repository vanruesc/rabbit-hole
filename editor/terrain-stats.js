import Stats from "stats.js";

/**
 * A terrain stats monitor.
 *
 * @class TerrainStats
 * @extends Stats
 * @constructor
 * @param {Terrain} terrain - A terrain instance.
 */

export class TerrainStats extends Stats {

	constructor(terrain) {

		super();

		this.dom.id = "stats";

		/**
		 * Additional panels.
		 *
		 * @property panels
		 * @type Map
		 * @private
		 */

		const panels = {
			modificationend: this.addPanel(new Stats.Panel("CSG", "#ff8", "#221")),
			extractionend: this.addPanel(new Stats.Panel("DC", "#f8f", "#212"))
		};

		this.showPanel(3);

		/**
		 * Measured execution delta times.
		 *
		 * @property deltas
		 * @type Map
		 * @private
		 */

		const deltas = new Map();

		/**
		 * Measured delta time maxima.
		 *
		 * @property maxDeltas
		 * @type Map
		 * @private
		 */

		const maxDeltas = {
			modificationend: 0.0,
			extractionend: 0.0
		};

		/**
		 * Handles modification and extraction events.
		 *
		 * @method onStart
		 * @private
		 * @param {Event} event - An event.
		 */

		this.onStart = function(event) {

			deltas.set(event.chunk, performance.now());

		};

		/**
		 * Handles modification and extraction events.
		 *
		 * @method onEnd
		 * @private
		 * @param {Event} event - An event.
		 */

		this.onEnd = function(event) {

			const delta = performance.now() - deltas.get(event.chunk);
			const maxDelta = maxDeltas[event.type];

			panels[event.type].update(delta, maxDelta);

			deltas.delete(event.chunk);

			if(delta > maxDelta) {

				maxDeltas[event.type] = delta;

			}

		};

		/**
		 * The terrain.
		 *
		 * @property terrain
		 * @type Terrain
		 * @private
		 */

		this.terrain = terrain;

		terrain.addEventListener("modificationstart", this.onStart);
		terrain.addEventListener("extractionstart", this.onStart);
		terrain.addEventListener("modificationend", this.onEnd);
		terrain.addEventListener("extractionend", this.onEnd);

	}

	/**
	 * Destroys this stats monitor.
	 *
	 * @method dispose
	 */

	dispose() {

		const terrain = this.terrain;

		terrain.removeEventListener("modificationstart", this.onStart);
		terrain.removeEventListener("extractionstart", this.onStart);
		terrain.removeEventListener("modificationend", this.onEnd);
		terrain.removeEventListener("extractionend", this.onEnd);

	}

}
