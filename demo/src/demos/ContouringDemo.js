import {
	AmbientLight,
	DirectionalLight,
	Box3,
	Box3Helper,
	BufferAttribute,
	BufferGeometry,
	CubeTextureLoader,
	FogExp2,
	Mesh,
	MeshPhysicalMaterial,
	PerspectiveCamera,
	TextureLoader,
	Vector3
} from "three";

import { DeltaControls } from "delta-controls";
import { Euler, RotationOrder } from "math-ds";
import { HermiteDataHelper } from "hermite-data-helper";
import { OctreeHelper } from "octree-helper";
import { Demo } from "three-demo";

import {
	ConstructiveSolidGeometry,
	DualContouring,
	Heightfield,
	HermiteData,
	Material,
	OperationType,
	SDFType,
	SparseVoxelOctree,
	SuperPrimitive,
	SuperPrimitivePreset,
	VoxelCell
} from "../../../src";

/**
 * A contouring demo setup.
 */

export class ContouringDemo extends Demo {

	/**
	 * Constructs a new contouring demo.
	 */

	constructor() {

		super("contouring");

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
		 * Determines which SDF type to use for the generation of Hermite data.
		 *
		 * @type {SDFType}
		 * @private
		 */

		this.sdfType = SDFType.SUPER_PRIMITIVE;

		/**
		 * Euler angles.
		 *
		 * @type {Euler}
		 * @private
		 */

		this.euler = new Euler();

		/**
		 * The SDF scale.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.scale = new Vector3();

		/**
		 * The current Super Primitive preset.
		 *
		 * @type {SuperPrimitivePreset}
		 * @private
		 */

		this.superPrimitivePreset = SuperPrimitivePreset.TORUS;

		/**
		 * A heightfield.
		 *
		 * @type {Heightfield}
		 * @private
		 */

		this.heightfield = new Heightfield();

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
		 * An AABB helper.
		 *
		 * @type {Box3Helper}
		 * @private
		 */

		this.box3Helper = new Box3Helper();

		/**
		 * A material.
		 *
		 * @type {MeshPhysicalMaterial}
		 * @private
		 */

		this.material = new MeshPhysicalMaterial({
			color: 0x009188,
			metalness: 0.23,
			roughness: 0.31,
			clearcoat: 0.94,
			clearcoatRoughness: 0.15,
			dithering: true
		});

		/**
		 * A generated mesh.
		 *
		 * @type {Mesh}
		 * @private
		 */

		this.mesh = null;

		/**
		 * The current amount of generated vertices.
		 *
		 * @type {Number}
		 * @private
		 */

		this.vertices = 0;

		/**
		 * The current amount of generated faces.
		 *
		 * @type {Number}
		 * @private
		 */

		this.faces = 0;

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

			let group, children, child, color;
			let i, j, il, jl;

			for(i = 0, il = groups.length; i < il; ++i) {

				group = groups[i];
				children = group.children;
				color = (i + 1 < il) ? 0x303030 : 0xbb3030;

				for(j = 0, jl = children.length; j < jl; ++j) {

					child = children[j];
					child.material.color.setHex(color);

				}

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

		let sdf;

		switch(this.sdfType) {

			case SDFType.SUPER_PRIMITIVE:
				sdf = SuperPrimitive.create(this.superPrimitivePreset);
				sdf.quaternion.setFromEuler(this.euler);
				sdf.scale.copy(this.scale);
				break;

			case SDFType.HEIGHTFIELD:
				sdf = this.heightfield;
				sdf.position.set(-1, -0.25, -1);
				sdf.quaternion.set(0, 0, 0, 1);
				sdf.scale.set(2, 0.5, 2);
				break;

		}

		sdf.updateInverseTransformation();

		this.box3Helper.box = sdf.getBoundingBox();
		this.hermiteData = ConstructiveSolidGeometry.run(
			this.cellPosition.toArray(),
			this.cellSize,
			null,
			sdf.setOperationType(OperationType.UNION)
		);

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
			geometry.setAttribute("position", new BufferAttribute(isosurface.positions, 3));
			geometry.setAttribute("normal", new BufferAttribute(isosurface.normals, 3));
			mesh = new Mesh(geometry, this.material);

			// Statistics.
			this.vertices = isosurface.positions.length / 3;
			this.faces = isosurface.indices.length / 3;

			this.mesh = mesh;
			this.scene.add(mesh);

		}

	}

	/**
	 * Loads scene assets.
	 *
	 * @return {Promise} A promise that will be fulfilled as soon as all assets have been loaded.
	 */

	load() {

		const assets = this.assets;
		const loadingManager = this.loadingManager;
		const cubeTextureLoader = new CubeTextureLoader(loadingManager);
		const textureLoader = new TextureLoader(loadingManager);

		const path = "textures/skies/interstellar/";
		const format = ".jpg";
		const urls = [
			path + "px" + format, path + "nx" + format,
			path + "py" + format, path + "ny" + format,
			path + "pz" + format, path + "nz" + format
		];

		return new Promise((resolve, reject) => {

			if(assets.size === 0) {

				loadingManager.onError = reject;
				loadingManager.onProgress = (item, loaded, total) => {

					if(loaded === total) {

						resolve();

					}

				};

				cubeTextureLoader.load(urls, (textureCube) => {

					assets.set("sky", textureCube);

				});

				textureLoader.load("textures/height/03.png", (texture) => {

					assets.set("heightmap", texture);

				});

			} else {

				resolve();

			}

		});

	}

	/**
	 * Creates the scene.
	 */

	initialize() {

		const scene = this.scene;
		const assets = this.assets;
		const renderer = this.renderer;

		// Default settings.

		this.sdfType = SDFType.SUPER_PRIMITIVE;
		this.euler.set(4.11, 3.56, 4.74, RotationOrder.XYZ);
		this.scale.set(0.34, 0.47, 0.25);
		this.superPrimitivePreset = SuperPrimitivePreset.TORUS;

		// Camera.

		const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 25);
		camera.position.set(0, 0, -2);
		this.camera = camera;

		// Controls.

		const controls = new DeltaControls(camera.position, camera.quaternion, renderer.domElement);
		controls.settings.pointer.lock = false;
		controls.settings.sensitivity.rotation = 0.00175;
		controls.settings.sensitivity.translation = 0.425;
		controls.settings.sensitivity.zoom = 0.2;
		controls.settings.zoom.maxDistance = 20;
		controls.lookAt(scene.position);
		this.controls = controls;

		// Fog.

		scene.fog = new FogExp2(0xf4f4f4, 0.075);
		renderer.setClearColor(scene.fog.color);

		// Sky.

		scene.background = assets.get("sky");
		this.material.envMap = assets.get("sky");

		// Lights.

		const ambientLight = new AmbientLight(0x404040);
		const directionalLight = new DirectionalLight(0xffbbaa);

		directionalLight.position.set(-0.5, 1.5, 1);
		directionalLight.target.position.copy(scene.position);

		scene.add(directionalLight);
		scene.add(ambientLight);

		// Load the heightfield.

		this.heightfield.fromImage(assets.get("heightmap").image);

		// Hermite Data, SDF and CSG.

		HermiteData.resolution = 64;
		HermiteDataHelper.air = Material.AIR;
		VoxelCell.errorThreshold = 0.005;
		this.createHermiteData();

		// Octree Helper.

		this.octreeHelper.visible = true;
		scene.add(this.octreeHelper);

		// Hermite Data Helper.

		scene.add(this.hermiteDataHelper);

		// SDF AABB Helper.

		scene.add(this.box3Helper);

		// Sparse Voxel Octree.

		this.createSVO();

		// Visualise the data cell.

		const box = new Box3();
		const halfSize = this.cellSize / 2;
		box.min.set(-halfSize, -halfSize, -halfSize);
		box.max.set(halfSize, halfSize, halfSize);

		const boxHelper = new Box3Helper(box, 0x303030);
		boxHelper.material.transparent = true;
		boxHelper.material.opacity = 0.25;
		scene.add(boxHelper);

	}

	/**
	 * Renders this demo.
	 *
	 * @param {Number} delta - The time since the last frame in seconds.
	 */

	render(delta) {

		this.controls.update(delta);

		super.render(delta);

	}

	/**
	 * Registers configuration options.
	 *
	 * @param {GUI} menu - A menu.
	 */

	registerOptions(menu) {

		const octreeHelper = this.octreeHelper;
		const hermiteDataHelper = this.hermiteDataHelper;
		const box3Helper = this.box3Helper;
		const presets = Object.keys(SuperPrimitivePreset).concat(["HEIGHTFIELD"]);
		const material = this.material;

		const params = {

			"SDF": presets[this.superPrimitivePreset],
			"color": material.color.getHex(),
			"level mask": octreeHelper.children.length,

			"show SVO": () => {

				if(params.SDF !== "HEIGHTFIELD") {

					this.superPrimitivePreset = SuperPrimitivePreset[params.SDF];
					this.sdfType = SDFType.SUPER_PRIMITIVE;

				} else {

					this.sdfType = SDFType.HEIGHTFIELD;

				}

				this.createHermiteData();
				this.createSVO();

				if(this.mesh !== null) {

					this.scene.remove(this.mesh);

				}

				hermiteDataHelper.dispose();
				octreeHelper.visible = true;
				box3Helper.visible = true;
				params["level mask"] = octreeHelper.children.length;

			},

			"show Hermite data": () => {

				hermiteDataHelper.set(this.cellPosition, this.cellSize, this.hermiteData);

				try {

					hermiteDataHelper.update();

					hermiteDataHelper.visible = true;
					octreeHelper.visible = false;
					box3Helper.visible = false;

				} catch(e) {

					console.error(e);

				}

			},

			"contour": () => {

				this.createHermiteData();
				this.createSVO();
				this.contour();

				octreeHelper.visible = false;
				hermiteDataHelper.visible = false;
				box3Helper.visible = false;

			}

		};

		menu.add(params, "SDF", presets).onChange(params["show SVO"]);

		let folder = menu.addFolder("Octree Helper");
		folder.add(params, "level mask").min(0).max(1 + Math.log2(128)).step(1).onChange(() => {

			let i, l;

			for(i = 0, l = octreeHelper.children.length; i < l; ++i) {

				octreeHelper.children[i].visible = (params["level mask"] >= octreeHelper.children.length || i === params["level mask"]);

			}

		}).listen();

		folder = menu.addFolder("Transformation");

		let subFolder = folder.addFolder("Rotation");
		subFolder.add(this.euler, "x").min(0.0).max(Math.PI * 2).step(0.0001);
		subFolder.add(this.euler, "y").min(0.0).max(Math.PI * 2).step(0.0001);
		subFolder.add(this.euler, "z").min(0.0).max(Math.PI * 2).step(0.0001);

		subFolder = folder.addFolder("Scale");
		subFolder.add(this.scale, "x").min(0.0).max(0.5).step(0.0001);
		subFolder.add(this.scale, "y").min(0.0).max(0.5).step(0.0001);
		subFolder.add(this.scale, "z").min(0.0).max(0.5).step(0.0001);

		folder = menu.addFolder("Material");
		folder.add(material, "metalness").min(0.0).max(1.0).step(0.0001);
		folder.add(material, "roughness").min(0.0).max(1.0).step(0.0001);
		folder.add(material, "clearcoat").min(0.0).max(1.0).step(0.0001);
		folder.add(material, "clearcoatRoughness").min(0.0).max(1.0).step(0.0001);
		folder.add(material, "reflectivity").min(0.0).max(1.0).step(0.0001);
		folder.addColor(params, "color").onChange(() => material.color.setHex(params.color));
		folder.add(material, "wireframe");
		folder.add(material, "flatShading").onChange(() => {

			material.needsUpdate = true;

		});

		menu.add(HermiteData, "resolution", [32, 64, 128]);
		menu.add(VoxelCell, "errorThreshold").min(0.0).max(0.01).step(0.0001);
		menu.add(params, "show SVO");
		menu.add(params, "show Hermite data");
		menu.add(params, "contour");

		folder = menu.addFolder("Render Info");
		folder.add(this, "vertices").listen();
		folder.add(this, "faces").listen();

	}

}
