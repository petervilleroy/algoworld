var worldCanvas, worldStage;
var spriteArray;
var currentLevel = 0;

function init() {//Draw a square on screen.
    worldCanvas = document.getElementById("myWorldCanvas");
	worldStage = new createjs.Stage(worldCanvas);
    spriteArray = new Array();
    
	switch(currentLevel) {
		case 0: 
			populateLevel_0();
			break;
		default: 
			populateLevel_0();
	}
};

function populateLevel_0() {
	var shape, shapex, shapey, shaper, citizen, citizenx, citizeny;
	
    var movex = 30;
    var movey = 15;

    for (var i = 0; i < 8; i++) {
        // Create and attach Head
        shape = new createjs.Shape();
        citizen = new createjs.Container();
        shapex = worldCanvas.width * Math.random() | 0;
        shapey = worldCanvas.height * Math.random() | 0;
        shaper = 10;

        console.log("Drawing circle at ("+shapex+", "+shapey+").")
        shape.graphics.beginFill('blue').drawCircle(0, 0, shaper);
        shape.x = shapex;
        shape.y = shapey;
        shape.on("rollover", function (evt) {
            this.scale = this.originalScale * 1.2;
        });
        shape.name = "head_"+i;
        citizen.addChild(shape);
        // Now create the Body
        shape = new createjs.Shape();
        console.log("Drawing circle at ("+shapex+", "+shapey+").")
        shape.graphics.beginFill('orange').arc(0, 0, shaper*2, 0, Math.PI, true);
        shape.x = shapex;
        shape.y = shapey+(shaper*2);
        shape.name = "body_"+i;
        citizen.addChild(shape);

        // Add the new Citizen to the population
        citizen.name = "citizen_"+i;
        spriteArray.push(citizen);
        worldStage.addChild(citizen);
        //spriteArray.forEach(function(sprite, i){worldStage.addChild(sprite);
        //    console.log("DEBUG: Added "+sprite.name+" to World Stage.")});
    }
    spriteArray.forEach(function(citizen, i){createjs.Tween.get(citizen).to({x: movex, y: movey}, 1500)
    .call(function(citizen){console.log("DEBUG: citizen is now at ("+this.x+","+this.y+")");})});
    
    createjs.Ticker.addEventListener("tick", worldStage);
    
    //Assign a function to the Event! Button
    $("#eventButton").click(function handleGo() {
        spriteArray.forEach (function(citizen, i){
            citizenx = 100 + (150 * Math.random() | 0)
            citizeny = 100 + (80 * Math.random() | 0)
            createjs.Tween.get(citizen).to({x: citizenx, y: citizeny}, 1500)//, createjs.Ease.getPowInOut(2))
        .call(function(citizen){console.log("DEBUG: citizen is now at ("+this.x+","+this.y+")");});
        });
        
    });
    
	worldStage.update();
	
	update = true; 
};



/*function fireEvent() {
    var event = new createjs.Event("GO");

    new createjs.EventDispatcher().dispatchEvent(event);
};*/
