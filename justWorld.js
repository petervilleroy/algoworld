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
    movex = 300;
    movey = 150;

	console.log("Drawing circle at ("+shapex+", "+shapey+").")
	shape.graphics.beginFill('blue').drawCircle(shapex, shapey, shaper);
	shape.on("rollover", function (evt) {
		this.scale = this.originalScale * 1.2;
    });
    worldStage.addChild(shape);
	
	createjs.Tween.get(shape).to({x: movex-shape.x, y: movey-shape.y}, 1500, createjs.Ease.getPowInOut(2));
	
	createjs.Ticker.addEventListener("tick", worldStage);

	worldStage.update();
	
	update = true; 

   
}
