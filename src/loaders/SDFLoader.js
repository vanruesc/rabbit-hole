import { EventDispatcher } from "three";
import * as events from "./sdf-loader-events";

/**
 * An SDF loader.
 *
 * @implements {EventListener}
 */

export class SDFLoader extends EventDispatcher {

	constructor() {

		super();

		/**
		 * Indicates how many items still need to be loaded.
		 *
		 * @type {Number}
		 * @private
		 */

		this.items = 0;

		/**
		 * A list of serialised SDFs.
		 *
		 * @type {Array}
		 * @private
		 */

		this.descriptions = null;

		/**
		 * A collection that maps images to their respective serialised SDFs.
		 *
		 * @type {WeakMap}
		 * @private
		 */

		this.imageMap = new WeakMap();

	}

	/**
	 * Clears this loader.
	 */

	clear() {

		this.imageMap = new WeakMap();

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
		const imageMap = this.imageMap;

		let description;

		if(item !== null) {

			if(imageMap.has(item)) {

				description = imageMap.get(item);
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

		this.imageMap.set(image, description);
		++this.items;

		image.addEventListener("load", this);
		image.src = description.dataURL;

	}

	/**
	 * Inflates the given serialised SDF.
	 *
	 * @private
	 * @param {Object} description - A serialised SDF.
	 */

	inflate(description) {

		let child;

		if(description.dataURL !== null) {

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
