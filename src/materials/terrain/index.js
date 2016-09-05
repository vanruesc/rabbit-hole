import THREE from "three";

import fragment from "./glsl/shader.frag";
import vertex from "./glsl/shader.vert";

/**
 * A terrain material. Uses triplanar texture mapping to texture generated
 * surfaces and supports multiple textures.
 *
 * @class TerrainMaterial
 * @submodule materials
 * @extends ShaderMaterial
 * @constructor
 */

export class TerrainMaterial extends THREE.ShaderMaterial {

	constructor() {

		super({

			type: "TerrainMaterial",

			uniforms: {

				tDiffuse: { value: null },
				opacity: { value: 1.0 }

			},

			fragmentShader: fragment,
			vertexShader: vertex

		});

	}

}
