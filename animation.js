function smoothStep(x) {
	return (x) * (x) * (3 - 2 * (x));
}

function animate(gl, timing) {
	//Blink
	if(timing.currentTime < blinkEnd) {
		var blinkWeight = (blinkEnd-timing.currentTime)/800.0;
		blinkWeight = 2*smoothStep(blinkWeight);

		if(blinkWeight < 1.0) {
			blinkWeight = 1.0 - blinkWeight;
		} else {
			blinkWeight = blinkWeight - 1.0;
		}

		for(i = 0; i < 4; i++)
			gl.models["EyeLid.00"+i+".js"].weights[1] = blinkWeight;
	}
}

var blinkEnd = new Date().getTime();
function blinkClicked() {
	blinkEnd = new Date().getTime()+800;
}
