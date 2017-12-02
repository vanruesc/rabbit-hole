import { EventTarget } from "synthetic-event";
import * as events from "./sdf-loader-events.js";

/**
 * An SDF loader.
 *
 * @implements {EventListener}
 */

export class SDFLoader extends EventTarget {

	constructor() {

		super();

		/**
		 * Indicates how many items still need to be loaded.
		 *
		 * @type {Number}
		 * @private
		 * @default 0
		 */

		this.items = 0;

		/**
		 * A list of serialised SDFs.
		 *
		 * @type {Array}
		 * @private
		 * @default null
		 */

		this.descriptions = null;

		/**
		 * A collection of images that need to be loaded.
		 *
		 * @type {WeakMap}
		 * @private
		 */

		this.images = new WeakMap();

	}

	/**
	 * Clears this loader.
	 */

	clear() {

		this.images = new WeakMap();

	}

	/**
	 * Handles events.
	 *
	 * @param {Event} event - An event.
	 */

	handleEvent(event) {

		switch(event.type) {

			case "load":
				this.progress(event);
				break;

		}

	}

	/**
	 * Finishes a loading task.
	 *
	 * @param {Event} [event=null] - An event.
	 */

	progress(event = null) {

		const item = (event !== null) ? event.target : null;
		const images = this.images;

		let description;

		if(item !== null) {

			if(images.has(item)) {

				description = images.get(item);
				description.image = item;

			}

			--this.items;

		}

		if(this.items === 0) {

			this.clear();
			events.load.descriptions = this.descriptions;
			this.dispatchEvent(events.load);

		}

	}

	/**
	 * Loads an image data url for a given serialised SDF.
	 *
	 * @param {Object} description - A serialised SDF that contains an image data url.
	 */

	loadImage(description) {

		const image = new Image();

		this.items.set(image, description);
		++this.items;

		image.addEventListener("load", this);
		image.src = description.dataUrl;

	}

	/**
	 * Inflates the given serialised SDF.
	 *
	 * @private
	 * @param {Object} description - A serialised SDF.
	 */

	inflate(description) {

		let child;

		if(description.dataUrl !== null) {

			// The description contains compressed image data.
			this.loadImage(description);

		}

		for(child of description.children) {

			this.inflate(child);

		}

		this.progress();

	}

	/**
	 * Loads the given serialised SDFs but doesn't fully revive them.
	 *
	 * This loader will emit a `load` event when all SDFs have been inflated. The
	 * descriptions can then safely be revived using the {@link SDFReviver}.
	 *
	 * @param {Array} descriptions - A list of serialised SDF. The individual descriptions will be inflated.
	 */

	load(descriptions) {

		let description;

		this.items = 0;
		this.descriptions = descriptions;

		for(description of descriptions) {

			this.inflate(description);

		}

	}

}
