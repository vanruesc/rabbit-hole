#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )

	vCoords[0] = worldPosition.zy * offsetRepeat.zw + offsetRepeat.xy;
	vCoords[1] = worldPosition.xz * offsetRepeat.zw + offsetRepeat.xy;
	vCoords[2] = worldPosition.xy * offsetRepeat.zw + offsetRepeat.xy;

	#ifndef FLAT_SHADED

		vBlend = computeTriplanarBlend(vNormal);

	#endif

#endif
