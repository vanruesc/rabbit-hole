#ifdef USE_MAP

	vec4 texelColor = texture2DTriplanar(map);

	texelColor = mapTexelToLinear(texelColor);
	diffuseColor *= texelColor;

#endif