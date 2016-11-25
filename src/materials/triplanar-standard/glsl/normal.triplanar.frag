#ifdef FLAT_SHADED

	// Workaround for Adreno/Nexus5 not able able to do dFdx( vViewPosition ) ...

	vec3 fdx = vec3( dFdx( vViewPosition.x ), dFdx( vViewPosition.y ), dFdx( vViewPosition.z ) );
	vec3 fdy = vec3( dFdy( vViewPosition.x ), dFdy( vViewPosition.y ), dFdy( vViewPosition.z ) );
	vec3 normal = normalize( cross( fdx, fdy ) );

#else

	vec3 normal = normalize( vNormal ) * flipNormal;

#endif

#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )

	vec3 triplanarBlend = computeTriplanarBlend( vModelNormal );

#endif

#ifdef USE_NORMALMAP

	normal = perturbNormal2Arb( normal, triplanarBlend );

#endif
