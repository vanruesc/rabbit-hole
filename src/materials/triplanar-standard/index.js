import {
	Color,
	ShaderChunk,
	ShaderLib,
	ShaderMaterial,
	Vector2
} from "three";

import fragment from "./glsl/shader.frag";
import vertex from "./glsl/shader.vert";
import alphamapTriplanarFragment from "./glsl/alphamap.triplanar.frag";
import emissivemapTriplanarFragment from "./glsl/emissivemap.triplanar.frag";
import mapTriplanarFragment from "./glsl/map.triplanar.frag";
import metalnessmapTriplanarFragment from "./glsl/metalnessmap.triplanar.frag";
import normalTriplanarFragment from "./glsl/normal.triplanar.frag";
import normalmapTriplanarParsFragment from "./glsl/normalmap.triplanar.pars.frag";
import roughnessmapTriplanarFragment from "./glsl/roughnessmap.triplanar.frag";
import specularmapTriplanarFragment from "./glsl/specularmap.triplanar.frag";
import triplanarParsFragment from "./glsl/triplanar.pars.frag";
import triplanarParsVertex from "./glsl/triplanar.pars.vert";
import triplanarVertex from "./glsl/triplanar.vert";

// Register custom shader code snippets.
Object.assign(ShaderChunk, {
	"alphamap_triplanar_fragment": alphamapTriplanarFragment,
	"emissivemap_triplanar_fragment": emissivemapTriplanarFragment,
	"map_triplanar_fragment": mapTriplanarFragment,
	"metalnessmap_triplanar_fragment": metalnessmapTriplanarFragment,
	"normal_triplanar_fragment": normalTriplanarFragment,
	"normalmap_triplanar_pars_fragment": normalmapTriplanarParsFragment,
	"roughnessmap_triplanar_fragment": roughnessmapTriplanarFragment,
	"specularmap_triplanar_fragment": specularmapTriplanarFragment,
	"triplanar_pars_fragment": triplanarParsFragment,
	"triplanar_pars_vertex": triplanarParsVertex,
	"triplanar_vertex": triplanarVertex
});

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

			uniforms: ShaderLib.standard.uniforms,

			fragmentShader: fragment,
			vertexShader: vertex

		});

		this.fog = true;
		this.lights = true;

		this.color = new Color(0xffffff); // diffuse
		this.roughness = 0.5;
		this.metalness = 0.5;

		this.map = null;

		this.lightMap = null;
		this.lightMapIntensity = 1.0;

		this.emissive = new Color(0x000000);
		this.emissiveIntensity = 1.0;
		this.emissiveMap = null;

		this.normalMap = null;
		this.normalScale = new Vector2(1, 1);

		this.roughnessMap = null;

		this.metalnessMap = null;

		this.specularMap = null;

		this.alphaMap = null;

		this.envMap = null;
		this.envMapIntensity = 1.0;

		this.refractionRatio = 0.98;

	}

}

MeshTriplanarStandardMaterial.prototype.isMeshStandardMaterial = true;
