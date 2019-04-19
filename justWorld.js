var worldCanvas, worldStage;
var spriteContainer;
var currentLevel = 0;

function init() {//Draw a square on screen.
    worldCanvas = document.getElementById("myWorldCanvas");
	worldStage = new createjs.Stage(worldCanvas);
    spriteContainer = new Array();
    
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

    for (var i = 0; i < 1; i++) {
        console.log("Drawing circle at ("+shapex+", "+shapey+").")
        shape.graphics.beginFill('blue').drawCircle(0, 0, shaper);
        shape.x = shapex;
        shape.y = shapey;
        shape.on("rollover", function (evt) {
            this.scale = this.originalScale * 1.2;
        });
        shape.name = "sprite_"+i;
        spriteContainer.push(shape);
        worldStage.addChild(shape);
        //spriteContainer.forEach(function(sprite, i){worldStage.addChild(sprite);
        //    console.log("DEBUG: Added "+sprite.name+" to World Stage.")});
    }
    createjs.Tween.get(spriteContainer[0]).to({x: movex, y: movey}, 1500)//, createjs.Ease.getPowInOut(2))
    .call(function(sprite){console.log("DEBUG: shape is now at ("+this.x+","+this.y+")");});
    
    createjs.Ticker.addEventListener("tick", worldStage);
    
    //Assign a function to the Event! Button
    $("#eventButton").click(function handleGo() {
        spriteContainer.forEach (function(sprite, i){
            spritex = 100 + (30 * Math.random() | 0)
            spritey = 100 + (30 * Math.random() | 0)
            createjs.Tween.get(sprite).to({x: spritex, y: spritey}, 1500)//, createjs.Ease.getPowInOut(2))
        .call(function(sprite){console.log("DEBUG: shape is now at ("+this.x+","+this.y+")");});
        });
        
    });
    
	worldStage.update();
	
	update = true; 
};



/*function fireEvent() {
    var event = new createjs.Event("GO");

    new createjs.EventDispatcher().dispatchEvent(event);
};*/
