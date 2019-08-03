var worldCanvas, worldStage;
var spriteArray;
var currentLevel = 3;


function init() {//Draw a square on screen.
    worldCanvas = document.getElementById("myWorldCanvas");
	worldStage = new createjs.Stage(worldCanvas);
    spriteArray = new Array();
    
	switch(currentLevel) {
		case 1: 
			populateLevel_1();
            break;
        case 2: 
			populateLevel_2();
            break;
        case 3: 
			populateLevel_3();
			break;
		default: 
			populateLevel_3();
	}
};

function populateLevel_3() {
	var shape, shapex, shapey, shaper, citizen, citizenx, citizeny;
	var worldPopulation = 20;
    var movex = 30;
    var movey = 15;
    var lightOutline = "#D39972";
    var lightHead = "#F7C19B";
    var darkOutline = "#6F4F1D";
    var darkHead = "#876127";
    var bodyColor = 'orange';

    for (var i = 0; i < worldPopulation; i++) {
        // Create and attach Body
        shape = new createjs.Shape();
        citizen = new createjs.Container();
        shapex = 0; //worldCanvas.width * Math.random() | 0;
        shapey = 0; //worldCanvas.height * Math.random() | 0;
        shaper = 10;
        shapeRace = 100*Math.random() | 0;
        shapeGender = 100*Math.random() | 0;
        lightProportion = 65;
        maleProportion = 55;
        
        // Body
        console.log("Drawing body at ("+shapex+", "+shapey+").")
        shape.graphics.beginFill(bodyColor).arc(0, 0, shaper*2, 0, Math.PI, true);
        shape.x = shapex;
        shape.y = shapey+(shaper*2.5);
        shape.name = "body_"+i;
        citizen.addChild(shape);
        
        // Now create the Head
        shape = new createjs.Shape();
        console.log("Drawing head at ("+shapex+", "+shapey+").")
        // apply Race
        if(shapeRace < lightProportion) {
            shape.graphics.beginStroke(lightOutline).beginFill(lightHead).drawCircle(0, 0, shaper);
            citizen.race = 0;
        }
        else {
            shape.graphics.beginStroke(darkOutline).beginFill(darkHead).drawCircle(0, 0, shaper);
            citizen.race = 1;
        }
        
        shape.x = shapex;
        shape.y = shapey;
        //shape.on("rollover", function (evt) {            this.scale = this.originalScale * 1.2;        });
        shape.name = "head_"+i;
        citizen.addChild(shape);
        
        // apply Gender
        shape = new createjs.Shape();
        console.log("Drawing bow at ("+shapex+", "+shapey+").")
        if(shapeGender < maleProportion) {
            citizen.gender = 0;
        }
        else {
            //Draw the female icon
            shape.graphics.moveTo(-.9*shaper,0);
            shape.graphics.beginStroke('red').lineTo(-.9*shaper,0).lineTo(-.5*shaper, -1.4*shaper).lineTo(0,-0.9*shaper).lineTo(-1.4*shaper,-0.5*shaper).lineTo(-.9*shaper,0);
            shape.graphics.beginFill('red').drawCircle(-.7*shaper,-.7*shaper,.2*shaper);
            citizen.gender = 1;
        }
        shape.x = shapex;
        shape.y = shapey;
        shape.name = "bow_"+i;
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
            citizenx = 50 + (400 * Math.random() | 0)
            citizeny = 50 + (350 * Math.random() | 0)
            createjs.Tween.get(citizen).to({x: citizenx, y: citizeny}, 1500, createjs.Ease.circInOut))//, createjs.Ease.getPowInOut(2))
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


