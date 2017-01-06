import {
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
import { Terrain } from "../src";
import { Editor } from "./editor.js";
import { TerrainStats } from "./terrain-stats.js";
import { Controls } from "./controls/controls.js";

/**
 * The main application.
 *
 * @class App
 * @static
 */

export class App {

	/**
	 * Initialises the editor app.
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
		scene.fog = new FogExp2(0xb5c1af, 0.0025);
		scene.background = assets.has("sky") ? assets.get("sky") : null;

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
		camera.position.set(20, 1, 20);
		controls.focus(scene.position);
		controls.movementSpeed = 4;
		controls.boostSpeed = 20;

		scene.add(camera);

		// GUI.

		const gui = new dat.GUI({ autoPlace: false });
		aside.appendChild(gui.domElement);

		// Lights.

		const hemisphereLight = new HemisphereLight(0x3284ff, 0xffc87f, 0.6);
		const directionalLight = new DirectionalLight(0xfff4e5);

		hemisphereLight.position.set(0, 1, 0).multiplyScalar(50);
		directionalLight.position.set(1.75, 1.75, -1).multiplyScalar(50);

		scene.add(directionalLight);
		scene.add(hemisphereLight);

		// Terrain.

		const terrain = new Terrain({
			resolution: 64,
			chunkSize: 32,
			iterations: 100
		});

		terrain.material.uniforms.diffuse.value.setHex(0xffffff);
		terrain.material.uniforms.offsetRepeat.value.set(0, 0, 0.5, 0.5);

		terrain.material.uniforms.roughness.value = 0.6;
		terrain.material.uniforms.metalness.value = 0.2;

		// terrain.material.envMap = assets.get("sky");

		terrain.material.setMaps(
			assets.get("diffuseXZ"),
			assets.get("diffuseY"),
			assets.get("diffuseXZ")
		);

		terrain.material.setNormalMaps(
			assets.get("normalmapXZ"),
			assets.get("normalmapY"),
			assets.get("normalmapXZ")
		);

		terrain.load(assets.get("terrain"));

		scene.add(terrain.object);

		// Stats monitor.

		const terrainStats = new TerrainStats(terrain);
		terrainStats.configure(gui);

		const stats = terrainStats.stats;
		stats.dom.id = "stats";
		stats.showPanel(3);

		aside.appendChild(stats.dom);

		// Editor.

		const editor = new Editor(terrain, camera, renderer.domElement);
		editor.setEnabled(false);
		editor.configure(gui);

		scene.add(editor.cursor);
		scene.add(editor.octreeHelper);
		scene.add(editor.chunkHelper);

		// Additional configuration.

		(function() {

			const params = {

				terrain: {
					diffuse: terrain.material.uniforms.diffuse.value.getHex(),
					roughness: terrain.material.uniforms.roughness.value,
					metalness: terrain.material.uniforms.metalness.value,
					flatshading: (terrain.material.shading === FlatShading),
					wireframe: terrain.material.wireframe
				},

				directionalLight: {
					color: directionalLight.color.getHex(),
					intensity: directionalLight.intensity
				},

				hemisphereLight: {
					color: hemisphereLight.color.getHex(),
					groundColor: hemisphereLight.groundColor.getHex(),
					intensity: hemisphereLight.intensity
				}

			};

			let folder = gui.addFolder("Terrain");

			let subfolder = folder.addFolder("Material");

			subfolder.addColor(params.terrain, "diffuse").onChange(function() {

				terrain.material.uniforms.diffuse.value.setHex(params.terrain.diffuse);

			});

			subfolder.add(params.terrain, "roughness").min(0.0).max(1.0).step(0.01).onChange(function() {

				terrain.material.uniforms.roughness.value = params.terrain.roughness;

			});

			subfolder.add(params.terrain, "metalness").min(0.0).max(1.0).step(0.01).onChange(function() {

				terrain.material.uniforms.metalness.value = params.terrain.metalness;

			});

			subfolder.add(params.terrain, "flatshading").onChange(function() {

				const shading = params.terrain.flatshading ? FlatShading : SmoothShading;

				terrain.material.shading = shading;
				terrain.material.needsUpdate = true;

			});

			subfolder.add(params.terrain, "wireframe").onChange(function() {

				terrain.material.wireframe = params.terrain.wireframe;
				terrain.material.needsUpdate = true;

			});

			folder.add(terrain.object, "visible");

			folder = gui.addFolder("Light");

			subfolder = folder.addFolder("Directional");

			subfolder.addColor(params.directionalLight, "color").onChange(function() {

				directionalLight.color.setHex(params.directionalLight.color);

			});

			subfolder.add(params.directionalLight, "intensity").min(0.0).max(1.0).step(0.01).onChange(function() {

				directionalLight.intensity = params.directionalLight.intensity;

			});

			subfolder = folder.addFolder("Hemisphere");

			subfolder.addColor(params.hemisphereLight, "color").onChange(function() {

				hemisphereLight.color.setHex(params.hemisphereLight.color);

			});

			subfolder.addColor(params.hemisphereLight, "groundColor").onChange(function() {

				hemisphereLight.color.setHex(params.hemisphereLight.groundColor);

			});

			subfolder.add(params.hemisphereLight, "intensity").min(0.0).max(1.0).step(0.01).onChange(function() {

				hemisphereLight.intensity = params.hemisphereLight.intensity;

			});

			folder = gui.addFolder("Info");

			folder.add(renderer.info.memory, "geometries").listen();
			folder.add(renderer.info.memory, "textures").listen();
			folder.add(renderer.info.render, "calls").listen();
			folder.add(renderer.info.render, "vertices").listen();
			folder.add(renderer.info.render, "faces").listen();
			folder.add(renderer.info.render, "points").listen();

		}());

		/**
		 * Toggles between camera mode and edit mode.
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
					editor.setEnabled(!flag);

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
