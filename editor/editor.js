import { Mesh, MeshBasicMaterial, Raycaster, SphereBufferGeometry, Vector2 } from "three";
import { ChunkHelper, Sphere } from "../src";
import { Button } from "./controls/button.js";
import { OctreeHelper } from "./octree-helper.js";

/**
 * A mouse position.
 *
 * @property MOUSE
 * @type Vector2
 * @private
 * @static
 * @final
 */

const MOUSE = new Vector2();

/**
 * A volume editor.
 *
 * @class Editor
 * @constructor
 * @param {Terrain} terrain - A terrain instance.
 * @param {Camera} camera - A camera.
 * @param {Element} [dom=document.body] - A dom element.
 */

export class Editor {

	constructor(terrain, camera, dom = document.body) {

		/**
		 * A terrain.
		 *
		 * @property terrain
		 * @type Terrain
		 * @private
		 */

		this.terrain = terrain;

		/**
		 * A camera.
		 *
		 * @property camera
		 * @type PerspectiveCamera
		 * @private
		 */

		this.camera = camera;

		/**
		 * A dom element.
		 *
		 * @property dom
		 * @type Element
		 * @private
		 */

		this.dom = dom;

		/**
		 * A raycaster.
		 *
		 * @property raycaster
		 * @type Raycaster
		 * @private
		 */

		this.raycaster = new Raycaster();

		/**
		 * A cursor.
		 *
		 * @property cursor
		 * @type Mesh
		 */

		this.cursor = new Mesh(
			new SphereBufferGeometry(2, 16, 16),
			new MeshBasicMaterial({
				transparent: true,
				opacity: 0.5,
				color: 0x0096ff,
				fog: false
			})
		);

		/**
		 * An octree helper.
		 *
		 * @property octreeHelper
		 * @type OctreeHelper
		 */

		this.octreeHelper = new OctreeHelper();
		this.octreeHelper.visible = false;

		/**
		 * An chunk helper.
		 *
		 * @property chunkHelper
		 * @type ChunkHelper
		 */

		this.chunkHelper = new ChunkHelper();
		this.chunkHelper.visible = false;

		/**
		 * A delta time.
		 *
		 * @property delta
		 * @type String
		 */

		this.delta = "";

		this.setEnabled(true);

		this.terrain.union(new Sphere({
			origin: [-16, 16, -16],
			radius: 14
		}));

	}

	/**
	 * Handles events.
	 *
	 * @method handleEvent
	 * @param {Event} event - An event.
	 */

	handleEvent(event) {

		switch(event.type) {

			case "mousemove":
				this.raycast(event);
				break;

			case "mousedown":
				this.handlePointerEvent(event, true);
				break;

			case "mouseup":
				this.handlePointerEvent(event, false);
				break;

			case "contextmenu":
				event.preventDefault();
				break;

		}

	}

	/**
	 * Handles pointer button events.
	 *
	 * @method handlePointerEvent
	 * @private
	 * @param {MouseEvent} event - A mouse event.
	 * @param {Boolean} pressed - Whether the mouse button has been pressed down.
	 */

	handlePointerEvent(event, pressed) {

		event.preventDefault();

		switch(event.button) {

			case Button.MAIN:
				this.handleMain(pressed);
				break;

			case Button.AUXILIARY:
				this.handleAuxiliary(pressed);
				break;

			case Button.SECONDARY:
				this.handleSecondary(pressed);
				break;

		}

	}

	/**
	 * Handles main pointer button events.
	 *
	 * @method handleMain
	 * @private
	 * @param {Boolean} pressed - Whether the mouse button has been pressed down.
	 */

	handleMain(pressed) {

		if(pressed) {

			this.terrain.union(new Sphere({
				origin: this.cursor.position.toArray(),
				radius: this.cursor.geometry.parameters.radius
			}));

		}

	}

	/**
	 * Handles auxiliary pointer button events.
	 *
	 * @method handleAuxiliary
	 * @private
	 * @param {Boolean} pressed - Whether the mouse button has been pressed down.
	 */

	handleAuxiliary(pressed) {

	}

	/**
	 * Handles secondary pointer button events.
	 *
	 * @method handleSecondary
	 * @private
	 * @param {Boolean} pressed - Whether the mouse button has been pressed down.
	 */

	handleSecondary(pressed) {

		if(pressed) {

			this.terrain.subtract(new Sphere({
				origin: this.cursor.position.toArray(),
				radius: this.cursor.geometry.parameters.radius
			}));

		}

	}

	/**
	 * Raycasts the terrain.
	 *
	 * @method raycast
	 * @param {MouseEvent} event - A mouse event.
	 */

	raycast(event) {

		const raycaster = this.raycaster;
		const t0 = performance.now();

		MOUSE.x = (event.clientX / window.innerWidth) * 2 - 1;
		MOUSE.y = -(event.clientY / window.innerHeight) * 2 + 1;

		raycaster.setFromCamera(MOUSE, this.camera);
		const intersects = this.terrain.raycast(raycaster);

		this.delta = (((performance.now() - t0) * 100.0) / 100.0).toFixed(2) + " ms";

		if(intersects.length > 0) {

			this.cursor.position.copy(intersects[0].point);

		} else {

			this.cursor.position.copy(raycaster.ray.direction).multiplyScalar(10).add(raycaster.ray.origin);

		}

	}

	/**
	 * Enables or disables this editor.
	 *
	 * @method setEnabled
	 * @param {Boolean} enabled - Whether this editor should be enabled or disabled.
	 */

	setEnabled(enabled) {

		const dom = this.dom;

		if(enabled) {

			this.cursor.position.copy(this.camera.position);
			this.cursor.visible = true;

			dom.addEventListener("contextmenu", this);
			dom.addEventListener("mousemove", this);
			dom.addEventListener("mousedown", this);
			dom.addEventListener("mouseup", this);

		} else {

			this.cursor.visible = false;

			dom.removeEventListener("contextmenu", this);
			dom.removeEventListener("mousemove", this);
			dom.removeEventListener("mousedown", this);
			dom.removeEventListener("mouseup", this);

		}

	}

	/**
	 * Removes all event listeners.
	 *
	 * @method dispose
	 */

	dispose() { this.setEnabled(false); }

	/**
	 * Saves a snapshot of the current terrain data.
	 *
	 * @method save
	 */

	save() {

		const a = document.createElement("a");
		a.href = this.terrain.save();
		a.download = "terrain.json";
		a.click();

	}

	/**
	 * Registers configuration options.
	 *
	 * @method configure
	 * @param {GUI} gui - A GUI.
	 */

	configure(gui) {

		const folder = gui.addFolder("Editor");

		folder.add(this, "delta").listen();

		folder.add(this, "save");
		folder.open();

	}

}
