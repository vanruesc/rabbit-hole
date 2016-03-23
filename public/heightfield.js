window.addEventListener("load", function loadAssets() {

	window.removeEventListener("load", loadAssets);

	var loadingManager = new THREE.LoadingManager();
	var textureLoader = new THREE.TextureLoader(loadingManager);
	var cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

	var assets = {};

	loadingManager.onProgress = function(item, loaded, total) {

		if(loaded === total) { setupScene(assets); }

	};

	var path = "textures/skies/sunset/";
	var format = ".png";
	var urls = [
		path + "px" + format, path + "nx" + format,
		path + "py" + format, path + "ny" + format,
		path + "pz" + format, path + "nz" + format
	];

	cubeTextureLoader.load(urls, function(textureCube) {

		var shader = THREE.ShaderLib.cube;
		shader.uniforms.tCube.value = textureCube;

		var skyBoxMaterial = new THREE.ShaderMaterial( {
			fragmentShader: shader.fragmentShader,
			vertexShader: shader.vertexShader,
			uniforms: shader.uniforms,
			depthWrite: false,
			side: THREE.BackSide,
			fog: false
		});

		assets.sky = new THREE.Mesh(new THREE.BoxGeometry(20000, 20000, 20000), skyBoxMaterial);

	});

	textureLoader.load("textures/ocean_heightmap.jpg", function(texture) {

		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		assets.heightMap = texture;

	});

});

function setupScene(assets) {

	var viewport = document.getElementById("viewport");
	viewport.removeChild(viewport.children[0]);

	// Renderer and Scene.

	var renderer = new THREE.WebGLRenderer({antialias: true, logarithmicDepthBuffer: true});
	var scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x000000, 0.0001);
	renderer.setClearColor(0x000000);
	renderer.setSize(window.innerWidth, window.innerHeight);
	viewport.appendChild(renderer.domElement);

	// Camera.

	var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 20000);
	var controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 5, 0);
	controls.damping = 0.2;
	controls.maxDistance = 2000;
	camera.position.set(-100, 25, -100);
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

	var ambientLight = new THREE.AmbientLight(0x666666);
	var directionalLight = new THREE.DirectionalLight(0xffbbaa);

	directionalLight.position.set(-1, 1, 1);
	directionalLight.target.position.copy(scene.position);

	scene.add(directionalLight);
	scene.add(ambientLight);

	// Sky.

	camera.add(assets.sky);

	// Terrain.

	// heightmap, worldSize, levels, resolution
	var terrain = new RABBITHOLE.HeightField(assets.heightMap, 256, 2, 16);
	terrain.rotation.set(-Math.PI / 2, 0, -Math.PI);

	scene.add(terrain);

	// Configuration.

	/*var params = {
		"hi": true
	};

	gui.add(params, "resolution").min(0.0).max(1.0).step(0.01).onChange(function() { pass.resolutionScale = params["resolution"]; composer.setSize(); });
	gui.add(params, "blurriness").min(0.0).max(3.0).step(0.1).onChange(function() { pass.blurriness = params["blurriness"]; });
	gui.add(params, "strength").min(0.0).max(3.0).step(0.01).onChange(function() { pass.combineMaterial.uniforms.opacity2.value = params["strength"]; });

	var f = gui.addFolder("Luminance");
	f.add(params, "distinction").min(1.0).max(10.0).step(0.1).onChange(function() { pass.luminosityMaterial.uniforms.distinction.value = params["distinction"]; });
	f.open();

	gui.add(params, "blend").onChange(function() {

		pass.combineMaterial.uniforms.opacity1.value = params["blend"] ? 1.0 : 0.0;

	});*/

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

		//terrain.offset.x = camera.position.x;
		//terrain.offset.y = camera.position.z;

		stats.end();

	}());

}
