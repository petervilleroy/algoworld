var worldCanvas, worldStage;
var worldWidth, worldHeight, controlWidth, controlHeight;
var spriteArray;
var currentLevel = 1;
var update = true;
var TOTALWORLDCYCLES;
var shapex, shapey, shaper, citizen, citizenx, citizeny, car, carx, cary;
var worldPopulation, carPopulation, maxPeople, maxCars;
var movex, movey;
var trafficlight;
var tooltip,tooltip_target;
var finishedTweens, tweenSpeed;
var keepgoing;

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
    this.crossed = false;

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
    //console.log("Citizen: Drawing body at ("+this.shapex+", "+this.shapey+").")
    // begin at PI/2 - initWealth*PI
    this.bodyShape.graphics.beginFill(this.bodyColor).arc(0, 0, this.shaper*2, 
        (Math.PI/2)-(Math.PI*this.wealth/100), (Math.PI/2)+(Math.PI*this.wealth/100), true);
    this.bodyShape.x = this.shapex;
    this.bodyShape.y = this.shapey+(this.shaper*2.5);
    this.addChild(this.bodyShape);
    
    // Now create the Head
    this.headShape = new createjs.Shape();
    //console.log("Citizen: Drawing head at ("+this.shapex+", "+this.shapey+").")
    // apply Race ; 0=white, 1=black
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
    

    // apply Gender ; 0=male, 1=female
    if(this.gender < 1) {
        //Draw the male icon
        //citizen.gender = 0;
    }
    else {
        //Draw the female icon
        this.genderShape = new createjs.Shape();
        //console.log("Citizen: Drawing bow at ("+this.shapex+", "+this.shapey+").")
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
Citizen.prototype.reRender = function() {
    
    this.removeChild(this.bodyShape);
    this.bodyShape = new createjs.Shape();
    this.bodyShape.graphics.beginFill(this.bodyColor).arc(0, 0, this.shaper*2, 
        (Math.PI/2)-(Math.PI*this.wealth/100), (Math.PI/2)+(Math.PI*this.wealth/100), true);
    this.bodyShape.x = this.shapex;
    this.bodyShape.y = this.shapey+(this.shaper*2.5);
    this.addChildAt(this.bodyShape, 0);
    
};

function Car(name, color, step) {
    //call super constructor
    createjs.Container.call(this);
    this.name = name;
    this.color = color;
    this.step = step;

    this.frontWheelShape = new createjs.Shape();
    this.backWheelShape = new createjs.Shape();
    this.bodyShape = new createjs.Shape();
}
Car.prototype = Object.create(createjs.Container.prototype);

//Render function, for drawing the Car
Car.prototype.render = function() {
    //draw the body
    this.bodyShape.graphics.beginFill(this.color).drawRect(0,0,34,14);
    this.addChild(this.bodyShape);

    this.frontWheelShape.graphics.beginFill("gray").drawCircle(28,14,6);
    this.addChild(this.frontWheelShape);

    this.backWheelShape.graphics.beginFill("gray").drawCircle(6,14,6);
    this.addChild(this.backWheelShape);
}

function TrafficLight(name, lightColor, shapex, shapey, shaper) {
    // call super constructor
    createjs.Container.call(this);
    this.name = name;
    this.lightColor = lightColor;
    this.shapex = shapex;
    this.shapey = shapey;
    this.shaper = shaper;

    this.greenLight = new createjs.Shape();
    this.redLight = new createjs.Shape();
    this.box = new createjs.Shape();
    this.post = new createjs.Shape();
}
TrafficLight.prototype = Object.create(createjs.Container.prototype);

TrafficLight.prototype.render = function() {
    //draw the light, default red
    this.post.graphics.beginFill('black').drawRect(8,15,9,60);
    this.addChild(this.post);

    this.box.graphics.beginFill('black').drawRect(0,0,25,40);
    this.addChild(this.box);

    this.redLight.graphics.beginFill('red').drawCircle(12.5,10,8);
    this.addChild(this.redLight);

    this.greenLight.graphics.beginFill('green').drawCircle(12.5,30,8);
    //this.addChild(this.greenLight);
}

TrafficLight.prototype.reRender = function() {
    //remove one light, add the other
    if(this.lightColor) {
        this.removeChild(this.redLight);
        this.addChild(this.greenLight);
    }
    else {
        this.removeChild(this.greenLight);
        this.addChild(this.redLight);

    }
}

function init() {
    
      
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

function populateLevel_1() {
    $(".level2").hide();
    $(".level3").hide();
    $(".level1").show();
    worldCanvas = document.getElementById("myWorldCanvas");
	worldStage = new createjs.Stage(worldCanvas);
    spriteArray = new Array();
    carArray = new Array();
    //TOTALWORLDCYCLES = 20;
    worldPopulation = 5;
    carPopulation = 0;
    maxPeople = 20;
    maxCars = 5;
    worldWidth = worldCanvas.width *.6;
    controlWidth = worldCanvas.width * .4;
    worldHeight = controlHeight = worldCanvas.height;

    movex = worldCanvas.width / 2;
    movey = worldCanvas.height / 2;
    
    tooltip = new createjs.Text("");
    keepgoing = true;
    finishedTweens = 0;
    tweenSpeed = 50;
    tooltip.x = tooltip.y = 10;

    
    var dividerShape = new createjs.Shape();
    dividerShape.graphics.moveTo(worldWidth,0).beginStroke('green').lineTo(worldWidth,worldHeight).lineTo(worldWidth,0);
    worldStage.addChild(dividerShape);

    var roadShape = new createjs.Shape();
    roadShape.graphics.moveTo(worldWidth*.2,0).beginStroke('grey').lineTo(worldWidth*.3,0).lineTo(worldWidth,worldHeight*.7).lineTo(worldWidth,worldHeight*.8).lineTo(worldWidth*.2,0)
    worldStage.addChild(roadShape);
 
    for (var i = 0; i < worldPopulation; i++) {
        var citGender = (Math.random() >= 0.5  ? 0 : 1 );
        var citRace = (Math.random() >= 0.3  ? 0 : 1 );
        citizen = new Citizen("cit"+i,citRace,citGender,50,0,0,8);
        citizen.x = worldWidth*.2 * Math.random() | 0;
        citizen.y = worldHeight * Math.random() | 0;
        citizen.render();

        spriteArray.push(citizen);
        worldStage.addChild(citizen);
    }

    car = new Car("car1","blue",0,0,2);
    car.render();
    car.x = getRoadCoordinateX(car.step);
    car.y = getRoadCoordinateY(car.step);

    spriteArray.push(car);
    worldStage.addChild(car);
   
    trafficlight = new TrafficLight("mainLight", 0, 0, 0, 0);
    trafficlight.render();
    trafficlight.x = getRoadCoordinateX(5)+worldWidth*.1;
    trafficlight.y = getRoadCoordinateY(5)-worldHeight*.15;
    worldStage.addChild(trafficlight);

    
    worldStage.update();

    //Make the first move
    finishedTweens = 0;
    spriteArray.forEach(function(sprite, i){
        if(sprite instanceof Citizen){
        createjs.Tween.get(sprite).to({x: worldWidth*.2 * Math.random() | 0, y: worldHeight * Math.random() | 0}, 30*(101-tweenSpeed), createjs.Ease.quadInOut)
         .call(function(sprite){console.log("DEBUG: citizen is now at ("+this.x+","+this.y+")");}).call(tweenComplete);
        }
        if(sprite instanceof Car){
            var targetlocation = sprite.step+1;
            sprite.step = targetlocation;
            createjs.Tween.get(sprite).to({x: getRoadCoordinateX(targetlocation), y: getRoadCoordinateY(targetlocation)}, 30*(101-tweenSpeed), createjs.Ease.quadInOut)
         .call(function(sprite){console.log("DEBUG: "+this.name+" is now at ("+this.x+","+this.y+")");}).call(tweenComplete);
        }
    });
    
    createjs.Ticker.addEventListener("tick", tick);
   
    
    //carArray.forEach(function(car, i){createjs.Tween.get(car).to({x: movex, y: movey}, 1500, createjs.Ease.quadInOut)
    //.call(function(car){console.log("DEBUG: car is now at ("+this.step+")");}).call(tweenComplete)});
}

function tweenComplete() {
    finishedTweens++;
    if(spriteArray.length > 88) {keepgoing = false};

    console.log ("DEBUG::: Moving sprites. "+finishedTweens + " moves complete so far...");
    if (finishedTweens >= spriteArray.length && keepgoing) {
        //onlyOnce = false;
        //reset the tween counter, and start another animation loop
        finishedTweens = 0;
        handleGo();
        
    }
}
function tick(tickEvent) {
    trafficlight.reRender();
    worldStage.update(tickEvent);
}

function handleGo() { //This function is the main animation loop. It is re-executed after every Tween
    //add to the population
    if(spriteArray.length % 2 == 0) {
        // add a car
        car = new Car("car"+spriteArray.length,"blue",0);
        car.render();
        car.x = getRoadCoordinateX(car.step);
        car.y = getRoadCoordinateY(car.step);
        carPopulation += 1;
        spriteArray.push(car);
        worldStage.addChild(car);
    }
    else {
        // add 3 citizens
        for (var i = 0; i < 3; i++) {
            var citGender = (Math.random() >= 0.5  ? 0 : 1 );
            var citRace = (Math.random() >= 0.3  ? 0 : 1 );
            citizen = new Citizen("cit"+spriteArray.length,citRace,citGender,50,0,0,8);
            citizen.x = worldWidth*.2 * Math.random() | 0;
            citizen.y = worldHeight * Math.random() | 0;
            citizen.render();
            worldPopulation += 1;
            spriteArray.push(citizen);
            worldStage.addChild(citizen);
        }
    }
    /*if(spriteArray.length > 50) {
        trafficlight.lightColor = 1;
    }
    if (spriteArray.length < 30) {
        trafficlight.lightColor = 0;
    }
    */
    spriteArray.forEach(function(sprite, i){
        if(sprite instanceof Citizen){
            // if the light is green, cross the street
            if(trafficlight.lightColor) {
                if(i < 10){
                    citizenx = worldWidth;
                    citizeny = worldHeight *.6 * Math.random() | 0;

                    

                    createjs.Tween.get(sprite).to({x: getRoadCoordinateX(5)-worldWidth*.1, y: getRoadCoordinateY(5)+ worldHeight*.1}, 500, createjs.Ease.quadInOut)
                    .to({x: citizenx, y: citizeny}, 30*(101-tweenSpeed)-500, createjs.Ease.quadInOut)
                    .call(function(sprite){
                        spriteArray.splice(i,1);
                        worldPopulation -= 1;
                        worldStage.removeChild(this);
                    })
                    .call(tweenComplete); 
                    
                }
                else {
                    citizenx = worldWidth * Math.random() | 0;
                    citizeny = worldHeight - (worldHeight *(1-citizenx/worldWidth) * Math.random() | 0);
                    createjs.Tween.get(sprite).to({x: citizenx, y: citizeny}, 30*(101-tweenSpeed), createjs.Ease.quadInOut)
                    .call(tweenComplete);
                }
            }
            else {
                citizenx = worldWidth * Math.random() | 0;
                citizeny = worldHeight - (worldHeight *(1-citizenx/worldWidth) * Math.random() | 0);
                createjs.Tween.get(sprite).to({x: citizenx, y: citizeny}, 30*(101-tweenSpeed), createjs.Ease.quadInOut)
                .call(tweenComplete);
                //createjs.Tween.get(sprite).to({x: citizenx, y: citizeny}, 30*(101-tweenSpeed), createjs.Ease.quadInOut).call(tweenComplete); //, createjs.Ease.getPowInOut(2))
    
            }
            
        }
        if(sprite instanceof Car){
            var targetlocation = sprite.step+1;
            sprite.step = targetlocation;
            // if the car is at the end of the road, delete it.
            if(targetlocation > 9) {
                //i is the index of this car in the spritearray...
                spriteArray.splice(i,1);
                carPopulation -=1;
                worldStage.removeChild(sprite);
                
                createjs.Tween.get(sprite).to({x: getRoadCoordinateX(11), y: getRoadCoordinateY(11)}, 1000, createjs.Ease.quadInOut)
                 .call(function(sprite){console.log("DEBUG: Removing "+sprite.name+" from the Array.")}).call(tweenComplete);
            }
            else {
                createjs.Tween.get(sprite).to({x: getRoadCoordinateX(targetlocation), y: getRoadCoordinateY(targetlocation)}, 30*(101-tweenSpeed), createjs.Ease.quadInOut)
                 .call(function(sprite){console.log("DEBUG: "+this.name+" is now at ("+this.x+","+this.y+")");}).call(tweenComplete);
            }
        }
    });
    
} // end of handleGo() animation loop function


function getRoadCoordinateX(step) {
    var roadStartX = worldWidth*.25;
    var roadEndX = worldWidth;
    
    return roadStartX + (step* (roadEndX-roadStartX)*.1)

}
function getRoadCoordinateY(step) {
    var roadStartY = 0;
    var roadEndY = worldHeight * .75;

    return roadStartY + (step* (roadEndY-roadStartY)*.1)

}