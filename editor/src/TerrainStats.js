import Stats from "stats.js";

/**
 * A terrain stats monitor.
 *
 * @implements {EventListener}
 */

export class TerrainStats {

	/**
	 * Constructs a new stats monitor.
	 *
	 * @param {Terrain} terrain - A terrain instance.
	 */

	constructor(terrain) {

		/**
		 * A stats monitor.
		 *
		 * @type {Stats}
		 */

		this.stats = new Stats();

		/**
		 * The terrain.
		 *
		 * @type {Terrain}
		 * @private
		 */

		this.terrain = terrain;

		/**
		 * A panel for volume modifications.
		 *
		 * @type {Panel}
		 * @private
		 */

		this.modificationPanel = this.stats.addPanel(new Stats.Panel("CSG", "#ff8", "#221"));

		/**
		 * A panel for surface extractions.
		 *
		 * @type {Panel}
		 * @private
		 */

		this.extractionPanel = this.stats.addPanel(new Stats.Panel("DC", "#f8f", "#212"));

		/**
		 * Measured delta times.
		 *
		 * @type {Map}
		 * @private
		 */

		this.deltas = {
			modificationend: [],
			extractionend: []
		};

		/**
		 * Event start timestamps.
		 *
		 * @type {Map}
		 * @private
		 */

		this.timestamps = new Map();

		/**
		 * Measured delta time maxima.
		 *
		 * @type {Map}
		 * @private
		 */

		this.maxDeltas = new Map();

		this.setEnabled(true);

	}

	/**
	 * Handles terrain events.
	 *
	 * @param {TerrainEvent} event - A terrain event.
	 */

	handleEvent(event) {

		switch(event.type) {

			case "extractionstart":
			case "modificationstart":
				this.timestamps.set(event.chunk, performance.now());
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
	 * @private
	 * @param {TerrainEvent} event - A terrain event.
	 * @param {Panel} panel - The panel to update.
	 */

	measureTime(event, panel) {

		const maxDeltas = this.maxDeltas;
		const timestamps = this.timestamps;

		const delta = performance.now() - timestamps.get(event.chunk);
		const maxDelta = maxDeltas.has(event.type) ? maxDeltas.get(event.type) : 0.0;

		if(delta > maxDelta) {

			maxDeltas.set(event.type, delta);

		}

		this.deltas[event.type].push(delta);

		panel.update(delta, maxDelta);
		timestamps.delete(event.chunk);

	}

	/**
	 * Enables or disables this stats monitor.
	 *
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
	 */

	dispose() {

		this.setEnabled(false);

	}

	/**
	 * Logs delta times.
	 *
	 * @private
	 */

	log() {

		const deltas = this.deltas;
		const a = document.createElement("a");

		let text = "";
		let i, l;

		text += "Modifications\n\n";

		for(i = 0, l = deltas.modificationend.length; i < l; ++i) {

			text += i + ", " + deltas.modificationend[i] + "\n";

		}

		text += "\n\n";
		text += "Extractions\n\n";

		for(i = 0, l = deltas.extractionend.length; i < l; ++i) {

			text += i + ", " + deltas.extractionend[i] + "\n";

		}

		a.href = URL.createObjectURL(new Blob([text], {
			type: "text/plain"
		}));

		a.download = "stats.txt";
		a.click();

	}

	/**
	 * Registers configuration options.
	 *
	 * @param {GUI} gui - A GUI.
	 */

	configure(gui) {

		const folder = gui.addFolder("Stats");

		folder.add(this, "log");

	}

}
