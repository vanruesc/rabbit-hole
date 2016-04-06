vec4 worldPosition = computePosition(vec4(position, 1.0));

//vec3 heightPosition = worldPosition.xyz / 2.0;

worldPosition.y += getHeight(worldPosition.xz / 512.0) * 25.0;

/*float height = getHeight(vec2(0.3565, 0.265), heightPosition) * 0.3 +
	getHeight(vec2(0.07565, 0.0865), heightPosition) * 0.6 +
	getHeight(vec2(0.8, 0.99), heightPosition) * 0.1;*/

//worldPosition.y += height * 10.0 - 10.0 * 0.5;

vec4 mvPosition = viewMatrix * worldPosition;

vWorldPosition = worldPosition.xyz;

gl_Position = projectionMatrix * mvPosition;
