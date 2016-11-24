import {
	AxisHelper,
	Clock,
	DirectionalLight,
	FlatShading,
	FogExp2,
	HemisphereLight,
	PerspectiveCamera,
	Scene,
	SmoothShading,
	WebGLRenderer
} from "three";

import dat from "dat.gui";
// import { Box, ChunkHelper, Terrain } from "../src";
import { Box, Terrain } from "../src";
import { TerrainRaycaster } from "./terrain-raycaster.js";
// import { OctreeHelper } from "./octree-helper.js";
import { TerrainStats } from "./terrain-stats.js";
import { Controls } from "./controls/controls.js";

/**
 * A volume editor.
 *
 * @class Editor
 * @static
 */

export class Editor {

	/**
	 * Initialises the editor.
	 *
	 * @method initialise
	 * @static
	 * @param {HTMLElement} viewport - The viewport.
	 * @param {HTMLElement} aside - A secondary container.
	 * @param {Map} assets - Preloaded assets.
	 */

	static initialise(viewport, aside, assets) {

		const width = window.innerWidth;
		const height = window.innerHeight;
		const aspect = width / height;

		// Clock.

		const clock = new Clock();

		// Scene.

		const scene = new Scene();
		scene.fog = new FogExp2(0xeeeeee, 0.00025);

		// Renderer.

		const renderer = new WebGLRenderer({
			logarithmicDepthBuffer: true,
			antialias: true
		});

		renderer.setSize(width, height);
		renderer.setClearColor(scene.fog.color);
		renderer.setPixelRatio(window.devicePixelRatio);
		viewport.appendChild(renderer.domElement);

		// Camera and Controls.

		const camera = new PerspectiveCamera(50, aspect, 0.1, 1000);
		const controls = new Controls(camera, renderer.domElement);
		camera.position.set(10, 5, 10);
		controls.focus(scene.position);
		controls.movementSpeed = 4;
		controls.boostSpeed = 16;

		scene.add(camera);

		// Sky.

		scene.background = assets.get("sky");

		// Helpers.

		scene.add(new AxisHelper());

		// GUI.

		const gui = new dat.GUI();
		aside.appendChild(gui.domElement.parentNode);

		// Lights.

		const hemisphereLight = new HemisphereLight(0x3284ff, 0xffc87f, 0.6);
		const directionalLight = new DirectionalLight(0xfff4e5);

		hemisphereLight.position.set(0, 1, 0).multiplyScalar(50);
		directionalLight.position.set(-1, 1.75, 1).multiplyScalar(50);

		scene.add(hemisphereLight);
		scene.add(directionalLight);

		// Terrain.

		const terrain = new Terrain({
			levels: 6,
			chunkSize: 32,
			resolution: 64
		});

		terrain.material.map = assets.get("tiles-diffuse");
		terrain.material.normalMap = assets.get("tiles-normalmap");

		/* scene.add(new Mesh(
			new SphereBufferGeometry(24, 32, 32),
			terrain.material
		)); */

		terrain.union(new Box({ origin: [0, 0, 0], halfDimensions: [4, 2, 4] }));
		// terrain.union(new Box({ origin: [0, 1.4, 0], halfDimensions: [1, 0.1, 1] }));

		/* terrain.union(new Box({ origin: [-16, 2, -16], halfDimensions: [8, 1, 8] }));
		terrain.union(new Box({ origin: [-16, 4, -16], halfDimensions: [8, 1, 8] }));
		terrain.union(new Box({ origin: [-16, 6, -16], halfDimensions: [8, 1, 8] }));
		terrain.union(new Box({ origin: [-16, 32, -16], halfDimensions: [8, 1, 8] }));
		terrain.union(new Sphere({ origin: [16, 16, 16], radius: 6 })); */

		// terrain.union(new Box({ origin: [0, 6, 0], halfDimensions: [64, 1, 64] }));

		scene.add(terrain);

		// Stats monitor.

		const stats = new TerrainStats(terrain);
		aside.appendChild(stats.dom);

		// Terrain picking.

		const raycaster = new TerrainRaycaster(terrain, camera, renderer.domElement);
		raycaster.configure(gui);
		raycaster.setEnabled(false);

		scene.add(raycaster.cursor);

		// Volume octree helper.

		/* const octreeHelper = new OctreeHelper(terrain.volume);

		scene.add(octreeHelper); */

		// Chunk helper.

		terrain.addEventListener("modificationend", function(event) {

			// const helper = new ChunkHelper(event.chunk);

			// scene.add(helper);

		});

		// Configuration.

		const params = {
			flatshading: false,
			wireframe: false
		};

		const folder = gui.addFolder("Material");

		folder.add(params, "flatshading").onChange(function() {

			const shading = params.flatshading ? FlatShading : SmoothShading;

			terrain.traverse(function(child) {

				child.material.shading = shading;
				child.material.needsUpdate = true;

			});

		});

		folder.add(params, "wireframe").onChange(function() {

			terrain.traverse(function(child) {

				child.material.wireframe = params.wireframe;
				child.material.needsUpdate = true;

			});

		});

		/**
		 * Toggles the visibility of the interface on alt key press.
		 *
		 * @method onKeyDown
		 * @private
		 * @static
		 * @param {Event} event - An event.
		 */

		document.addEventListener("keydown", (function() {

			let flag = false;

			return function onKeyDown(event) {

				if(event.altKey) {

					event.preventDefault();
					controls.setEnabled(flag);
					raycaster.setEnabled(!flag);

					flag = !flag;

				}

			};

		}()));

		/**
		 * Handles browser resizing.
		 *
		 * @method onResize
		 * @private
		 * @static
		 * @param {Event} event - An event.
		 */

		window.addEventListener("resize", (function() {

			let id = 0;

			function handleResize(event) {

				const width = event.target.innerWidth;
				const height = event.target.innerHeight;

				renderer.setSize(width, height);
				camera.aspect = width / height;
				camera.updateProjectionMatrix();

				id = 0;

			}

			return function onResize(event) {

				if(id === 0) {

					id = setTimeout(handleResize, 66, event);

				}

			};

		}()));

		/**
		 * The main render loop.
		 *
		 * @method render
		 * @private
		 * @static
		 * @param {DOMHighResTimeStamp} now - An execution timestamp.
		 */

		(function render(now) {

			requestAnimationFrame(render);

			stats.begin();

			controls.update(clock.getDelta());

			terrain.update(camera);

			renderer.render(scene, camera);

			stats.end();

		}());

	}

}
