import { Editor } from "./editor.js";

/**
 * The entry point of the volume editor.
 *
 * @class Main
 * @static
 */

/**
 * Starts the volume editor.
 *
 * @method main
 * @private
 * @static
 * @param {Event} event - An event.
 */

window.addEventListener("load", function main(event) {

	window.removeEventListener("load", main);

	Editor.initialise(
		document.getElementById("viewport"),
		document.getElementById("aside")
	);

});
