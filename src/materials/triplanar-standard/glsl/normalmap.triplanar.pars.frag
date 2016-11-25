#ifdef USE_NORMALMAP

	uniform sampler2D normalMap;
	uniform vec2 normalScale;

	// Triplanar Tangent Space Normal Mapping
	// https://www.clicktorelease.com/code/bumpy-metaballs/

	vec3 perturbNormal2Arb( vec3 normal, vec3 blend ) {

		vec3 mapN = t3( normalMap, blend ).xyz * 2.0 - 1.0;
		mapN.xy *= normalScale;

		vec3 tangentX = vec3( normal.x, - normal.z, normal.y );
		vec3 tangentY = vec3( normal.z, normal.y, - normal.x );
		vec3 tangentZ = vec3( - normal.y, normal.x, normal.z );

		vec3 tangent = (
			tangentX * blend.x +
			tangentY * blend.y +
			tangentZ * blend.z
		); 

		mat3 tsb = mat3(
			normalize( tangent ),
			normalize( cross( normal, tangent ) ),
			normal
		);

		return normalize( tsb * normalize( mapN ) );

	}

#endif
