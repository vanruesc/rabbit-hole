#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )

	varying vec3 vModelNormal;
	varying vec2 vCoords[3];

	vec3 computeTriplanarBlend(vec3 normal) {

		// Raise each component of the normal vector to the 4th power.
		vec3 blend = saturate(abs(normal) - 0.5);
		blend *= blend;
		blend *= blend;

		// Normalize the result by dividing by the sum of its components.
		blend /= dot(blend, vec3(1.0));

		return blend;

	}

	vec4 t3(sampler2D map, vec3 blend) {

		vec4 xAxis = texture2D(map, vCoords[0]);
		vec4 yAxis = texture2D(map, vCoords[1]);
		vec4 zAxis = texture2D(map, vCoords[2]);

		return (
			xAxis * blend.x +
			yAxis * blend.y +
			zAxis * blend.z
		);

	}

#endif
