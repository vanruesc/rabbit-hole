float metalnessFactor = metalness;

#ifdef USE_METALNESSMAP

	vec4 texelMetalness = texture2DTriplanar(metalnessMap);
	metalnessFactor *= texelMetalness.r;

#endif
