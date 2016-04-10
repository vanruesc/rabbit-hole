import THREE from "three";

import fragment from "./glsl/shader.frag";
import vertex from "./glsl/shader.vert";
import lodPars from "./glsl/lod.pars.vert";
import lod from "./glsl/lod.vert";

/**
 * A heightfield LOD shader material.
 *
 * @class HeightfieldMaterial
 * @constructor
 * @extends ShaderMaterial
 * @params {Boolean} usePlaneParameters - Whether plane parameters should be used to adjust the terrain rotation.
 */

export class HeightfieldMaterial extends THREE.ShaderMaterial {

	constructor(usePlaneParameters) {

		super({

			defines: {

				RESOLUTION: "64.0"

			},

			uniforms: THREE.UniformsUtils.merge([

				THREE.UniformsLib.common,
				THREE.UniformsLib.normalmap,
				THREE.UniformsLib.fog,
				THREE.UniformsLib.lights,

				{

					heightMap: {type: "t", value: null},

					level: {type: "i", value: 0},
					morphingLevels: {type: "i", value: 2},
					scale: {type: "f", value: 1.0},
					heightScale: {type: "f", value: 30.0},

					planeUp: {type: "v3", value: new THREE.Vector3(0, 1, 0)},
					planeAt: {type: "v3", value: new THREE.Vector3(0, 0, 1)},
					planePoint: {type: "v3", value: new THREE.Vector3(0, 0, 0)},

					texelSize: {type: "v2", value: new THREE.Vector2()},

					emissive: {type: "c", value: new THREE.Color()},
					specular: {type: "c", value: new THREE.Color()},
					shininess: {type: "f", value: 1.0}

				}

			]),

			fragmentShader: fragment,
			vertexShader: vertex,

			extensions: {
				derivatives: true
			},

			shading: THREE.FlatShading,
			lights: true,
			fog: true

		});

		if(usePlaneParameters) { this.defines.USE_PLANE_PARAMETERS = "1"; }

		// Register custom shader code.
		THREE.ShaderChunk.lod_pars_vertex = lodPars;
		THREE.ShaderChunk.lod_vertex = lod;

	}

	/**
	 * A height map.
	 *
	 * @property heightMap
	 * @type Texture
	 */

	get heightMap() { return this.uniforms.heightMap.value; }

	set heightMap(x) {

		this.uniforms.heightMap.value = x;
		this.uniforms.texelSize.value.set(1.0 / x.image.width, 1.0 / x.image.height);
	}

	/**
	 * A color map.
	 *
	 * @property map
	 * @type Texture
	 */

	get map() { return this.uniforms.map.value; }

	set map(x) {

		this.uniforms.map.value = x;
	}

	/**
	 * A normal map.
	 *
	 * @property normalMap
	 * @type Texture
	 */

	get normalMap() { return this.uniforms.normalMap.value; }

	set normalMap(x) {

		this.uniforms.normalMap.value = x;
	}

}
