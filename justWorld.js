var worldCanvas, worldStage;

var currentLevel = 0;

function init() {//Draw a square on screen.
    worldCanvas = document.getElementById("myWorldCanvas");
	worldStage = new createjs.Stage(worldCanvas);
	
	switch(currentLevel) {
		case 0: 
			populateLevel_0();
			break;
		default: 
			populateLevel_0();
	}

}

function populateLevel_0() {
	var shape, shapex, shapey, shaper;
	
	shape = new createjs.Shape();
	shapex = worldCanvas.width * Math.random() | 0;
	shapey = worldCanvas.height * Math.random() | 0;
	shaper = 10;
	console.log("Drawing circle at ("+shapex+", "+shapey+").")
	shape.graphics.beginFill('blue').drawCircle(shapex, shapey, shaper);
	shape.on("rollover", function (evt) {
		this.scale = this.originalScale * 1.2;
	});
	shape.moveTo = function(xarg, yarg, t) {
		createjs.Tween.get(shape, {loop:false}).to({x: xarg, y: yarg}, t, createjs.Ease.getPowInOut(4));
	}
	createjs.Ticker.addEventListener("tick", worldStage);

	worldStage.addChild(shape);
	worldStage.update();
	
	shape.moveTo(400,150,10);
	update = true; 

   
}
