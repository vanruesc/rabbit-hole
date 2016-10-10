(function() { "use strict";

	/**
	 * Loads assets.
	 *
	 * @method loadAssets
	 */

	window.addEventListener("load", function loadAssets() {

		window.removeEventListener("load", loadAssets);

		const loadingManager = new THREE.LoadingManager();
		const textureLoader = new THREE.TextureLoader(loadingManager);
		const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

		const assets = {};

		loadingManager.onProgress = function(item, loaded, total) {

			if(loaded === total) { setupScene(assets); }

		};

		const path = "textures/skies/sunset/";
		const format = ".png";
		const urls = [
			path + "px" + format, path + "nx" + format,
			path + "py" + format, path + "ny" + format,
			path + "pz" + format, path + "nz" + format
		];

		cubeTextureLoader.load(urls, function(textureCube) {

			assets.sky = textureCube;

		});

		textureLoader.load("textures/terrain.png", function(texture) {

			texture.magFilter = texture.minFilter = THREE.NearestFilter;
			assets.heightmap = texture;

		});

	});

	/**
	 * Creates the scene and initiates the render loop.
	 *
	 * @method setupScene
	 * @param {Object} assets - Preloaded assets.
	 */

	function setupScene(assets) {

		const viewport = document.getElementById("viewport");
		viewport.removeChild(viewport.children[0]);

		// Renderer and Scene.

		const renderer = new THREE.WebGLRenderer({logarithmicDepthBuffer: true, antialias: true});
		renderer.setClearColor(0x000000);
		renderer.setSize(window.innerWidth, window.innerHeight);
		viewport.appendChild(renderer.domElement);

		const scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2(0x000000, 0.0025);

		// Sky.

		scene.background = assets.sky;

		// Camera.

		const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
		const controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.target.set(16, 16, 16);
		camera.position.set(-15, 15, -20);
		camera.lookAt(controls.target);

		scene.add(camera);

		// Overlays.

		const stats = new Stats();
		stats.showPanel(0);
		stats.dom.id = "stats";
		const aside = document.getElementById("aside");
		aside.style.visibility = "visible";
		aside.appendChild(stats.dom);

		const gui = new dat.GUI();
		aside.appendChild(gui.domElement.parentNode);

		// Hide interface on alt key press.
		document.addEventListener("keydown", function(event) {

			if(event.altKey) {

				event.preventDefault();
				aside.style.visibility = (aside.style.visibility === "hidden") ? "visible" : "hidden";

			}

		});

		// Lights.

		const hemisphereLight = new THREE.HemisphereLight(0xffffee, 0x666666, 0.6);
		const directionalLight = new THREE.DirectionalLight(0xffbbaa);

		directionalLight.position.set(1440, 200, 2000);
		directionalLight.target.position.copy(scene.position);

		scene.add(directionalLight);
		scene.add(hemisphereLight);

		// Terrain.

		const terrain = new RABBITHOLE.Terrain();

		terrain.extract(32, new RABBITHOLE.Box(
			//new THREE.Vector3(4, 5, 4),
			//new THREE.Vector3(2, 2, 2)
			new THREE.Vector3(16, 6, 16),
			new THREE.Vector3(5, 5, 5)
		));

		terrain.extract(32, new RABBITHOLE.Sphere(
			new THREE.Vector3(16, 26, 16),
			5
		));

		terrain.extract(32, new RABBITHOLE.Torus(
			new THREE.Vector3(16, 16, 16),
			6, 3
		));

		scene.add(terrain);

		console.log(terrain);

		// Configuration.

		const params = {
			"flat shading": false,
			"wireframe": false,
			"update time": ""
		};

		gui.add(params, "flat shading").onChange(function() {

			const shading = params["flat shading"] ? THREE.FlatShading : THREE.SmoothShading;

			terrain.traverse(function(child) {

				child.material.shading = shading;
				child.material.needsUpdate = true;

			});

		});

		gui.add(params, "wireframe").onChange(function() {

			terrain.traverse(function(child) {

				child.material.wireframe = params["wireframe"];
				child.material.needsUpdate = true;

			});

		});

		let f = gui.addFolder("Workers");
		f.add(params, "update time").listen();
		f.open();

		const times = new Map();

		terrain.addEventListener("update", function(event) { times.set(event.mesh, performance.now()); });

		terrain.addEventListener("commit", function(event) {

			let t0 = times.get(event.mesh);

			params["update time"] = (((performance.now() - t0) * 100.0) / 100.0).toFixed(2) + " ms";

			times.delete(event.mesh);

		});

		/**
		 * Handles resizing.
		 *
		 * @method resize
		 */

		window.addEventListener("resize", function resize() {

			const width = window.innerWidth;
			const height = window.innerHeight;

			renderer.setSize(width, height);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();

		});

		/**
		 * The main render loop.
		 *
		 * @method render
		 * @param {DOMHighResTimeStamp} now - The time when requestAnimationFrame fired.
		 */

		(function render(now) {

			requestAnimationFrame(render);

			stats.begin();

			renderer.render(scene, camera);

			stats.end();

		}());

	}

}());
