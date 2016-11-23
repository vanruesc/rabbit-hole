#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )

	varying vec2 vCoords[3];

	#ifndef FLAT_SHADED

		varying vec3 vBlend;

		vec4 t3(sampler2D map) {

			return (
				texture2D(map, vCoords[0]) * vBlend.x +
				texture2D(map, vCoords[1]) * vBlend.y +
				texture2D(map, vCoords[2]) * vBlend.z
			);

		}

	#else

		vec4 t3(sampler2D map) {

			return (
				texture2D(map, vCoords[0]) +
				texture2D(map, vCoords[1]) +
				texture2D(map, vCoords[2])
			) / 3.0;

		}

	#endif

#endif
