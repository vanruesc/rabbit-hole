vCoords = vec2[3](
	worldPosition.yz * offsetRepeat.zw + offsetRepeat.xy,
	worldPosition.xz * offsetRepeat.zw + offsetRepeat.xy,
	worldPosition.xy * offsetRepeat.zw + offsetRepeat.xy
);

vBlend = computeTriplanarBlend(vNormal);
