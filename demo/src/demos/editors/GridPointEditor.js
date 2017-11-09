import {
	Group,
	Mesh,
	MeshBasicMaterial,
	Raycaster,
	SphereBufferGeometry,
	Vector2,
	Vector3
} from "three";

import { Event, EventTarget } from "synthetic-event";
import { HermiteData, Material } from "../../../../src";

/**
 * A mouse position.
 *
 * @type {Vector2}
 * @private
 */

const mouse = new Vector2();

/**
 * An update event.
 *
 * @type {Event}
 * @private
 */

const updateEvent = new Event("update");

/**
 * A visual grid point editor.
 *
 * @implements {EventListener}
 */

export class GridPointEditor extends EventTarget {

	/**
	 * Constructs a new grid point editor.
	 *
	 * @param {Vector3} cellPosition - The position of the data cell.
	 * @param {Number} cellSize - The size of the data cell.
	 * @param {HermiteData} hermiteData - A set of Hermite data.
	 * @param {PerspectiveCamera} camera - A camera.
	 * @param {Element} [dom=document.body] - A dom element.
	 */

	constructor(cellPosition, cellSize, hermiteData, camera, dom = document.body) {

		super();

		/**
		 * The Hermite data.
		 *
		 * @type {HermiteData}
		 * @private
		 */

		this.hermiteData = hermiteData;

		/**
		 * The position of the data cell.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.cellPosition = cellPosition;

		/**
		 * The size of the data cell.
		 *
		 * @type {Number}
		 * @private
		 */

		this.cellSize = cellSize;

		/**
		 * A camera.
		 *
		 * @type {PerspectiveCamera}
		 * @private
		 */

		this.camera = camera;

		/**
		 * A dom element.
		 *
		 * @type {Element}
		 * @private
		 */

		this.dom = dom;

		/**
		 * A raycaster.
		 *
		 * @type {Raycaster}
		 * @private
		 */

		this.raycaster = new Raycaster();

		/**
		 * Grid point materials.
		 *
		 * @type {MeshBasicMaterial[]}
		 * @private
		 */

		this.gridPointMaterials = [

			new MeshBasicMaterial({
				color: 0x999999,
				depthWrite: false,
				transparent: true,
				opacity: 0.75
			}),

			new MeshBasicMaterial({
				color: 0xcc6666,
				depthWrite: false,
				transparent: true,
				opacity: 0.9
			})

		];

		/**
		 * A selected grid point.
		 *
		 * @type {Mesh}
		 * @private
		 */

		this.selectedGridPoint = null;

		/**
		 * A group of spheres that represent the grid points.
		 *
		 * @type {Group}
		 */

		this.gridPoints = new Group();

		// Initialise the visual editor interface components.
		this.createGridPoints();

	}

	/**
	 * Creates interactive visual grid points.
	 *
	 * @private
	 */

	createGridPoints() {

		const gridPoints = this.gridPoints;

		const s = this.cellSize;
		const n = HermiteData.resolution;

		const base = this.cellPosition;
		const offset = new Vector3();
		const gridPointGeometry = new SphereBufferGeometry(0.05, 8, 8);
		const gridPointMaterial = this.gridPointMaterials[0];

		let gridPoint;
		let x, y, z;

		for(z = 0; z <= n; ++z) {

			offset.z = z * s / n;

			for(y = 0; y <= n; ++y) {

				offset.y = y * s / n;

				for(x = 0; x <= n; ++x) {

					offset.x = x * s / n;

					gridPoint = new Mesh(gridPointGeometry, gridPointMaterial);
					gridPoint.position.copy(base).add(offset);
					gridPoints.add(gridPoint);

				}

			}

		}

	}

	/**
	 * Toggles the material of the given grid point.
	 *
	 * @private
	 * @param {Number} index - A grid point index.
	 */

	toggleMaterialIndex(index) {

		const hermiteData = this.hermiteData;
		const materialIndices = hermiteData.materialIndices;
		const material = (materialIndices[index] === Material.AIR) ? Material.SOLID : Material.AIR;

		hermiteData.setMaterialIndex(index, material);

	}

	/**
	 * Handles click events.
	 *
	 * @private
	 * @param {MouseEvent} event - A mouse event.
	 */

	handleClick(event) {

		const gridPoint = this.selectedGridPoint;

		event.preventDefault();

		if(gridPoint !== null) {

			this.toggleMaterialIndex(this.gridPoints.children.indexOf(gridPoint));
			this.dispatchEvent(updateEvent);

		}

	}

	/**
	 * Raycasts the grid points.
	 *
	 * @param {MouseEvent} event - A mouse event.
	 */

	raycast(event) {

		const raycaster = this.raycaster;

		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		raycaster.setFromCamera(mouse, this.camera);

		const intersectingGridPoints = raycaster.intersectObjects(this.gridPoints.children);

		if(this.selectedGridPoint !== null) {

			this.selectedGridPoint.material = this.gridPointMaterials[0];
			this.selectedGridPoint = null;

		}

		if(intersectingGridPoints.length > 0) {

			this.selectedGridPoint = intersectingGridPoints[0].object;
			this.selectedGridPoint.material = this.gridPointMaterials[1];

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

			case "click":
				this.handleClick(event);
				break;

		}

	}

	/**
	 * Enables or disables this editor.
	 *
	 * @param {Boolean} enabled - Whether this editor should be enabled or disabled.
	 */

	setEnabled(enabled) {

		const dom = this.dom;

		if(enabled) {

			dom.addEventListener("mousemove", this);
			dom.addEventListener("click", this);

		} else {

			dom.removeEventListener("mousemove", this);
			dom.removeEventListener("click", this);

		}

	}

	/**
	 * Removes all event listeners.
	 */

	dispose() {

		this.setEnabled(false);

	}

	/**
	 * Registers configuration options.
	 *
	 * @param {GUI} gui - A GUI.
	 */

	configure(gui) {}

}
