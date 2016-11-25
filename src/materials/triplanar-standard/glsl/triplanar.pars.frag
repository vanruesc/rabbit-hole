#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )

	varying vec3 vBlend;
	varying vec2 vCoords[3];

	vec4 t3(sampler2D mapX, sampler2D mapY, sampler2D mapZ) {

		vec4 xAxis = texture2D( mapX, vCoords[0] );
		vec4 yAxis = texture2D( mapY, vCoords[1] );
		vec4 zAxis = texture2D( mapZ, vCoords[2] );

		return (
			xAxis * vBlend.x +
			yAxis * vBlend.y +
			zAxis * vBlend.z
		);

	}

	vec4 t3(sampler2D mapX, sampler2D mapYZ) {

		return t3(mapX, mapYZ, mapYZ);

	}

	vec4 t3(sampler2D mapXYZ) {

		return t3(mapXYZ, mapXYZ, mapXYZ);

	}

#endif
