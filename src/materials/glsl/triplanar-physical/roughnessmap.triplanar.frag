float roughnessFactor = roughness;

#ifdef USE_ROUGHNESSMAP

	vec4 texelRoughness = t3( roughnessMap );
	roughnessFactor *= texelRoughness.r;

#endif
