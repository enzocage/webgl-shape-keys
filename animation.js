function smoothStep(x) {
	return (x) * (x) * (3 - 2 * (x));
}

function animate(gl, timing) {
	//Blink
	if(timing.currentTime < blinkEnd) {
		var weight = (blinkEnd-timing.currentTime)/900.0;
		weight = 2*smoothStep(weight);

		if(weight < 1.0) {
			weight = 1.0 - weight;
		} else {
			weight = weight - 1.0;
		}

		for(i = 0; i < 4; i++)
			gl.models["EyeLid.00"+i+".js"].weights[1] = weight;
	}
	
	//Happy
	if(timing.currentTime < happyEnd) {
		var weight = (happyEnd-timing.currentTime)/2000.0;
		weight = 2*smoothStep(weight);

		if(weight > 1.0) {
			weight = 2.0 - weight;
		}

		gl.models["Face.js"].weights[6] = weight;
		gl.models["Face.js"].weights[7] = weight;
		gl.models["Face.js"].weights[11] = weight;
		gl.models["Face.js"].weights[12] = weight;
		gl.models["Face.js"].weights[13] = 0.522*weight;
	}
	
	//Angry
	if(timing.currentTime < angryEnd) {
		var weight = (angryEnd-timing.currentTime)/2000.0;
		weight = 2*smoothStep(weight);

		if(weight > 1.0) {
			weight = 2.0 - weight;
		}

		gl.models["Face.js"].weights[4] = weight;
		gl.models["Face.js"].weights[5] = weight;
		gl.models["Face.js"].weights[10] = 0.6*weight;
		gl.models["Face.js"].weights[14] = weight;
	}
}

var blinkEnd = new Date().getTime();
function blinkClicked() {
	blinkEnd = new Date().getTime()+900;
}
var happyEnd = new Date().getTime();
function happyClicked() {
	happyEnd = new Date().getTime()+2000;
}
var angryEnd = new Date().getTime();
function angryClicked() {
	angryEnd = new Date().getTime()+2000;
}
