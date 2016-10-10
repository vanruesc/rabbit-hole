#ifdef USE_EMISSIVEMAP

	vec4 emissiveColor = texture2DTriplanar(emissiveMap);

	emissiveColor.rgb = emissiveMapTexelToLinear(emissiveColor).rgb;

	totalEmissiveRadiance *= emissiveColor.rgb;

#endif
