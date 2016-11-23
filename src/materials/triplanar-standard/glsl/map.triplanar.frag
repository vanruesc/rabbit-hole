#ifdef USE_MAP

	vec4 texelColor = t3(map);

	texelColor = mapTexelToLinear(texelColor);
	diffuseColor *= texelColor;

#endif
