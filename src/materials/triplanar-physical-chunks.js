import { ShaderChunk } from "three";

import alphamapTriplanarFragment from "./glsl/triplanar-physical/alphamap.triplanar.frag";
import emissivemapTriplanarFragment from "./glsl/triplanar-physical/emissivemap.triplanar.frag";
import mapTriplanarParsFragment from "./glsl/triplanar-physical/map.triplanar.pars.frag";
import mapTriplanarFragment from "./glsl/triplanar-physical/map.triplanar.frag";
import metalnessmapTriplanarFragment from "./glsl/triplanar-physical/metalnessmap.triplanar.frag";
import normalTriplanarFragment from "./glsl/triplanar-physical/normal.triplanar.frag";
import normalmapTriplanarParsFragment from "./glsl/triplanar-physical/normalmap.triplanar.pars.frag";
import roughnessmapTriplanarFragment from "./glsl/triplanar-physical/roughnessmap.triplanar.frag";
import specularmapTriplanarFragment from "./glsl/triplanar-physical/specularmap.triplanar.frag";
import triplanarParsFragment from "./glsl/triplanar-physical/triplanar.pars.frag";
import triplanarParsVertex from "./glsl/triplanar-physical/triplanar.pars.vert";
import triplanarVertex from "./glsl/triplanar-physical/triplanar.vert";

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
