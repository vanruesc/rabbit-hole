#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )

	varying vec3 vBlend;
	varying vec2 vCoords[3];

	vec3 computeTriplanarBlend( vec3 normal ) {

		// Raise each component of the normal vector to the 4th power.
		vec3 blend = saturate( abs( normal ) - 0.5 );
		blend *= blend;
		blend *= blend;

		// Normalize the result by dividing by the sum of its components.
		blend /= dot( blend, vec3( 1.0 ) );

		// GPU Gems 3 - Chapter 1
		//vec3 blend = abs( normal );
		//blend = ( blend - 0.2 ) * 7.0;  
		//blend = max( blend, 0.0 );
		//blend /= ( blend.x + blend.y + blend.z );

		return blend;

	}

#endif
