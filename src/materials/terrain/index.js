import THREE from "three";
import fragment from "./glsl/shader.frag";
import vertex from "./glsl/shader.vert";
// import x from "./glsl/x.vert";
// import y from "./glsl/y.vert";

/**
 * A terrain material that uses triplanar texture mapping.
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

			uniforms: THREE.UniformsUtils.clone(THREE.ShaderLib.standard.uniforms),

			fragmentShader: fragment,
			vertexShader: vertex

		});

		// Register custom shader code snippets.
		// THREE.ShaderChunk.x = x;
		// THREE.ShaderChunk.y = y;

	}

}
