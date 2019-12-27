import {
	Clock,
	DirectionalLight,
	FogExp2,
	GridHelper,
	HemisphereLight,
	PerspectiveCamera,
	Mesh,
	MeshBasicMaterial,
	Raycaster,
	Scene,
	SphereBufferGeometry,
	Vector2,
	WebGLRenderer
} from "three";

import { OctreeHelper } from "octree-helper";

import { DeltaControls, PointerButton } from "delta-controls";
import { SuperPrimitive, Terrain } from "../../src";
import { Settings } from "./settings/Settings.js";

/**
 * Screen coordinates.
 *
 * @type {Vector2}
 * @private
 */

const screenCoordinates = new Vector2();

/**
 * A terrain editor.
 *
 * @implements {EventListener}
 */

export class Editor {

	/**
	 * Constructs a new editor.
	 *
	 * @param {HTMLElement} viewport - The primary DOM container.
	 * @param {HTMLElement} aside - A secondary DOM container.
	 * @param {Map} assets - Preloaded assets.
	 */

	constructor(viewport, aside, assets) {

		/**
		 * A clock.
		 *
		 * @type {Clock}
		 * @private
		 */

		this.clock = new Clock();

		/**
		 * A renderer.
		 *
		 * @type {WebGLRenderer}
		 */

		this.renderer = (() => {

			const renderer = new WebGLRenderer({
				logarithmicDepthBuffer: true,
				antialias: true
			});

			renderer.setClearColor(0xf4f4f4);
			renderer.setSize(viewport.clientWidth, viewport.clientHeight);
			renderer.setPixelRatio(window.devicePixelRatio);

			return renderer;

		})();

		viewport.appendChild(this.renderer.domElement);

		/**
		 * A scene.
		 *
		 * @type {Scene}
		 * @private
		 */

		this.scene = new Scene();
		this.scene.fog = new FogExp2(this.renderer.getClearColor(), 0.0025);

		((scene) => {

			const hemisphereLight = new HemisphereLight(0x3284ff, 0xffc87f, 0.6);
			const directionalLight = new DirectionalLight(0xfff4e5);

			hemisphereLight.position.set(0, 1, 0).multiplyScalar(50);
			directionalLight.position.set(1.75, 1.75, -1).multiplyScalar(50);

			scene.add(directionalLight);
			scene.add(hemisphereLight);

			scene.add(new GridHelper(16, 64));

		})(this.scene);

		/**
		 * A camera.
		 *
		 * @type {PerspectiveCamera}
		 * @private
		 */

		this.camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
		this.camera.position.set(4, 1, 4);

		/**
		 * Movement controls.
		 *
		 * @type {DeltaControls}
		 * @private
		 */

		this.controls = new DeltaControls(
			this.camera.position,
			this.camera.quaternion,
			this.renderer.domElement
		);

		this.controls.lookAt(this.scene.position);
		this.controls.setOrbit(false);

		/**
		 * A terrain.
		 *
		 * @type {Terrain}
		 * @private
		 */

		this.terrain = new Terrain({
			resolution: 32,
			cellSize: 20,
			levels: 16
		});

		this.terrain.load(assets.get("terrain"));

		/**
		 * A raycaster.
		 *
		 * @type {Raycaster}
		 * @private
		 */

		this.raycaster = new Raycaster();

		/**
		 * The current settings.
		 *
		 * @type {Settings}
		 */

		this.settings = new Settings();

		/**
		 * The cursor.
		 *
		 * @type {Mesh}
		 * @private
		 */

		this.cursor = new Mesh(
			new SphereBufferGeometry(1, 16, 16),
			new MeshBasicMaterial({
				transparent: true,
				opacity: 0.35,
				color: 0x0096ff,
				fog: false
			})
		);

		this.cursor.scale.multiplyScalar(this.settings.cursor.size);
		this.scene.add(this.cursor);

		/**
		 * An octree helper.
		 *
		 * @type {OctreeHelper}
		 * @private
		 */

		this.octreeHelper = new OctreeHelper();
		this.octreeHelper.visible = false;
		this.scene.add(this.octreeHelper);

	}

	/**
	 * Raycasts the terrain.
	 *
	 * @param {MouseEvent} event - A pointer event.
	 */

	raycast(event) {

		const raycaster = this.raycaster;
		screenCoordinates.x = (event.clientX / window.innerWidth) * 2 - 1;
		screenCoordinates.y = -(event.clientY / window.innerHeight) * 2 + 1;
		raycaster.setFromCamera(screenCoordinates, this.camera);

		const octants = this.terrain.raycast(raycaster.ray);
		let intersects = [];
		let octant;
		let i, l;

		for(i = 0, l = octants.length; i < l; ++i) {

			octant = octants[i];

			if(octant.mesh !== null) {

				intersects = intersects.concat(raycaster.intersectObject(octant.mesh));

				if(intersects.length > 0) {

					break;

				}

			}

		}

		if(intersects.length > 0) {

			this.cursor.position.copy(intersects[0].point);

		} else {

			this.cursor.position.copy(raycaster.ray.direction).multiplyScalar(
				this.settings.cursor.distance + this.cursor.scale.x
			).add(raycaster.ray.origin);

		}

	}

	/**
	 * Handles main pointer button events.
	 *
	 * @private
	 * @param {MouseEvent} event - A pointer event.
	 * @param {Boolean} pressed - Whether the mouse button has been pressed down.
	 */

	handleMainPointerButton(event, pressed) {

		const sdf = SuperPrimitive.create(this.superPrimitivePreset);
		sdf.origin.copy(this.cursor.position);
		sdf.setScale(this.settings.cursor.size);

		if(pressed) {

			this.terrain.union(sdf);

		}

	}

	/**
	 * Handles auxiliary pointer button events.
	 *
	 * @private
	 * @param {MouseEvent} event - A pointer event.
	 * @param {Boolean} pressed - Whether the mouse button has been pressed down.
	 */

	handleAuxiliaryPointerButton(event, pressed) {

	}

	/**
	 * Handles secondary pointer button events.
	 *
	 * @private
	 * @param {MouseEvent} event - A pointer event.
	 * @param {Boolean} pressed - Whether the mouse button has been pressed down.
	 */

	handleSecondaryPointerButton(event, pressed) {

		const sdf = SuperPrimitive.create(this.superPrimitivePreset);
		sdf.origin.copy(this.cursor.position);
		sdf.setScale(this.settings.cursor.size);

		if(pressed) {

			this.terrain.subtract(sdf);

		}

	}

	/**
	 * Handles pointer button events.
	 *
	 * @private
	 * @param {MouseEvent} event - A mouse event.
	 * @param {Boolean} pressed - Whether the mouse button has been pressed down.
	 */

	handlePointerEvent(event, pressed) {

		event.preventDefault();

		switch(event.button) {

			case PointerButton.MAIN:
				this.handleMainPointerButton(event, pressed);
				break;

			case PointerButton.AUXILIARY:
				this.handleAuxiliaryPointerButton(event, pressed);
				break;

			case PointerButton.SECONDARY:
				this.handleSecondaryPointerButton(event, pressed);
				break;

		}

	}

	/**
	 * Handles keyboard events.
	 *
	 * @private
	 * @param {KeyboardEvent} event - A keyboard event.
	 * @param {Boolean} pressed - Whether the key has been pressed down.
	 */

	handleKeyboardEvent(event, pressed) {

		const keyBindings = this.settings.keyBindings;

		if(keyBindings.has(event.keyCode)) {

			event.preventDefault();

			this.strategies.get(keyBindings.get(event.keyCode)).execute(pressed);

		}

	}

	/**
	 * Handles events.
	 *
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

			case "keydown":
				this.handleKeyboardEvent(event, true);
				break;

			case "keyup":
				this.handleKeyboardEvent(event, false);
				break;

		}

	}

	/**
	 * Enables or disables this editor.
	 *
	 * @param {Boolean} enabled - Whether this editor should be enabled or disabled.
	 */

	render() {

		this.stats.begin();

		this.controls.update(this.clock.getDelta());
		this.terrain.update(this.camera.position);
		this.renderer.render(this.scene, this.camera);

		this.stats.end();

	}

	/**
	 * Enables or disables edit mode.
	 *
	 * @param {Boolean} enabled - Whether edit mode should be enabled or disabled.
	 */

	setEnabled(enabled) {

		const dom = this.renderer.domElement;

		if(enabled) {

			this.cursor.position.copy(this.camera.position);
			this.cursor.visible = true;

			document.body.addEventListener("keyup", this);
			document.body.addEventListener("keydown", this);
			dom.addEventListener("contextmenu", this);
			dom.addEventListener("mousemove", this);
			dom.addEventListener("mousedown", this);
			dom.addEventListener("mouseup", this);

		} else {

			this.cursor.visible = false;

			document.body.removeEventListener("keyup", this);
			document.body.removeEventListener("keydown", this);
			dom.removeEventListener("contextmenu", this);
			dom.removeEventListener("mousemove", this);
			dom.removeEventListener("mousedown", this);
			dom.removeEventListener("mouseup", this);

		}

	}

	/**
	 * Removes all event listeners.
	 */

	dispose() {

		this.setEnabled(false);

	}

	/**
	 * Saves the CSG operation history of the current terrain.
	 */

	save() {

		const dataURL = this.terrain.save();
		const a = document.createElement("a");
		a.href = dataURL;
		a.download = "terrain.json";
		a.click();
		URL.revokeObjectURL(dataURL);

	}

	/**
	 * Registers configuration options.
	 *
	 * @param {GUI} menu - A menu.
	 */

	/* registerOptions(menu) {

		const params = {
			"show world octree": this.octreeHelper.visible
		};

		folder.add(this, "cursorSize").min(1).max(10).step(0.01).onChange(() => {

			this.cursor.scale.set(this.cursorSize, this.cursorSize, this.cursorSize);

		});

		folder.add(params, "octree").onChange(() => {

			this.octreeHelper.update();
			this.octreeHelper.visible = params.octree;

		});

		folder.add(this, "save");
		folder.open();

	} */

}
