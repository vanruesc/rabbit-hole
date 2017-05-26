#ifdef USE_MAP

	uniform sampler2D map;

	#ifdef USE_MAP_Y

		uniform sampler2D mapY;

	#endif

	#ifdef USE_MAP_Z

		uniform sampler2D mapZ;

	#endif

#endif
