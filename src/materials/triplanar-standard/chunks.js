import { ShaderChunk } from "three";

import alphamapTriplanarFragment from "./glsl/alphamap.triplanar.frag";
import emissivemapTriplanarFragment from "./glsl/emissivemap.triplanar.frag";
import mapTriplanarParsFragment from "./glsl/map.triplanar.pars.frag";
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
	"map_triplanar_pars_fragment": mapTriplanarParsFragment,
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
