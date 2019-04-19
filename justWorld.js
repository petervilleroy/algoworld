var worldCanvas, worldStage;
var spriteContainer;
var currentLevel = 0;

function init() {//Draw a square on screen.
    worldCanvas = document.getElementById("myWorldCanvas");
	worldStage = new createjs.Stage(worldCanvas);
    spriteContainer = new createjs.Container();
    
	switch(currentLevel) {
		case 0: 
			populateLevel_0();
			break;
		default: 
			populateLevel_0();
	}
};

function populateLevel_0() {
	var shape, shapex, shapey, shaper;
	
	shape = new createjs.Shape();
	shapex = worldCanvas.width * Math.random() | 0;
	shapey = worldCanvas.height * Math.random() | 0;
    shaper = 10;
    movex = 30;
    movey = 15;

	console.log("Drawing circle at ("+shapex+", "+shapey+").")
    shape.graphics.beginFill('blue').drawCircle(0, 0, shaper);
    shape.x = shapex;
    shape.y = shapey;
	shape.on("rollover", function (evt) {
		this.scale = this.originalScale * 1.2;
    });
    spriteContainer.addChild(shape);
    worldStage.addChild(spriteContainer);
	
    createjs.Tween.get(shape).to({x: movex, y: movey}, 1500)//, createjs.Ease.getPowInOut(2))
    .call(function(shape){console.log("DEBUG: shape is now at ("+this.x+","+this.y+")");});
    
    createjs.Ticker.addEventListener("tick", worldStage);
    
    //Assign a function to the Event! Button
    $("#eventButton").click(function handleGo() {
        foreach (shape in spriteContainer) {
            createjs.Tween.get(shape).to({x: 100, y: 100}, 1500)//, createjs.Ease.getPowInOut(2))
        .call(function(shape){console.log("DEBUG: shape is now at ("+this.x+","+this.y+")");});
        }
        
    });
    
	worldStage.update();
	
	update = true; 
};



/*function fireEvent() {
    var event = new createjs.Event("GO");

    new createjs.EventDispatcher().dispatchEvent(event);
};*/
