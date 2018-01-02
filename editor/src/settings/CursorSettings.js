import { SuperPrimitivePreset } from "../../../src";

/**
 * Cursor settings.
 */

export class CursorSettings {

	/**
	 * Constructs new cursor settings.
	 */

	constructor() {

		/**
		 * The current shape of the cursor.
		 *
		 * @type {SuperPrimitivePreset}
		 */

		this.preset = SuperPrimitivePreset.SPHERE;

		/**
		 * The current cursor distance.
		 *
		 * @type {Number}
		 */

		this.distance = 10.0;

		/**
		 * The current cursor size.
		 *
		 * @type {Number}
		 */

		this.size = 1.0;

	}

	/**
	 * Copies the given general settings.
	 *
	 * @param {GeneralSettings} settings - General settings.
	 * @return {GeneralSettings} This instance.
	 */

	copy(settings) {

		this.orbit = settings.orbit;

		return this;

	}

	/**
	 * Clones this general settings instance.
	 *
	 * @return {GeneralSettings} The cloned general settings.
	 */

	clone() {

		return new this.constructor().copy(this);

	}

}
