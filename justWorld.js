var worldCanvas, worldStage;
var spriteArray;
var currentLevel = 3;

//Define the Citizen Prototype as inheriting from createjs.Container
function Citizen(name, race, gender, wealth, shapex, shapey, shaper) {
    //call super constructor
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

//Render function, for drawing the Citizen
Citizen.prototype.render = function() {
    // Body
    console.log("Citizen: Drawing body at ("+this.shapex+", "+this.shapey+").")
    // begin at PI/2 - initWealth*PI
    this.bodyShape.graphics.beginFill(this.bodyColor).arc(0, 0, this.shaper*2, 
        (Math.PI/2)-(Math.PI*this.wealth/100), (Math.PI/2)+(Math.PI*this.wealth/100), true);
    this.bodyShape.x = this.shapex;
    this.bodyShape.y = this.shapey+(this.shaper*2.5);
    this.addChild(this.bodyShape);
    
    // Now create the Head
    this.headShape = new createjs.Shape();
    console.log("Citizen: Drawing head at ("+this.shapex+", "+this.shapey+").")
    // apply Race
    if(this.race < 1) {
        this.headShape.graphics.beginStroke(this.lightOutline).beginFill(this.lightHead)
        .drawCircle(0, 0, this.shaper);   
    }
    else {
        this.headShape.graphics.beginStroke(this.darkOutline).beginFill(this.darkHead)
        .drawCircle(0, 0, this.shaper);
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
        this.addChild(this.genderShape);
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
	var shapex, shapey, shaper, citizen, citizenx, citizeny;
    var worldPopulation = 20;
    var deathToll = 0;
    var movex = 30;
    var movey = 15;
    
    for (var i = 0; i < worldPopulation; i++) {
        // Create and attach Body
        shapex = 0; 
        shapey = 0; 
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
        citizen.render();
        
        // Add the new Citizen to the population
                
        spriteArray.push(citizen);
        worldStage.addChild(citizen);
        
    }
    spriteArray.forEach(function(citizen, i){createjs.Tween.get(citizen).to({x: movex, y: movey}, 1500)
    .call(function(citizen){console.log("DEBUG: citizen is now at ("+this.x+","+this.y+")");})});
    
    createjs.Ticker.addEventListener("tick", worldStage);
    
    // The Event! Button represents (for now) a single move in the game. Will infinite loop eventually.
    $("#eventButton").click(function handleGo() {
        spriteArray.forEach (function(citizen, i){
            // Decrement Wealth
            citizen.wealth += 5;
            citizen.render();
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
        worldStage.update();
        });
        
    });
    
	worldStage.update();
	
	update = true; 
};



/*function fireEvent() {
    var event = new createjs.Event("GO");

    new createjs.EventDispatcher().dispatchEvent(event);
};*/


