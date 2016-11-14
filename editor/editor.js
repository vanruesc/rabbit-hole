import {
	AxisHelper,
	AmbientLight,
	DirectionalLight,
	FlatShading,
	FogExp2,
	OrbitControls,
	PerspectiveCamera,
	Scene,
	SmoothShading,
	WebGLRenderer
} from "three";

import dat from "dat.gui";
import Stats from "stats.js";
// import { OctreeHelper } from "sparse-octree";

import {
	Box,
	// ChunkHelper,
	Terrain
} from "../src";

/**
 * Initialises the stats monitor.
 *
 * @method initStats
 * @private
 * @static
 * @param {Terrain} terrain - The terrain instance.
 * @return {Stats} The stats.
 */

function initStats(terrain) {

	const stats = new Stats();

	const panels = [
		stats.addPanel(new Stats.Panel("CSG", "#ff8", "#221")),
		stats.addPanel(new Stats.Panel("DC", "#f8f", "#212"))
	];

	const times = [
		new Map(),
		new Map()
	];

	let maxDelta = 0;

	stats.showPanel(0);
	stats.dom.id = "stats";

	terrain.addEventListener("modificationstart", function(event) {

		times[0].set(event.chunk, performance.now());

	});

	terrain.addEventListener("extractionstart", function(event) {

		times[1].set(event.chunk, performance.now());

	});

	terrain.addEventListener("modificationend", function(event) {

		const delta = performance.now() - times[0].get(event.chunk);

		if(delta > maxDelta) { maxDelta = delta; }

		panels[0].update(delta, maxDelta);

	});

	terrain.addEventListener("extractionend", function(event) {

		const delta = performance.now() - times[1].get(event.chunk);

		if(delta > maxDelta) { maxDelta = delta; }

		panels[1].update(delta, maxDelta);

	});

	return stats;

}

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
	 */

	static initialise(viewport, aside) {

		const width = window.innerWidth;
		const height = window.innerHeight;
		const aspect = width / height;

		// Scene.

		const scene = new Scene();
		scene.fog = new FogExp2(0xcccccc, 0.002);

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
		const controls = new OrbitControls(camera, renderer.domElement);
		camera.position.set(10, 5, 10);
		camera.lookAt(controls.target);

		scene.add(camera);

		// Helpers.

		scene.add(new AxisHelper());

		// Overlays.

		const gui = new dat.GUI();
		aside.appendChild(gui.domElement.parentNode);

		// Lights.

		const ambientLight = new AmbientLight(0x444444);
		const directionalLight = new DirectionalLight(0xffffff);

		directionalLight.position.set(1, 1, 1);
		directionalLight.target.position.copy(scene.position);

		scene.add(ambientLight);
		scene.add(directionalLight);

		// Terrain.

		const terrain = new Terrain({
			levels: 6,
			chunkSize: 32,
			resolution: 32
		});

		terrain.union(new Box({ origin: [0, 1, 0], halfDimensions: [112, 1, 112] }));
		terrain.union(new Box({ origin: [0, 6, 0], halfDimensions: [64, 1, 64] }));

		scene.add(terrain);

		const stats = initStats(terrain);

		aside.appendChild(stats.dom);

		// Volume octree helper.

		/* const octreeHelper = new OCTREE.OctreeHelper(terrain.volume);

		try {

			octreeHelper.update();

		} catch(error) {

			console.warn(error);

		}

		scene.add(octreeHelper); */

		// Chunk helper.

		/* terrain.addEventListener("modificationend", function(event) {

			const helper = new ChunkHelper(event.chunk);
			helper.gridPoints.visible = false;

			scene.add(helper);

		}); */

		// Configuration.

		const params = {
			flatshading: false,
			wireframe: false
		};

		gui.add(params, "flatshading").onChange(function() {

			const shading = params.flatshading ? FlatShading : SmoothShading;

			terrain.traverse(function(child) {

				child.material.shading = shading;
				child.material.needsUpdate = true;

			});

		});

		gui.add(params, "wireframe").onChange(function() {

			terrain.traverse(function(child) {

				child.material.wireframe = params.wireframe;
				child.material.needsUpdate = true;

			});

		});

		/**
		 * Toggle the visibility of the interface on alt key press.
		 *
		 * @method onkeydown
		 * @private
		 * @static
		 * @param {Event} event - An event.
		 */

		document.addEventListener("keydown", function onkeydown(event) {

			if(event.altKey) {

				event.preventDefault();
				aside.style.visibility = (aside.style.visibility === "hidden") ? "visible" : "hidden";

			}

		});

		/**
		 * Handles browser resizing.
		 *
		 * @method onresize
		 * @static
		 * @param {Event} event - An event.
		 */

		window.addEventListener("resize", function onresize(event) {

			const width = event.target.innerWidth;
			const height = event.target.innerHeight;

			renderer.setSize(width, height);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();

		});

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

			terrain.update(camera);
			renderer.render(scene, camera);

			stats.end();

		}());

	}

}
