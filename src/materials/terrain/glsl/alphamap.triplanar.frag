#ifdef USE_ALPHAMAP

	diffuseColor.a *= texture2DTriplanar(alphaMap).g;

#endif
