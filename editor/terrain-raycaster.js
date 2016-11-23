import {
	Mesh,
	SphereBufferGeometry,
	MeshBasicMaterial,
	Raycaster,
	Vector2
} from "three";

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
 * A terrain raycaster.
 *
 * @class TerrainRaycaster
 * @extends Raycaster
 * @implements EventListener
 * @constructor
 * @param {Terrain} terrain - A terrain instance.
 * @param {PerspectiveCamera} camera - A camera.
 * @param {Element} [dom=document.body] - A dom element.
 */

export class TerrainRaycaster extends Raycaster {

	constructor(terrain, camera, dom = document.body) {

		super();

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
		 * A dom element.
		 *
		 * @property dom
		 * @type Element
		 * @private
		 */

		this.cursor = new Mesh(
			new SphereBufferGeometry(1, 16, 16),
			new MeshBasicMaterial({
				transparent: true,
				opacity: 0.5,
				color: 0x0096ff,
				fog: false
			})
		);

		/**
		 * A delta time.
		 *
		 * @property delta
		 * @type String
		 */

		this.delta = "";

		this.setEnabled(true);

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

		}

	}

	/**
	 * Raycasts the terrain.
	 *
	 * @method raycast
	 * @param {MouseEvent} event - A mouse event.
	 */

	raycast(event) {

		const intersects = [];
		const t0 = performance.now();

		MOUSE.x = (event.clientX / window.innerWidth) * 2 - 1;
		MOUSE.y = -(event.clientY / window.innerHeight) * 2 + 1;

		this.setFromCamera(MOUSE, this.camera);
		this.terrain.raycast(this, intersects);

		this.delta = (((performance.now() - t0) * 100.0) / 100.0).toFixed(2) + " ms";

		if(intersects.length > 0) {

			this.cursor.position.copy(intersects[0].point);

		} else {

			this.cursor.position.copy(this.ray.direction).multiplyScalar(10).add(this.ray.origin);

		}

	}

	/**
	 * Enables or disables this raycaster.
	 *
	 * @method setEnabled
	 * @param {Boolean} enabled - Whether this raycaster should be enabled or disabled.
	 */

	setEnabled(enabled) {

		const dom = this.dom;

		if(enabled) {

			this.cursor.visible = true;
			dom.addEventListener("mousemove", this);

		} else {

			this.cursor.visible = false;
			dom.removeEventListener("mousemove", this);

		}

	}

	/**
	 * Removes all event listeners.
	 *
	 * @method dispose
	 */

	dispose() { this.setEnabled(false); }

	/**
	 * Registers configuration options.
	 *
	 * @method configure
	 * @param {GUI} gui - A GUI.
	 */

	configure(gui) {

		const folder = gui.addFolder("Raycasting");

		folder.add(this, "delta").listen();

		folder.open();

	}

}
