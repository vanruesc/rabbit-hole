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

		/*const path = "textures/skies/sunset/";
		const format = ".png";
		const urls = [
			path + "px" + format, path + "nx" + format,
			path + "py" + format, path + "ny" + format,
			path + "pz" + format, path + "nz" + format
		];

		cubeTextureLoader.load(urls, function(textureCube) {

			const shader = THREE.ShaderLib.cube;
			shader.uniforms.tCube.value = textureCube;

			const skyBoxMaterial = new THREE.ShaderMaterial( {
				fragmentShader: shader.fragmentShader,
				vertexShader: shader.vertexShader,
				uniforms: shader.uniforms,
				depthWrite: false,
				side: THREE.BackSide,
				fog: false
			});

			assets.sky = new THREE.Mesh(new THREE.BoxGeometry(2000, 2000, 2000), skyBoxMaterial);

		});*/

		textureLoader.load("textures/terrain.png", function(texture) {

			texture.magFilter = texture.minFilter = THREE.NearestFilter;
			assets.heightMap = texture;

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

		const renderer = new THREE.WebGLRenderer({antialias: true, logarithmicDepthBuffer: true});
		renderer.setClearColor(0x000000);
		renderer.setSize(window.innerWidth, window.innerHeight);
		viewport.appendChild(renderer.domElement);

		const scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2(0x000000, 0.0001);

		// Sky.

		//scene.background = assets.sky;

		// Camera.

		const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
		const controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.target.set(0, 0, 0);
		camera.position.set(1, 1, 3);
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

		// Helper.

		scene.add(new THREE.AxisHelper(1));

		// Lights.

		const hemisphereLight = new THREE.HemisphereLight(0xffffee, 0x666666, 0.6);
		const directionalLight = new THREE.DirectionalLight(0xffbbaa);

		directionalLight.position.set(-1, 1, -1);
		directionalLight.target.position.copy(scene.position);

		scene.add(directionalLight);
		scene.add(hemisphereLight);

		// Terrain.

		const terrain = new RABBITHOLE.Terrain({
			levels: 6,
			chunkSize: 32
		});

		terrain.volume.addSphere(new THREE.Vector3(0, 0, 0), 1.0);

		scene.add(terrain);

		let t0;

		terrain.addEventListener("update", function(event) {

			t0 = performance.now();

		});

		terrain.addEventListener("commit", function(event) {

			params["update time"] = (((performance.now() - t0) * 100.0) / 100.0).toFixed(2) + " ms";

		});

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
		 * @param {DOMHighResTimeStamp} now - Indicaties the time when requestAnimationFrame fired.
		 */

		(function render(now) {

			requestAnimationFrame(render);

			stats.begin();

			terrain.update(camera);

			renderer.render(scene, camera);

			stats.end();

		}());

	}

}());
