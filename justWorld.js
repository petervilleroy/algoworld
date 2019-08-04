var worldCanvas, worldStage;
var spriteArray;
var currentLevel = 3;

function Citizen(name, race, gender, wealth, shapex, shapey, shaper) {
    createjs.Container.call(this);
    this.name = name;
    this.race = race;
    this.gender = gender;
    this.wealth = wealth;
    this.shapex = shapex;
    this.shapey = shapey;
    this.shaper = shaper;

    this.bodyShape = new createjs.Shape();
    this.headShape = new createjs.Shape();
    this.genderShape = null;
    this.lightOutline = "#D39972";
    this.lightHead = "#F7C19B";
    this.darkOutline = "#6F4F1D";
    this.darkHead = "#876127";
    this.bodyColor = 'orange';

}
Citizen.prototype = Object.create(createjs.Container.prototype);
Citizen.prototype.render = function() {
    // Body
    console.log("Citizen: Drawing body at ("+this.shapex+", "+this.shapey+").")
    // begin at PI/2 - initWealth*PI
    this.bodyShape.graphics.beginFill(bodyColor).arc(0, 0, this.shaper*2, (Math.PI/2)-(Math.PI*this.wealth/100), (Math.PI/2)+(Math.PI*this.wealth/100), true);
    this.bodyShape.x = this.shapex;
    this.bodyShape.y = this.shapey+(this.shaper*2.5);
    this.addChild(this.bodyShape);
    //this.wealth = Math.round(this.wealth*100);

    // Now create the Head
    this.headShape = new createjs.Shape();
    console.log("Citizen: Drawing head at ("+this.shapex+", "+this.shapey+").")
    // apply Race
    if(this.race < 1) {
        this.headShape.graphics.beginStroke(lightOutline).beginFill(lightHead).drawCircle(0, 0, this.shaper);
        //this.race = 0;
    }
    else {
        this.headShape.graphics.beginStroke(darkOutline).beginFill(darkHead).drawCircle(0, 0, this.shaper);
        //this.race = 1;
    }

    this.headShape.x = this.shapex;
    this.headShape.y = this.shapey;
    this.addChild(this.headShape);

    // apply Gender
    if(shapeGender < 1) {
        //Draw the male icon
        //citizen.gender = 0;
    }
    else {
        //Draw the female icon
        this.genderShape = new createjs.Shape();
        console.log("Citizen: Drawing bow at ("+this.shapex+", "+this.shapey+").")
        this.genderShape.graphics.moveTo(-.9*this.shaper,0);
        this.genderShape.graphics.beginStroke('red').lineTo(-.9*this.shaper,0).lineTo(-.5*this.shaper, -1.4*this.shaper)
            .lineTo(0,-0.9*this.shaper).lineTo(-1.4*this.shaper,-0.5*this.shaper).lineTo(-.9*this.shaper,0);
        this.genderShape.graphics.beginFill('red').drawCircle(-.7*this.shaper,-.7*this.shaper,.2*this.shaper);
        //citizen.gender = 1;
        this.genderShape.x = this.shapex;
        this.genderShape.y = this.shapey;
        this.addChild(shape);
    }
    
};

function init() {//Draw a square on screen.
    worldCanvas = document.getElementById("myWorldCanvas");
	worldStage = new createjs.Stage(worldCanvas);
    spriteArray = new Array();
    deadArray = new Array();
    
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
    var deathToll = 0;
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
        shapex = 0; //worldCanvas.width * Math.random() | 0;
        shapey = 0; //worldCanvas.height * Math.random() | 0;
        shaper = 10;
        shapeRace = 100*Math.random() | 0;
        shapeGender = 100*Math.random() | 0;
        shapeInitWealth = Math.random();
        shapeInitWealth = Math.round(shapeInitWealth*100); // a number 0-99
        lightProportion = 65;
        maleProportion = 55;
        
        if(shapeRace < lightProportion) {shapeRace = 0} else { shapeRace = 1}
        if(shapeGender < maleProportion) {shapeGender = 0} else {shapeGender = 1}

        citizen = new Citizen("citizen_"+i, shapeRace, shapeGender, shapeInitWealth, shapex, shapey, shaper);
/*
        // Body
        console.log("Drawing body at ("+shapex+", "+shapey+").")
        // begin at PI/2 - initWealth*PI
        shape.graphics.beginFill(bodyColor).arc(0, 0, shaper*2, (Math.PI/2)-(Math.PI*shapeInitWealth), (Math.PI/2)+(Math.PI*shapeInitWealth), true);
        shape.x = shapex;
        shape.y = shapey+(shaper*2.5);
        shape.name = "body_"+i;
        citizen.addChild(shape);
        citizen.wealth = Math.round(shapeInitWealth*100);
        
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
*/
        // Add the new Citizen to the population
        //citizen.name = "citizen_"+i;
        spriteArray.push(citizen);
        worldStage.addChild(citizen);
        //spriteArray.forEach(function(sprite, i){worldStage.addChild(sprite);
        //    console.log("DEBUG: Added "+sprite.name+" to World Stage.")});
    }
    spriteArray.forEach(function(citizen, i){createjs.Tween.get(citizen).to({x: movex, y: movey}, 1500)
    .call(function(citizen){console.log("DEBUG: citizen is now at ("+this.x+","+this.y+")");})});
    
    createjs.Ticker.addEventListener("tick", worldStage);
    
    // The Event! Button represents (for now) a single move in the game. Will infinite loop eventually.
    $("#eventButton").click(function handleGo() {
        spriteArray.forEach (function(citizen, i){
            // Decrement Wealth
            citizen.wealth += 5;
            // Determine mortality and move accordingly
            if(citizen.wealth > 85){
                citizenx = worldCanvas.width - 25*deathToll;
                citizeny = worldCanvas.height - 25;
                deathToll += 1;
                deadArray.push(spriteArray.splice(i,1));
                console.log("DEBUG: "+citizen.name + " has died.");
            }
            // Random Move
            else {
                citizenx = 50 + (400 * Math.random() | 0)
                citizeny = 50 + (350 * Math.random() | 0)
            }
            
            createjs.Tween.get(citizen).to({x: citizenx, y: citizeny}, 1500) //, createjs.Ease.getPowInOut(2))
        .call(function(citizen){console.log("DEBUG: "+this.name +","+this.wealth+"% is now at ("
        +this.x+","+this.y+"). Living Population: "+spriteArray.length+".");});
        
        });
        
    });
    
	worldStage.update();
	
	update = true; 
};



/*function fireEvent() {
    var event = new createjs.Event("GO");

    new createjs.EventDispatcher().dispatchEvent(event);
};*/


