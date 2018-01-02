import { KeyBindings, KeyCode } from "delta-controls";
import { Action } from "../Action.js";
import { CursorSettings } from "./CursorSettings.js";

/**
 * Control settings.
 */

export class Settings {

	/**
	 * Constructs new settings.
	 */

	constructor() {

		/**
		 * General settings.
		 *
		 * @type {CursorSettings}
		 */

		this.cursor = new CursorSettings();

		/**
		 * Key bindings.
		 *
		 * @type {KeyBindings}
		 */

		this.keyBindings = new KeyBindings();
		this.keyBindings.setDefault(new Map([

			[KeyCode.A, Action.NONE]

		]));

	}

	/**
	 * Copies the given settings.
	 *
	 * @param {Settings} settings - Settings.
	 * @return {Settings} This instance.
	 */

	copy(settings) {

		this.cursor.copy(settings.cursor);
		this.keyBindings.copy(settings.keyBindings);

		return this;

	}

	/**
	 * Clones these settings.
	 *
	 * @return {Settings} The cloned settings.
	 */

	clone() {

		return new this.constructor().copy(this);

	}

	/**
	 * Saves the current settings in the form of a JSON blob.
	 *
	 * @return {DOMString} A URL to the exported settings.
	 */

	toDataURL() {

		return URL.createObjectURL(new Blob([JSON.stringify(this)], { type: "text/json" }));

	}

}
