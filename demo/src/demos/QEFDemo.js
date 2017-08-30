import {
	BoxBufferGeometry,
	Mesh,
	MeshBasicMaterial,
	OrbitControls,
	SphereBufferGeometry,
	Vector3
} from "three";

import {
	HermiteData,
	HermiteDataHelper,
	QEFSolver
} from "../../../src";

import { HermiteDataEditor } from "./editors/HermiteDataEditor.js";
import { Demo } from "./Demo.js";

/**
 * A QEF demo setup.
 *
 * @implements {EventListener}
 */

export class QEFDemo extends Demo {

	/**
	 * Constructs a new QEF demo.
	 *
	 * @param {WebGLRenderer} renderer - A renderer.
	 */

	constructor(renderer) {

		super(renderer);

		/**
		 * A set of Hermite data.
		 *
		 * @type {HermiteData}
		 * @private
		 */

		this.hermiteData = null;

		/**
		 * A Hermite data helper.
		 *
		 * @type {HermiteDataHelper}
		 * @private
		 */

		this.hermiteDataHelper = null;

		/**
		 * A Hermite data editor.
		 *
		 * @type {HermiteDataEditor}
		 * @private
		 */

		this.hermiteDataEditor = null;

		/**
		 * A QEF solver.
		 *
		 * @type {QEFSolver}
		 * @private
		 */

		this.qefSolver = new QEFSolver();

		/**
		 * The current QEF error.
		 *
		 * @type {String}
		 */

		this.error = "0.0000";

		/**
		 * The QEF result.
		 *
		 * @type {Object}
		 * @param {String} x - The calculated vertex X-coordinate.
		 * @param {String} y - The calculated vertex Y-coordinate.
		 * @param {String} z - The calculated vertex Z-coordinate.
		 */

		this.result = {
			x: "",
			y: "",
			z: ""
		};

		/**
		 * A set of QEF data.
		 *
		 * @type {Mesh}
		 * @private
		 */

		this.vertex = new Mesh(
			new SphereBufferGeometry(0.05, 8, 8),
			new MeshBasicMaterial({
				color: 0xff8822
			})
		);

		this.vertex.visible = false;

	}

	/**
	 * Creates the scene.
	 */

	initialise() {

		const scene = this.scene;
		const camera = this.camera;
		const renderer = this.renderer;

		// Scene and Renderer.

		scene.fog.color.setHex(0xf4f4f4);
		scene.fog.density = 0.025;
		renderer.setClearColor(scene.fog.color);

		// Controls.

		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enablePan = false;
		controls.maxDistance = 40;

		this.controls = controls;

		// Camera.

		camera.near = 0.01;
		camera.far = 50;
		camera.position.set(-2, 1, 2);
		camera.lookAt(controls.target);

		// Hermite Data preparation.

		HermiteData.resolution = 1;

		const cellSize = 1;
		const cellPosition = new Vector3(-0.5, -0.5, -0.5);
		cellPosition.multiplyScalar(cellSize);

		const hermiteData = new HermiteData();
		const hermiteDataHelper = new HermiteDataHelper(cellPosition, cellSize, hermiteData, true, false);

		this.hermiteData = hermiteData;
		this.hermiteDataHelper = hermiteDataHelper;

		scene.add(hermiteDataHelper);

		const hermiteDataEditor = new HermiteDataEditor(cellPosition, cellSize, hermiteData, camera, renderer.domElement);
		hermiteDataEditor.addEventListener("update", this);

		this.hermiteDataEditor = hermiteDataEditor;

		scene.add(hermiteDataEditor.gridPoints);
		scene.add(hermiteDataEditor.edges);
		scene.add(hermiteDataEditor.planes);

		// Highlight the voxel cell.
		const size = cellSize - 0.05;
		scene.add(new Mesh(
			new BoxBufferGeometry(size, size, size),
			new MeshBasicMaterial({
				color: 0xcccccc,
				depthWrite: false,
				transparent: true,
				opacity: 0.35
			})
		));

		// Visualise the computed vertex.
		scene.add(this.vertex);

	}

	/**
	 * Calculates the vertex position from the given QEF data.
	 *
	 * @private
	 * @param {QEFData} qefData - The QEF data.
	 */

	solveQEF(qefData) {

		const hermiteData = this.hermiteData;
		const qefSolver = this.qefSolver;
		const vertex = this.vertex;
		const result = this.result;

		if(!hermiteData.empty && !hermiteData.full) {

			this.error = qefSolver.setData(qefData).solve(vertex.position).toFixed(4);
			vertex.visible = true;

			result.x = vertex.position.x.toFixed(2);
			result.y = vertex.position.y.toFixed(2);
			result.z = vertex.position.z.toFixed(2);

		} else if(vertex.visible) {

			result.x = "";
			result.y = "";
			result.z = "";

			vertex.visible = false;

		}

	}

	/**
	 * Handles events.
	 *
	 * @param {DataEvent} event - An event.
	 */

	handleEvent(event) {

		switch(event.type) {

			case "update":
				this.hermiteDataHelper.update(true, false);
				this.solveQEF(event.qefData);
				break;

		}

	}

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

	configure(gui) {

		const folder = gui.addFolder("Result");
		folder.add(this.result, "x").listen();
		folder.add(this.result, "y").listen();
		folder.add(this.result, "z").listen();
		folder.add(this, "error").listen();
		folder.open();

		this.hermiteDataEditor.configure(gui);

	}

}
