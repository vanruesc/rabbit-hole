#ifdef USE_EMISSIVEMAP

	vec4 emissiveColor = t3(emissiveMap);

	emissiveColor.rgb = emissiveMapTexelToLinear(emissiveColor).rgb;

	totalEmissiveRadiance *= emissiveColor.rgb;

#endif
