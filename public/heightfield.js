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
		//texture.format = THREE.LuminanceFormat;
		//texture.needsUpdate = true;
		assets.heightmap = texture;

	});

});

function setupScene(assets) {

	var viewport = document.getElementById("viewport");
	viewport.removeChild(viewport.children[0]);

	// Renderer and Scene.

	var renderer = new THREE.WebGLRenderer({antialias: true, logarithmicDepthBuffer: true});
	//renderer.shadowMap.enabled = true;
	//renderer.shadowMap.type = THREE.PCFShadowMap;
	renderer.setClearColor(0x000000);
	renderer.setSize(window.innerWidth, window.innerHeight);
	viewport.appendChild(renderer.domElement);

	var scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0xffeeee, 0.0);

	// Camera.

	var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 20000);
	var controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 7, 0);
	controls.damping = 0.2;
	controls.maxDistance = 2000;
	camera.position.set(-3, 8, -3);
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
	var ambientLight = new THREE.AmbientLight(0x552a41);
	var directionalLight = new THREE.DirectionalLight(0xffbbaa);

	//hemisphereLight.position.set(0, 500, 0);

	directionalLight.position.set(1500, 200, 2000);
	directionalLight.target.position.copy(scene.position);
	//directionalLight.castShadow = true;

	//scene.add(hemisphereLight);
	scene.add(ambientLight);
	scene.add(directionalLight);

	// Helpers.

	var axis = new THREE.AxisHelper(10);
	//scene.add(axis);

	// Sky.

	camera.add(assets.sky);

	// Random objects.

	/*object = new THREE.Object3D();

	var i, mesh;
	var geometry = new THREE.SphereBufferGeometry(1, 4, 4);
	var material = new THREE.MeshPhongMaterial({color: 0xffffff, shading: THREE.FlatShading});

	for(i = 0; i < 10; ++i) {

		material = new THREE.MeshPhongMaterial({color: 0xffffff * Math.random(), shading: THREE.FlatShading});

		mesh = new THREE.Mesh(geometry, material);
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		mesh.position.set(Math.random() - 0.5, Math.random() + 0.75, Math.random() - 0.5).normalize();
		mesh.position.multiplyScalar(Math.random() * 2);
		mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
		mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 0.1;
		object.add(mesh);

	}

	scene.add(object);*/

	// Terrain.

	var terrain = new RABBITHOLE.LODGrid(assets.heightmap, 500, 10, 128, 2);
	terrain.traverse(function(child) {
		//child.receiveShadow = true;
		child.material.uniforms.diffuse.value.setHex(0xffee66);
		child.material.uniforms.emissive.value.setHex(0x1a1000);
		child.material.uniforms.specular.value.setHex(0xffbb00);
		child.material.uniforms.shininess.value = 22.0;
	});

	camera.add(terrain);

	// Configuration.

	var params = {
		"wireframe": terrain.material.wireframe,
		"resolution": Math.round(Math.log(terrain.resolution) / Math.log(2)),
		"scale": terrain.tileScale,
		"levels": terrain.levels,
		"morphing levels": terrain.morphingLevels
	};

	gui.add(params, "resolution").min(4).max(11).step(1).onChange(function() { terrain.resolution = Math.pow(2, params["resolution"]); terrain.generate(); });
	gui.add(params, "scale").min(1).max(2000).step(1).onChange(function() { terrain.tileScale = params["scale"]; });
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

		//terrain.offset.x = camera.position.x;
		//terrain.offset.y = camera.position.z;

		stats.end();

	}());

}
