vec4 worldPosition = computePosition(position);

vUv = worldPosition.xz / 512.0 * offsetRepeat.zw + offsetRepeat.xy;

vec4 heightInfo = getHeightInfo(vUv);

#ifndef FLAT_SHADED

	vNormal = heightInfo.xyz;

#endif

worldPosition.y += heightInfo.w * heightScale;

vWorldPosition = worldPosition.xyz;

vec4 mvPosition = viewMatrix * worldPosition;

gl_Position = projectionMatrix * mvPosition;
