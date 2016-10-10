float roughnessFactor = roughness;

#ifdef USE_ROUGHNESSMAP

	vec4 texelRoughness = texture2DTriplanar(roughnessMap);
	roughnessFactor *= texelRoughness.r;

#endif
