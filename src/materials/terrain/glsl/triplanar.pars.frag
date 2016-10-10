varying vec2 vCoords[3];
varying vec3 vBlend;

vec4 texture2DTriplanar(sampler2D map) {

	vec4 xAxisTexel = texture2D(map, vCoords[0]);
	vec4 yAxisTexel = texture2D(map, vCoords[1]);
	vec4 zAxisTexel = texture2D(map, vCoords[2]);

	return (xAxisTexel * vBlend.x + yAxisTexel * vBlend.y + zAxisTexel * vBlend.z);

}
