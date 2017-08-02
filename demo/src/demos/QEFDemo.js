import { Demo } from "./Demo.js";

/**
 * A QEF demo setup.
 */

export class QEFDemo extends Demo {

	/**
	 * Constructs a new QEF demo.
	 *
	 * @param {WebGLRenderer} renderer - A renderer.
	 */

	constructor(renderer) {

		super(renderer);

	}

	/**
	 * Creates the scene.
	 */

	initialise() {}

	/**
	 * Renders this demo.
	 *
	 * @param {Number} delta - The time since the last frame in seconds.
	 */

	render(delta) {

		this.renderer.render(this.scene, this.camera);

	}

	/**
	 * Registers configuration options.
	 *
	 * @param {GUI} gui - A GUI.
	 */

	configure(gui) {}

}
