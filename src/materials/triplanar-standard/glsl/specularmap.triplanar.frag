float specularStrength;

#ifdef USE_SPECULARMAP

	vec4 texelSpecular = t3( specularMap, triplanarBlend );
	specularStrength = texelSpecular.r;

#else

	specularStrength = 1.0;

#endif