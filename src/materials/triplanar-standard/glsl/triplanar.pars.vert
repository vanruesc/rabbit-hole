#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )

	varying vec2 vCoords[3];

	#ifndef FLAT_SHADED

		varying vec3 vBlend;

		vec3 computeTriplanarBlend(vec3 normal) {

			// Raise each component of the normal vector to the 4th power.
			vec3 blend = saturate(abs(normal) - 0.5);
			blend *= blend;
			blend *= blend;

			// Normalize the result by dividing by the sum of its components.
			blend /= dot(blend, vec3(1.0));

			return blend;

		}

	#endif

#endif
