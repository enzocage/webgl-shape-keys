precision mediump float;

varying vec3 vNormal;

void main(void) {
	float diffuseWeight = max(dot(vNormal, vec3(-0.25, -0.25, 1.0)), 0.0);
	vec3 lightWeight= vec3(0.2, 0.2, 0.2) + vec3(0.8, 0.8, 0.8) * diffuseWeight;
	
	gl_FragColor = vec4( vec3(0.8, 0.8, 0.8) * lightWeight , 1.0 );
}
