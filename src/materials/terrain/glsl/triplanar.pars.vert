varying vec2 vCoords[3];
varying vec3 vBlend;

/* vec3 computeTriplanarBlend(vec3 normal) {

	vec3 blend = abs(normal);

	// Force the weights to sum to 1.
	blend = normalize(max(blend, 0.00001));
	blend /= (blend.x + blend.y + blend.z);

	return blend;

} */

vec3 computeTriplanarBlend(vec3 normal) {

	vec3 flip = ivec3(normal.x < 0.0, normal.y >= 0.0, normal.z < 0.0);

	// Raise each component of the normal vector to the 4th power.
	vec3 blend = saturate(abs(normal) - 0.5);
	blend *= blend;
	blend *= blend;

	// Normalize the result by dividing by the sum of its components.
	blend /= dot(blend, vec3(1.0));

	return blend;

}
