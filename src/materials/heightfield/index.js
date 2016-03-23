import shader from "./inlined/shader";
import THREE from "three";

/**
 * A heightmap shader material for LOD terrain rendering.
 *
 * @class HeightFieldMaterial
 * @constructor
 * @extends ShaderMaterial
 */

export class HeightFieldMaterial extends THREE.ShaderMaterial {

	constructor(resolution) {

		super({

			defines: {

				RESOLUTION: (resolution !== undefined) ? resolution.toFixed(1) : "128.0"

			},

			uniforms: {

				tDiffuse: {type: "t", value: null},
				tHeight: {type: "t", value: null},

				globalOffset: {type: "v3", value: null},
				tileOffset: {type: "v2", value: new THREE.Vector2()},

				worldSize: {type: "f", value: 1024.0},
				scale: {type: "f", value: 1.0},
				edgeMorph: {type: "i", value: 1}

			},

			fragmentShader: shader.fragment,
			vertexShader: shader.vertex,

			extensions: {
				derivatives: true
			}

		});

	}

}
