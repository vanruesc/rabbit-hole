#ifdef USE_FOG

	#define LOG2 1.442695
	#define whiteCompliment(a) (1.0 - saturate(a))

	uniform vec3 fogColor;

	#ifdef FOG_EXP2

		uniform float fogDensity;

	#else

		uniform float fogNear;
		uniform float fogFar;

	#endif

#endif

#ifdef USE_LOGDEPTHBUF

	uniform float logDepthBufFC;

	#ifdef USE_LOGDEPTHBUF_EXT

		varying float vFragDepth;

	#endif

#endif

uniform sampler2D tHeight;

uniform float worldSize;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vMorphFactor;
varying vec2 vUvs[3];

float getHeight() {

	// Sample multiple times to get more detail.
	float h = worldSize * texture2D(tHeight, vUvs[0]).r;
	h += 64.0 * texture2D(tHeight, vUvs[1]).r;
	h += 4.0 * texture2D(tHeight, vUvs[2]).r;

	// Square the height, leads to more rocky looking terrain.
	return h * h / 2000.0;

}

vec3 getNormal() {

	/* Differentiate the position vector (this will give us two vectors perpendicular to the surface)
	 * Before differentiating, add the displacement based on the height from the height map. By doing this
	 * calculation here, rather than in the vertex shader, we get a per-fragment calculated normal, rather
	 * than a per-vertex normal. This improves the look of distant low-vertex terrain.
	 */

	float height = getHeight();
	vec3 p = vec3(vPosition.xy, height);
	vec3 dPositiondx = dFdx(p);
	vec3 dPositiondy = dFdy(p);

	// The normal is the cross product of the differentials.
	return normalize(cross(dPositiondx, dPositiondy));

}

void main() {

	// Base color
	vec3 light = vec3(80.0, 150.0, 50.0);
	//vec3 color = colorForScale();
	vec3 color = vec3(0.27, 0.27, 0.17);
	//color = vec3(vMorphFactor);

	vec3 normal = getNormal();

	// Incident light.
	float incidence = dot(normalize(light - vPosition), normal);
	incidence = clamp(incidence, 0.0, 1.0);
	incidence = pow(incidence, 0.02);
	color = mix(vec3(0, 0, 0), color, incidence);

	// Mix in specular light.
	vec3 halfVector = normalize(normalize(cameraPosition - vPosition) + normalize(light - vPosition));
	float specular = dot(normal, halfVector);
	specular = max(0.0, specular);
	specular = pow(specular, 25.0);
	color = mix(color, vec3(0, 1.0, 1.0), 0.5 * specular);

	// Add more specular light for fun.
	vec3 light2 = vec3(420.0, 510.0, 30.0);
	halfVector = normalize(normalize(cameraPosition - vPosition) + normalize(light2 - vPosition));
	specular = dot(normal, halfVector);
	specular = max(0.0, specular);
	specular = pow(specular, 3.0);
	color = mix(color, vec3(1.0, 0.3, 0), 0.5 * specular);

	vec3 light3 = vec3(0.0, 0.0, 1000.0);
	halfVector = normalize(normalize(cameraPosition - vPosition) + normalize(light3 - vPosition));
	specular = dot(normal, halfVector);
	specular = max(0.0, specular);
	specular = pow(specular, 130.0);
	color = mix(color, vec3(1.0, 0.5, 0), specular);

	// Add height fog.
	float heightFogFactor = clamp(1.0 - vPosition.z / 25.0, 0.0, 1.0);
	heightFogFactor = pow(heightFogFactor, 5.4);
	color = mix(color, vec3(1.0, 0.9, 0.8), heightFogFactor);

	#if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)

		gl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;

	#endif

	#ifdef USE_FOG

		#ifdef USE_LOGDEPTHBUF_EXT

			float depth = gl_FragDepthEXT / gl_FragCoord.w;

		#else

			float depth = gl_FragCoord.z / gl_FragCoord.w;

		#endif

		#ifdef FOG_EXP2

			float fogFactor = whiteCompliment(exp2(-fogDensity * fogDensity * depth * depth * LOG2));

		#else

			float fogFactor = smoothstep(fogNear, fogFar, depth);

		#endif

		color = mix(color, fogColor, fogFactor);

	#endif

	gl_FragColor = vec4(color, 1.0);

}
