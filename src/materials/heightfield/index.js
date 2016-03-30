import shader from "./inlined/shader";
import THREE from "three";

/**
 * A heightfield LOD shader material.
 *
 * @class HeightfieldMaterial
 * @constructor
 * @extends ShaderMaterial
 * @params {Texture} heightmap - The heightmap of the terrain.
 * @params {Boolean} usePlaneParameters - Whether plane parameters should be used.
 */

export class HeightfieldMaterial extends THREE.ShaderMaterial {

	constructor(heightmap, usePlaneParameters) {

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

					heightmap: {type: "t", value: heightmap},

					scale: {type: "f", value: 1.0},
					level: {type: "i", value: 0},
					morphingLevels: {type: "i", value: 2},
					resolution: {type: "i", value: 64},

					planeUp: {type: "v3", value: new THREE.Vector3(0, 1, 0)},
					planeAt: {type: "v3", value: new THREE.Vector3(0, 0, 1)},
					planePoint: {type: "v3", value: new THREE.Vector3(0, 0, 0)},

					emissive: {type: "c", value: new THREE.Color()},
					specular: {type: "c", value: new THREE.Color()},
					shininess: {type: "f", value: 1.0}

				}

			]),

			fragmentShader: shader.fragment,
			vertexShader: shader.vertex.main,

			extensions: {
				derivatives: true
			},

			shading: THREE.FlatShading,
			side: THREE.DoubleSide,
			lights: true,
			fog: true

		});

		if(usePlaneParameters) { this.defines.USE_PLANE_PARAMETERS = "1"; }

		// Register custom shader code.
		THREE.ShaderChunk.lod_pars_vertex = shader.vertex.lod_pars;
		THREE.ShaderChunk.lod_vertex = shader.vertex.lod;

	}

}
