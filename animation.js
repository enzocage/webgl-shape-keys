function smoothStep(x) {
	return (x) * (x) * (3 - 2 * (x));
}

function getWeight(t) {
	var weight = 2*smoothStep(t);

	if(weight > 1.0) {
		weight = 2.0 - weight;
	}
	
	return weight;
}

function getWeightWithPause(t) {
	var weight = 3*smoothStep(t);

	if(weight > 1.0 && weight < 2.0) {
		weight = 1.0;
	} else if(weight > 2.0) {
		weight = 3.0 - weight;
	}
	
	return weight;
}

function animate(gl, timing) {
	//Reset all weights
	for(mIndex in gl.models)
		for(wIndex in gl.models[mIndex].weights)
			gl.models[mIndex].weights[wIndex] = gl.models[mIndex].defaultWeights[wIndex];
	
	//Blink
	if(timing.currentTime < blinkEnd) {
		var weight = (blinkEnd-timing.currentTime)/900.0;
		weight = 1.0 - getWeight(weight);

		for(i = 0; i < 4; i++)
			gl.models["EyeLid.00"+i+".js"].weights[1] = weight;
	}
	
	//Happy
	if(timing.currentTime < happyEnd) {
		var weight = (happyEnd-timing.currentTime)/2000.0;
		weight = getWeightWithPause(weight);
		weightEyes = 1.0 + 0.1*(weight);

		gl.models["Face.js"].weights[6] = weight;
		gl.models["Face.js"].weights[7] = weight;
		gl.models["Face.js"].weights[11] = weight;
		gl.models["Face.js"].weights[12] = weight;
		gl.models["Face.js"].weights[13] = 0.522*weight;
		
		for(i = 0; i < 4; i++)
			gl.models["EyeLid.00"+i+".js"].weights[1] = weightEyes;
	}
	
	//Angry
	if(timing.currentTime < angryEnd) {
		var weight = (angryEnd-timing.currentTime)/2000.0;
		weight = getWeightWithPause(weight);
		weightEyes = 0.7 + 0.3*(1.0 - weight);

		gl.models["Face.js"].weights[4] = weight;
		gl.models["Face.js"].weights[5] = weight;
		gl.models["Face.js"].weights[10] = 0.6*weight;
		gl.models["Face.js"].weights[1] = weight;
		
		for(i = 0; i < 4; i++)
			gl.models["EyeLid.00"+i+".js"].weights[1] = weightEyes;
	}
	
	//Sad
	if(timing.currentTime < sadEnd) {
		var weight = (sadEnd-timing.currentTime)/2400.0;
		weight = getWeightWithPause(weight);

		gl.models["Face.js"].weights[8] = weight;
		gl.models["Face.js"].weights[9] = weight;
		gl.models["Face.js"].weights[10] = 0.4*weight;
		gl.models["Face.js"].weights[13] = weight;
		gl.models["Face.js"].weights[1] = weight;
	}
	
	//Puff Cheeks
	if(timing.currentTime < puffEnd) {
		var weight = (puffEnd-timing.currentTime)/1300.0;
		weight = getWeightWithPause(weight);
		
		gl.models["Face.js"].weights[2] = weight;
		gl.models["Face.js"].weights[3] = weight;
	}
	
	//Kiss
	if(timing.currentTime < kissEnd) {
		var weight = (kissEnd-timing.currentTime)/1300.0;
		weightMouth = getWeightWithPause(weight);
		weightEyes = 1.0 - getWeightWithPause(weight);
		
		gl.models["Face.js"].weights[14] = weightMouth;

		for(i = 0; i < 4; i++)
			gl.models["EyeLid.00"+i+".js"].weights[1] = weightEyes;
	}
}

var blinkEnd = new Date().getTime();
function blinkClicked() {
	resetTime();
	blinkEnd = new Date().getTime()+900;
}
var happyEnd = new Date().getTime();
function happyClicked() {
	resetTime();
	happyEnd = new Date().getTime()+2000;
}
var angryEnd = new Date().getTime();
function angryClicked() {
	resetTime();
	angryEnd = new Date().getTime()+2000;
}
var sadEnd = new Date().getTime();
function sadClicked() {
	resetTime();
	sadEnd = new Date().getTime()+2400;
}
var puffEnd = new Date().getTime();
function puffClicked() {
	resetTime();
	puffEnd = new Date().getTime()+1300;
}
var kissEnd = new Date().getTime();
function kissClicked() {
	resetTime();
	kissEnd = new Date().getTime()+1300;
}

function resetTime() {
	curTime = new Date().getTime();
	blinkEnd = curTime - 1000;
	happyEnd = curTime - 1000;
	angryEnd = curTime - 1000;
	sadEnd = curTime - 1000;
	puffEnd = curTime - 1000;
	kissEnd = curTime - 1000;
}
