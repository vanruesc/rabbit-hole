import {
	BoxBufferGeometry,
	FogExp2,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	SphereBufferGeometry,
	Vector3
} from "three";

import { ControlMode, SpatialControls } from "spatial-controls";
import { Demo } from "three-demo";

import {
	HermiteData,
	HermiteDataHelper,
	Material,
	QEFSolver
} from "../../../src";

import { HermiteDataEditor } from "./editors/HermiteDataEditor";

/**
 * A voxel demo setup that showcases the QEF calculation.
 *
 * @implements {EventListener}
 */

export class VoxelDemo extends Demo {

	/**
	 * Constructs a new voxel demo.
	 */

	constructor() {

		super("voxel");

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

			case "update": {

				try {

					this.hermiteDataHelper.update(true, false);

				} catch(e) {

					// Data is just empty right now. Ignore.

				}

				this.solveQEF(event.data);

				break;

			}

		}

	}

	initialize() {

		const scene = this.scene;
		const renderer = this.renderer;

		// Camera

		const aspect = window.innerWidth / window.innerHeight;
		const camera = new PerspectiveCamera(50, aspect, 0.1, 1000);
		this.camera = camera;

		// Controls

		const controls = new SpatialControls(camera.position, camera.quaternion, renderer.domElement);
		const settings = controls.settings;
		settings.general.setMode(ControlMode.THIRD_PERSON);
		settings.zoom.setRange(0.25, 40.0);
		settings.rotation.setSensitivity(2);
		settings.translation.setEnabled(false);
		settings.zoom.setSensitivity(0.1);
		controls.setPosition(-2, 1, 2);
		this.controls = controls;

		// Fog

		scene.fog = new FogExp2(0x0d0d0d, 0.025);
		renderer.setClearColor(scene.fog.color);

		// Hermite Data

		HermiteData.resolution = 1;
		HermiteDataHelper.air = Material.AIR;

		const cellSize = 1;
		const cellPosition = new Vector3(-0.5, -0.5, -0.5);
		cellPosition.multiplyScalar(cellSize);

		const hermiteData = new HermiteData();
		const hermiteDataHelper = new HermiteDataHelper(cellPosition, cellSize, hermiteData, true, false);

		this.hermiteData = hermiteData;
		this.hermiteDataHelper = hermiteDataHelper;

		scene.add(hermiteDataHelper);

		const hermiteDataEditor = new HermiteDataEditor(cellPosition, cellSize, hermiteData, camera, renderer.domElement);
		hermiteDataEditor.addEventListener("update", (e) => this.handleEvent(e));

		this.hermiteDataEditor = hermiteDataEditor;

		scene.add(hermiteDataEditor.gridPoints);
		scene.add(hermiteDataEditor.edges);
		scene.add(hermiteDataEditor.planes);

		// Voxel cell highlighting

		const size = cellSize - 0.05;
		scene.add(new Mesh(
			new BoxBufferGeometry(size, size, size),
			new MeshBasicMaterial({
				color: 0xcccccc,
				depthWrite: false,
				transparent: true,
				opacity: 0.4
			})
		));

		// Vertex visualization

		this.vertex.visible = false;
		scene.add(this.vertex);

	}

	update(deltaTime, timestamp) {

		this.controls.update(timestamp);

	}

	registerOptions(menu) {

		const folder = menu.addFolder("Vertex Position");
		folder.add(this.result, "x").listen();
		folder.add(this.result, "y").listen();
		folder.add(this.result, "z").listen();
		folder.add(this, "error").listen();
		folder.open();

		this.hermiteDataEditor.registerOptions(menu);

	}

}
