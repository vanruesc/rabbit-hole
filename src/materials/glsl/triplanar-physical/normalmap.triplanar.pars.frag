#ifdef USE_NORMALMAP

	uniform sampler2D normalMap;
	uniform vec2 normalScale;

	#ifdef USE_NORMALMAP_Y

		uniform sampler2D normalMapY;

	#endif

	#ifdef USE_NORMALMAP_Z

		uniform sampler2D normalMapZ;

	#endif

	// Triplanar Tangent Space Normal Mapping
	// Jaume Sánchez (https://www.clicktorelease.com/code/bumpy-metaballs/)
	// Mel (http://irrlicht.sourceforge.net/forum/viewtopic.php?t=48043)

	vec3 perturbNormal2Arb( vec3 normal ) {

		// Not sure why this doesn't work. Needs more testing!
		/*vec3 tangentX = vec3( normal.x, - normal.z, normal.y );
		vec3 tangentY = vec3( normal.z, normal.y, - normal.x );
		vec3 tangentZ = vec3( - normal.y, normal.x, normal.z );

		vec3 tangent = (
			tangentX * vBlend.x +
			tangentY * vBlend.y +
			tangentZ * vBlend.z
		); 

		mat3 tsb = mat3(
			normalize( tangent ),
			normalize( cross( normal, tangent ) ),
			normalize( normal )
		);*/

		mat3 tbn = mat3(
			normalize( vec3( normal.y + normal.z, 0.0, normal.x ) ),
			normalize( vec3( 0.0, normal.x + normal.z, normal.y ) ),
			normal
		);

		#ifdef USE_NORMALMAP_Z

			vec3 mapN = t3( normalMap, normalMapY, normalMapZ ).xyz;

		#elif USE_NORMALMAP_Y

			vec3 mapN = t3( normalMap, normalMapY ).xyz;

		#else

			vec3 mapN = t3( normalMap ).xyz;

		#endif

		// Expand and scale the vector.
		mapN = mapN * 2.0 - 1.0;
		mapN.xy *= normalScale;

		return normalize( tbn * mapN );

	}

#endif
