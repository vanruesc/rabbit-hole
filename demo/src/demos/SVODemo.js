import {
	BoxBufferGeometry,
	BufferAttribute,
	BufferGeometry,
	Mesh,
	MeshBasicMaterial,
	OrbitControls,
	Vector3
} from "three";

import OctreeHelper from "octree-helper";

import {
	ConstructiveSolidGeometry,
	DualContouring,
	HermiteData,
	OperationType,
	SparseVoxelOctree,
	SuperPrimitive,
	SuperPrimitivePreset,
	VoxelCell
} from "../../../src";

import { Demo } from "./Demo.js";

/**
 * An SVO demo setup.
 */

export class SVODemo extends Demo {

	/**
	 * Constructs a new SVO demo.
	 *
	 * @param {WebGLRenderer} renderer - A renderer.
	 */

	constructor(renderer) {

		super(renderer);

		/**
		 * The data cell size.
		 *
		 * @type {Number}
		 * @private
		 */

		this.cellSize = 0;

		/**
		 * The data cell position.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.cellPosition = null;

		/**
		 * The current Super Primitive preset.
		 *
		 * @type {SuperPrimitivePreset}
		 * @private
		 */

		this.superPrimitivePreset = null;

		/**
		 * A set of Hermite data.
		 *
		 * @type {HermiteData}
		 * @private
		 */

		this.hermiteData = null;

		/**
		 * An octree helper.
		 *
		 * @type {OctreeHelper}
		 * @private
		 */

		this.octreeHelper = null;

		/**
		 * A generated mesh.
		 *
		 * @type {Mesh}
		 * @private
		 */

		this.mesh = null;

	}

	/**
	 * Creates a new SVO and updates the octree helper.
	 *
	 * @private
	 */

	createSVO() {

		const octreeHelper = this.octreeHelper;

		octreeHelper.octree = new SparseVoxelOctree(this.hermiteData, this.cellPosition, this.cellSize);
		octreeHelper.update();

		// Customise colour and visibility.
		((octreeHelper) => {

			const groups = octreeHelper.children;

			let group, children, child;
			let i, j, il, jl;

			for(i = 0, il = groups.length; i < il; ++i) {

				group = groups[i];
				children = group.children;

				for(j = 0, jl = children.length; j < jl; ++j) {

					child = children[j];
					child.material.color.setHex(0x000000);

				}

				group.visible = (i + 1 === il);

			}

		})(octreeHelper);

	}

	/**
	 * Creates new Hermite data using the current SDF preset.
	 *
	 * @private
	 * @return {HermiteData} The generated data.
	 */

	createHermiteData() {

		const cellPosition = this.cellPosition.toArray();
		const cellSize = this.cellSize;
		const halfSize = cellSize / 2;

		const sdf = SuperPrimitive.create(this.superPrimitivePreset);
		sdf.origin.set(0, 0, 0);
		sdf.setScale(halfSize - 0.075);

		this.hermiteData = ConstructiveSolidGeometry.run(cellPosition, cellSize, null, sdf.setOperationType(OperationType.UNION));

		return this.hermiteData;

	}

	/**
	 * Extracts an isosurface form the current SVO.
	 *
	 * @private
	 */

	contour() {

		const isosurface = DualContouring.run(this.octreeHelper.octree);

		let mesh, geometry;

		if(isosurface !== null) {

			if(this.mesh !== null) {

				this.mesh.geometry.dispose();
				this.scene.remove(this.mesh);

			}

			geometry = new BufferGeometry();
			geometry.setIndex(new BufferAttribute(isosurface.indices, 1));
			geometry.addAttribute("position", new BufferAttribute(isosurface.positions, 3));
			geometry.addAttribute("normal", new BufferAttribute(isosurface.normals, 3));
			mesh = new Mesh(geometry, new MeshBasicMaterial({ color: 0xff0000, wireframe: true }));

			this.mesh = mesh;
			this.scene.add(mesh);

		}

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
		scene.fog.density = 0.075;
		renderer.setClearColor(scene.fog.color);

		// Controls.

		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enablePan = false;
		controls.maxDistance = 20;

		this.controls = controls;

		// Camera.

		camera.near = 0.01;
		camera.far = 25;
		camera.position.set(0, 0, 2);
		camera.lookAt(controls.target);

		// Hermite Data, SDF and CSG.

		HermiteData.resolution = 64;
		VoxelCell.errorThreshold = 1.0;

		const cellSize = 1;
		const halfSize = cellSize / 2;
		const cellPosition = new Vector3(-halfSize, -halfSize, -halfSize);

		this.cellPosition = cellPosition;
		this.cellSize = cellSize;
		this.superPrimitivePreset = SuperPrimitivePreset.TORUS;

		this.createHermiteData();

		// Octree Helper.

		const octreeHelper = new OctreeHelper();

		this.octreeHelper = octreeHelper;
		scene.add(octreeHelper);

		// Sparse Voxel Octree.

		this.createSVO();

		// Highlight the data cell.
		scene.add(new Mesh(
			new BoxBufferGeometry(cellSize, cellSize, cellSize),
			new MeshBasicMaterial({
				color: 0xcccccc,
				depthWrite: false,
				transparent: true,
				opacity: 0.35
			})
		));

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

		const octreeHelper = this.octreeHelper;
		const presets = Object.keys(SuperPrimitivePreset);

		const params = {
			"SDF preset": presets[this.superPrimitivePreset],
			"level mask": octreeHelper.children.length - 1,
			"contour": () => {

				this.contour();
				this.octreeHelper.visible = false;

			}
		};

		gui.add(params, "SDF preset", presets).onChange(() => {

			this.superPrimitivePreset = SuperPrimitivePreset[params["SDF preset"]];
			this.createHermiteData();
			this.createSVO();

			if(this.mesh !== null) {

				this.scene.remove(this.mesh);

			}

			this.octreeHelper.visible = true;
			params["level mask"] = this.octreeHelper.children.length - 1;

		});

		const folder = gui.addFolder("Octree Helper");
		folder.add(params, "level mask").min(0).max(octreeHelper.children.length).step(1).onChange(() => {

			let i, l;

			for(i = 0, l = octreeHelper.children.length; i < l; ++i) {

				octreeHelper.children[i].visible = (params["level mask"] === octreeHelper.children.length || i === params["level mask"]);

			}

		}).listen();

		folder.open();

		gui.add(params, "contour");

	}

}
