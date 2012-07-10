precision mediump float;

varying vec3 vNormal;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void) {
	float diffuseWeight = max(dot(vNormal, vec3(-0.25, -0.25, 1.0)), 0.0);
	vec3 lightWeight= vec3(0.2, 0.2, 0.2) + vec3(0.8, 0.8, 0.8) * diffuseWeight;
	
	vec4 temp = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
	gl_FragColor = vec4( temp.rgb * lightWeight , 1.0 );
}
