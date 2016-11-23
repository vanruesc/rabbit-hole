#ifdef USE_NORMALMAP

	uniform sampler2D normalMap;
	uniform vec2 normalScale;

	// Per-Pixel Tangent Space Normal Mapping
	// http://hacksoflife.blogspot.ch/2009/11/per-pixel-tangent-space-normal-mapping.html

	vec3 perturbNormal2Arb(vec3 eye_pos, vec3 surf_norm) {

		vec3 mapN = t3(normalMap).xyz * 2.0 - 1.0;
		mapN.xy = normalScale * mapN.xy;

		return normalize(mapN);

	}

#endif
