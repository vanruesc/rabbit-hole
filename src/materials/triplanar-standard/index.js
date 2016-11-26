import { ShaderLib, ShaderMaterial, Uniform } from "three";

import fragment from "./glsl/shader.frag";
import vertex from "./glsl/shader.vert";

// Register custom shader chunks.
import "./chunks.js";

/**
 * A physically based shader material that uses triplanar texture mapping.
 *
 * @class MeshTriplanarStandardMaterial
 * @submodule materials
 * @extends ShaderMaterial
 * @constructor
 */

export class MeshTriplanarStandardMaterial extends ShaderMaterial {

	constructor() {

		super({

			type: "MeshTriplanarStandardMaterial",

			defines: { STANDARD: "" },

			uniforms: {

				mapY: new Uniform(null),
				mapZ: new Uniform(null),

				normalMapY: new Uniform(null),
				normalMapZ: new Uniform(null)

			},

			fragmentShader: fragment,
			vertexShader: vertex,

			lights: true,
			fog: true

		});

		// Clone uniforms to avoid conflicts with built-in materials.
		const source = ShaderLib.standard.uniforms;
		const target = this.uniforms;

		Object.keys(source).forEach(function(key) {

			const value = source[key].value;
			const uniform = new Uniform(source[key].value);

			Object.defineProperty(target, key, {

				value: (value === null) ? uniform : uniform.clone()

			});

		});

	}

	/**
	 * Defines up to three diffuse maps.
	 *
	 * @method setMaps
	 * @param {Texture} [mapX] - The map to use for the X plane.
	 * @param {Texture} [mapY] - The map to use for the Y plane.
	 * @param {Texture} [mapZ] - The map to use for the Z plane.
	 */

	setMaps(mapX, mapY, mapZ) {

		const defines = this.defines;
		const uniforms = this.uniforms;

		if(mapX !== undefined) {

			defines.USE_MAP = "";
			uniforms.map.value = mapX;

		}

		if(mapY !== undefined) {

			defines.USE_MAP_Y = "";
			uniforms.mapY.value = mapY;

		}

		if(mapZ !== undefined) {

			defines.USE_MAP_Z = "";
			uniforms.mapZ.value = mapZ;

		}

		this.needsUpdate = true;

	}

	/**
	 * Defines up to three normal maps.
	 *
	 * @method setNormalMaps
	 * @param {Texture} [mapX] - The map to use for the X plane.
	 * @param {Texture} [mapY] - The map to use for the Y plane.
	 * @param {Texture} [mapZ] - The map to use for the Z plane.
	 */

	setNormalMaps(mapX, mapY, mapZ) {

		const defines = this.defines;
		const uniforms = this.uniforms;

		if(mapX !== undefined) {

			defines.USE_NORMALMAP = "";
			uniforms.normalMap.value = mapX;

		}

		if(mapY !== undefined) {

			defines.USE_NORMALMAP_Y = "";
			uniforms.normalMapY.value = mapY;

		}

		if(mapZ !== undefined) {

			defines.USE_NORMALMAP_Z = "";
			uniforms.normalMapZ.value = mapZ;

		}

		this.needsUpdate = true;

	}

}
