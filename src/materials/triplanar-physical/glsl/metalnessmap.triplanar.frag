float metalnessFactor = metalness;

#ifdef USE_METALNESSMAP

	vec4 texelMetalness = t3( metalnessMap );
	metalnessFactor *= texelMetalness.r;

#endif
