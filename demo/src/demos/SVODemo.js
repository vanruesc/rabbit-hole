import {
	AmbientLight,
	DirectionalLight,
	Box3,
	Box3Helper,
	BufferAttribute,
	BufferGeometry,
	FogExp2,
	Mesh,
	MeshStandardMaterial,
	PerspectiveCamera,
	Vector3
} from "three";

import { DeltaControls } from "delta-controls";
import HermiteDataHelper from "hermite-data-helper";
import OctreeHelper from "octree-helper";
import { Demo } from "three-demo";

import {
	ConstructiveSolidGeometry,
	DualContouring,
	HermiteData,
	Material,
	OperationType,
	SparseVoxelOctree,
	SuperPrimitive,
	SuperPrimitivePreset,
	VoxelCell
} from "../../../src";

/**
 * An SVO demo setup.
 */

export class SVODemo extends Demo {

	/**
	 * Constructs a new SVO demo.
	 */

	constructor() {

		super("svo");

		/**
		 * The data cell size.
		 *
		 * @type {Number}
		 * @private
		 */

		this.cellSize = 1;

		/**
		 * The data cell position.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.cellPosition = new Vector3();
		this.cellPosition.subScalar(this.cellSize / 2);

		/**
		 * The current Super Primitive preset.
		 *
		 * @type {SuperPrimitivePreset}
		 * @private
		 */

		this.superPrimitivePreset = SuperPrimitivePreset.TORUS;

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

		this.octreeHelper = new OctreeHelper();

		/**
		 * A Hermite data helper.
		 *
		 * @type {HermiteDataHelper}
		 * @private
		 */

		this.hermiteDataHelper = new HermiteDataHelper();

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
					child.material.color.setHex(0x303030);

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

		const preset = this.superPrimitivePreset;
		const cellPosition = this.cellPosition.toArray();
		const cellSize = this.cellSize;
		const scale = (cellSize / 2) - ((preset === SuperPrimitivePreset.PILL) ? 0.275 : 0.075);

		const sdf = SuperPrimitive.create(preset);
		sdf.origin.set(0, 0, 0);
		sdf.setScale(scale);

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
			mesh = new Mesh(geometry, new MeshStandardMaterial({ color: 0xff0000 }));

			this.mesh = mesh;
			this.scene.add(mesh);

		}

	}

	/**
	 * Creates the scene.
	 */

	initialize() {

		const scene = this.scene;
		const composer = this.composer;
		const renderer = composer.renderer;

		// Camera.

		const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 25);
		camera.position.set(0, 0, 2);
		this.camera = camera;

		// Controls.

		const controls = new DeltaControls(camera.position, camera.quaternion, renderer.domElement);
		controls.settings.pointer.lock = false;
		controls.settings.sensitivity.zoom = 0.1;
		controls.settings.zoom.maxDistance = 20;
		controls.lookAt(scene.position);
		this.controls = controls;

		// Fog.

		scene.fog = new FogExp2(0xf4f4f4, 0.075);
		renderer.setClearColor(scene.fog.color);

		// Lights.

		const ambientLight = new AmbientLight(0x404040);
		const directionalLight = new DirectionalLight(0xffbbaa);

		directionalLight.position.set(-1, 1, 1);
		directionalLight.target.position.copy(scene.position);

		scene.add(directionalLight);
		scene.add(ambientLight);

		// Hermite Data, SDF and CSG.

		HermiteData.resolution = 64;
		HermiteDataHelper.air = Material.AIR;
		VoxelCell.errorThreshold = 1.0;
		this.createHermiteData();

		// Octree Helper.

		scene.add(this.octreeHelper);

		// Hermite Data Helper.

		scene.add(this.hermiteDataHelper);

		// Sparse Voxel Octree.

		this.createSVO();

		// Visualise the data cell.

		const box = new Box3();
		const halfSize = this.cellSize / 2;
		box.min.set(-halfSize, -halfSize, -halfSize);
		box.max.set(halfSize, halfSize, halfSize);
		scene.add(new Box3Helper(box, 0x303030));

	}

	/**
	 * Updates this demo.
	 *
	 * @param {Number} delta - The time since the last frame in seconds.
	 */

	update(delta) {

		this.controls.update(delta);

	}

	/**
	 * Registers configuration options.
	 *
	 * @param {GUI} menu - A menu.
	 */

	registerOptions(menu) {

		const octreeHelper = this.octreeHelper;
		const hermiteDataHelper = this.hermiteDataHelper;
		const presets = Object.keys(SuperPrimitivePreset);

		const params = {
			"SDF preset": presets[this.superPrimitivePreset],
			"level mask": octreeHelper.children.length - 1,
			"show Hermite data": () => {

				hermiteDataHelper.set(this.cellPosition, this.cellSize, this.hermiteData);

				try {

					hermiteDataHelper.update();

					hermiteDataHelper.visible = true;
					octreeHelper.visible = false;

				} catch(e) {

					console.error(e);

				}

			},
			"contour": () => {

				this.contour();
				octreeHelper.visible = false;
				hermiteDataHelper.visible = false;

			}
		};

		menu.add(params, "SDF preset", presets).onChange(() => {

			this.superPrimitivePreset = SuperPrimitivePreset[params["SDF preset"]];
			this.createHermiteData();
			this.createSVO();

			if(this.mesh !== null) {

				this.scene.remove(this.mesh);

			}

			hermiteDataHelper.dispose();
			octreeHelper.visible = true;
			params["level mask"] = octreeHelper.children.length - 1;

		});

		const folder = menu.addFolder("Octree Helper");
		folder.add(params, "level mask").min(0).max(octreeHelper.children.length).step(1).onChange(() => {

			let i, l;

			for(i = 0, l = octreeHelper.children.length; i < l; ++i) {

				octreeHelper.children[i].visible = (params["level mask"] === octreeHelper.children.length || i === params["level mask"]);

			}

		}).listen();

		folder.open();

		menu.add(params, "show Hermite data");
		menu.add(params, "contour");

	}

}
