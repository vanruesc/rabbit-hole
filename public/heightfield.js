window.addEventListener("load", function loadAssets() {

	window.removeEventListener("load", loadAssets);

	var loadingManager = new THREE.LoadingManager();
	var textureLoader = new THREE.TextureLoader(loadingManager);
	var cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

	var assets = {};

	loadingManager.onProgress = function(item, loaded, total) {

		if(loaded === total) { setupScene(assets); }

	};

	textureLoader.load("textures/ocean_heightmap.jpg", function(texture) {

		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.format = THREE.LuminanceFormat;
		assets.heightMap = texture;

	});

	textureLoader.load("textures/ocean_normalmap.jpg", function(texture) {

		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		assets.normalMap = texture;

	});

	textureLoader.load("textures/ocean_diffusemap.jpg", function(texture) {

		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		assets.colorMap = texture;

	});

});

function setupScene(assets) {

	var viewport = document.getElementById("viewport");
	viewport.removeChild(viewport.children[0]);

	// Renderer and Scene.

	var renderer = new THREE.WebGLRenderer({antialias: true, logarithmicDepthBuffer: true});
	//renderer.shadowMap.enabled = true;
	//renderer.shadowMap.type = THREE.PCFShadowMap;
	renderer.setClearColor(0x33667f);
	renderer.setSize(window.innerWidth, window.innerHeight);
	viewport.appendChild(renderer.domElement);

	var scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x33667f, 0.0025);

	// Camera.

	var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 20000);
	var controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 20, 0);
	controls.damping = 0.2;
	controls.maxDistance = 2000;
	camera.position.set(-140, 120, -140);
	camera.lookAt(controls.target);

	scene.add(camera);

	// Overlays.

	var stats = new Stats();
	stats.setMode(0);
	var aside = document.getElementById("aside");
	aside.style.visibility = "visible";
	aside.appendChild(stats.domElement);

	var gui = new dat.GUI();
	aside.appendChild(gui.domElement.parentNode);

	// Hide interface on alt key press.
	document.addEventListener("keydown", function(event) {

		if(event.altKey) {

			event.preventDefault();
			aside.style.visibility = (aside.style.visibility === "hidden") ? "visible" : "hidden";

		}

	});

	// Lights.

	//var hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0xddee50, 0.3);
	var ambientLight = new THREE.AmbientLight(0xcccccc);
	var directionalLight = new THREE.DirectionalLight(0xffbbaa);

	//hemisphereLight.position.set(0, 500, 0);

	directionalLight.position.set(1500, 200, 2000);
	directionalLight.target.position.copy(scene.position);
	//directionalLight.castShadow = true;

	//scene.add(hemisphereLight);
	scene.add(ambientLight);
	scene.add(directionalLight);

	// Helpers.

	//var axis = new THREE.AxisHelper(10);
	//scene.add(axis);

	// Terrain.

	var terrain = new RABBITHOLE.LODGrid({
		heightMap: assets.heightMap,
		map: assets.colorMap,
		normalMap: assets.normalMap,
		baseScale: 500,
		levels: 7,
		resolution: 128,
		morphingLevels: 2,
		heightScale: 30
	});

	terrain.traverse(function(child) {
		//child.receiveShadow = true;
		child.material.uniforms.diffuse.value.setHex(0xffffff);
		child.material.uniforms.emissive.value.setHex(0x000000);
		child.material.uniforms.specular.value.setHex(0x111111);
		child.material.uniforms.shininess.value = 6.0;
	});

	camera.add(terrain);

	// Configuration.

	var params = {
		"wireframe": terrain.material.wireframe,
		"resolution": Math.round(Math.log(terrain.resolution) / Math.log(2)),
		"scale": terrain.baseScale,
		"levels": terrain.levels,
		"morphing levels": terrain.morphingLevels,
		"height scale": terrain.heightScale
	};

	gui.add(params, "resolution").min(4).max(9).step(1).onChange(function() { terrain.resolution = Math.pow(2, params["resolution"]); terrain.generate(); });
	gui.add(params, "scale").min(1).max(2000).step(1).onChange(function() { terrain.baseScale = params["scale"]; });
	gui.add(params, "height scale").min(0.0).max(255.0).step(0.1).onChange(function() { terrain.heightScale = params["height scale"]; });
	gui.add(params, "levels").min(1).max(15).step(1).onChange(function() { terrain.levels = params["levels"]; terrain.generate(); });
	gui.add(params, "morphing levels").min(0).max(2).step(1).onChange(function() { terrain.morphingLevels = params["morphing levels"]; });
	gui.add(params, "wireframe").onChange(function() { terrain.traverse(function(child) { child.material.wireframe = params["wireframe"]; }); });

	/**
	 * Handles resizing.
	 */

	window.addEventListener("resize", function resize() {

		var width = window.innerWidth;
		var height = window.innerHeight;

		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();

	});

	/**
	 * Animation loop.
	 */

	(function render(now) {

		requestAnimationFrame(render);

		stats.begin();

		renderer.render(scene, camera);

		stats.end();

	}());

}
