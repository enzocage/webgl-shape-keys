function initGL (canvas) {
	var gl;
	
	try {
		gl = WebGLUtils.create3DContext(canvas);
		gl.viewportWidth = canvas.offsetWidth;
		gl.viewportHeight = canvas.offsetWidth;
	} catch (e) { }
	
	if (!gl) {
		alert("I'm sorry I can't start WebGL.");
	}
	
	return gl;
}



function ajaxGET (url, callback) {
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			callback(xmlhttp.responseText);
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function syncGET (url) {
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.open("GET", url, false);
	xmlhttp.send();
	
	if (xmlhttp.readyState==4 && xmlhttp.status==200)
	{
		return xmlhttp.responseText;
	} else {
		return null;
	}
}

function createShaderProgram (gl, vertexURL, fragURL, attributeNames, uniformNames) {
	var vertexShader= createShader(gl, vertexURL, true);
	var fragmentShader = createShader(gl, fragURL, false);

	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("I'm sorry I could't create the shader program.");
	}
	
	gl.useProgram(shaderProgram);

	shaderProgram.attributes = {};
	for(i in attributeNames) {
		var a = attributeNames[i];
		shaderProgram.attributes[a] = gl.getAttribLocation(shaderProgram, a);
	}

	shaderProgram.uniforms = {};
	for(i in uniformNames) {
		var u = uniformNames[i];
		shaderProgram.uniforms[u] = gl.getUniformLocation(shaderProgram, u);
	}
	
	return shaderProgram;
}

function createShader(gl, url, isVertexShader) {
	var shaderStr = syncGET(url);
	
	var shader;
	
	if(isVertexShader)
		shader = gl.createShader(gl.VERTEX_SHADER);
	else
		shader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(shader, shaderStr);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("I'm sorry the shader had a problem while compiling:\n" + gl.getShaderInfoLog(shader));
		return null;
	}
	
	return shader;
}

function startAnimation(gl, callback) {
	//Set up the timing information
    var fps = 0;
    var frameCount = 0;
    var startTime = new Date().getTime();
    var lastFPSUpdateTime = startTime;
    var lastFrameTime = startTime;

    //Start the main animation
    pulse();

    function pulse(time) {
        requestAnimFrame(pulse);
        
        var timing = {
            fps: fps,
            totalTime: time-startTime,
            frameTime: time-lastFrameTime,
            currentTime: time
        }
        
        callback(gl, timing);
        
        if(time - lastFPSUpdateTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            lastFPSUpdateTime = time;
        }
        
        frameCount++;
        lastFrameTime = time;
    }
}

function degToRadian(degree) {
	return (degree/180.0)*Math.PI;
}
