#ifdef USE_MAP

	#ifdef USE_MAP_Z

		vec4 texelColor = t3( map, mapY, mapZ );

	#elif USE_MAP_Y

		vec4 texelColor = t3( map, mapY );

	#else

		vec4 texelColor = t3( map );

	#endif

	texelColor = mapTexelToLinear( texelColor );
	diffuseColor *= texelColor;

#endif
