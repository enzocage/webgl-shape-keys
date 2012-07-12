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

function createTexture(gl, url) {
	texture = gl.createTexture();
	texture.image = new Image();
	
	texture.image.onload = function () {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.bindTexture(gl.TEXTURE_2D, null);
	};

	texture.image.src = url;
	
	return texture;
}

function createModel(gl, url, models) {
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			var modelJSON = JSON.parse(xmlhttp.responseText);
	
			var model = {};
			
			model.faceCount = modelJSON.faceCount;
			model.relativeKeys = modelJSON.relativeKeys;
			
			//Each shape key has both the vertices and the vertex normals
			model.shapeKeyBuffers = [];

			for(i = 0; i < model.relativeKeys.length; i++) {
				model.shapeKeyBuffers[i] = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, model.shapeKeyBuffers[i]);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelJSON.shapeKeys[i]), gl.STATIC_DRAW);
			}
			
			if(modelJSON.textureCoords.length > 0) {
				model.textureBuffer = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, model.textureBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelJSON.textureCoords), gl.STATIC_DRAW);
			}
			
			models.push(model);
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
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
