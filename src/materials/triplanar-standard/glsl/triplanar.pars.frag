#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )

	varying vec3 vBlend;
	varying vec2 vCoords[3];

	vec2 t3UV( vec3 normal ) {

		vec3 r = reflect( normalize( vViewPosition ), normal );
		float m = 2.0 * sqrt( r.x * r.x + r.y * r.y + ( r.z + 1.0 ) * ( r.z + 1.0 ) );

		return vec2( r.x / m + 0.5, r.y / m + 0.5 );

	}

	vec4 t3(sampler2D map) {

		vec4 xAxis = texture2D( map, vCoords[0] );
		vec4 yAxis = texture2D( map, vCoords[1] );
		vec4 zAxis = texture2D( map, vCoords[2] );

		return (
			xAxis * vBlend.x +
			yAxis * vBlend.y +
			zAxis * vBlend.z
		);

	}

#endif
