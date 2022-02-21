var worldCanvas, worldStage;
var spriteArray, deadArray;
var currentLevel = 2;
var update = true;
var TOTALWORLDCYCLES;
var bankShape, prisonShape, companyShape, shapex, shapey, shaper, citizen, citizenx, citizeny;
var worldPopulation, deathToll;
var movex, movey;
var graveyard, bank, prison, company;
var misogyny, racism;
var tooltip,tooltip_target;
var onlyOnce, finishedTweens, tweenSpeed;
var whiteMortality, colorMortality, maleMortality, femaleMortality, whitewealth, colorwealth, malewealth, femalewealth;

//TODO: make checkboxes change behavior of bases (with no data, nobody gets anything)
//TODO: allow for re-running level 3.
//TODO: rework the calculate_loan, calculate_job functions to be statistic rather than binary
//TODO: figure out a way to show wealth with a skinny-fat instead of full-empty.
//TODO: Bios are not showing in Chrome!



//Define the Citizen Prototype as inheriting from createjs.Container
function Citizen(name, race, gender, wealth, shapex, shapey, shaper) {
    //call super constructor
    createjs.Container.call(this);
    this.name = name;
    this.race = race;
    this.gender = gender;
    this.imprisoned = false;
    this.prisonTimer = 5;
    this.prisonHistory = false;
    this.employed = false;
    this.jobHistory = false;
    this.jobTimer = 5;
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
    this.selected = false;
    this.selectShape = new createjs.Shape();

    this.degree=0;
    this.attendance=0;
    this.kindness=0;
    this.coolfactor=0;
    this.testscores=0;
    this.teacherBio="";

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
    if(shapeGender < 1) {
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
    /*this.selectShape = new createjs.Shape();
    this.selectShape.graphics.moveTo(-1.5*this.shaper,0);
    this.selectShape.graphics.beginStroke('orange').lineTo(-1.5*this.shaper,1.5*this.shaper).lineTo(1.5*this.shaper, 1.5*this.shaper)
            .lineTo(1.5*this.shaper,-1.5*this.shaper).lineTo(-1.5*this.shaper,-1.5*this.shaper).lineTo(-1.5*this.shaper,1.5*this.shaper);
    this.addChild(this.selectShape);
    */
    
};
Citizen.prototype.reRender = function() {
    
    this.removeChild(this.bodyShape);
    this.bodyShape = new createjs.Shape();
    this.bodyShape.graphics.beginFill(this.bodyColor).arc(0, 0, this.shaper*2, 
        (Math.PI/2)-(Math.PI*this.wealth/100), (Math.PI/2)+(Math.PI*this.wealth/100), true);
    this.bodyShape.x = this.shapex;
    this.bodyShape.y = this.shapey+(this.shaper*2.5);
    this.addChildAt(this.bodyShape, 0);
    if(this.selected){
        this.selectShape = new createjs.Shape();
        this.selectShape.graphics.moveTo(-1.5*this.shaper,0);
        this.selectShape.graphics.beginStroke('orange').lineTo(-1.5*this.shaper,1.5*this.shaper).lineTo(1.5*this.shaper, 1.5*this.shaper)
                .lineTo(1.5*this.shaper,-1.5*this.shaper).lineTo(-1.5*this.shaper,-1.5*this.shaper).lineTo(-1.5*this.shaper,1.5*this.shaper);
        this.addChild(this.selectShape);
    }
    else {
        this.removeChild(this.selectShape);
    }
};

function Crown(scale) {
    createjs.Container.call(this);
    this.scale = scale;

    this.base = new createjs.Shape();
    this.triangles = new createjs.Shape();
    this.centerGem = new createjs.Shape();
    this.leftGem = new createjs.Shape();
    this.rightGem = new createjs.Shape();
}
Crown.prototype = Object.create(createjs.Container.prototype);

Crown.prototype.render = function() {
    this.base.graphics.beginFill('gold').drawRect(-30*this.scale,0,60*this.scale,25*this.scale);
    this.triangles.graphics.moveTo(-30*this.scale,0).beginFill('gold').lineTo(30*this.scale, 0).lineTo(30*this.scale,-25*this.scale)
            .lineTo(20*this.scale,0).lineTo(0,-30*this.scale).lineTo(-20*this.scale,0).lineTo(-30*this.scale, -25*this.scale)
            .lineTo(-30*this.scale,0);

    this.addChild(this.base);
    this.addChild(this.triangles);
};

function init() {

    // Button Handler functions for level navigation
   /* $("#lvl1Button").click(function() {
        //TODO: fix the issue where going from level1 to level3 kills the tick functionality. maybe need to destroy and re-create createjs.Ticker.addEventListener("tick", tick);
        console.log("--- DEBUG: switching to level 1...");
        currentLevel = 1;
        worldCanvas = null;
        init();
    })*/
    $("#lvl2Button").click(function() {
        console.log("--- DEBUG: switching to level 2...");
        currentLevel = 2;
        init();
    })
    

    
    
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



function populateLevel_2() {
    $(".level1").hide();
    $(".level3").hide();
    $(".level2").show();
    worldCanvas = document.getElementById("myWorldCanvas");
	worldStage = new createjs.Stage(worldCanvas);
    var l2spriteArray = new Array();
    //TOTALWORLDCYCLES = 20;
    //movex = worldCanvas.width / 2;
    //movey = worldCanvas.height / 2;
    
    tooltip = new createjs.Text(" ", "20px Arial");
    onlyOnce = true;
    finishedTweens = 0;
    tweenSpeed = 50;
    tooltip.x = 15;
    tooltip.y = 130;
    tooltip.lineWidth = worldCanvas.width - 30;
    var degreeP, attendanceP, kindnessP, coolfactorP, testscoresP, raceP, genderP;
    degreeP = attendanceP = kindnessP = coolfactorP = testscoresP = raceP = genderP = 50;

    // Draw Ms. Adams
    shapex = worldCanvas.width * .1; 
    shapey = worldCanvas.height *.8; 
    shaper = 20;
    shapeRace = 0;
    shapeGender = 1;
    shapeInitWealth = 65;
    citizen = new Citizen("Ms. Adams", shapeRace, shapeGender, shapeInitWealth, shapex, shapey, shaper);
        citizen.degree=95;
        citizen.attendance=80;
        citizen.kindness=35;
        citizen.coolfactor=40;
        citizen.testscores=90;
        citizen.teacherBio="Ms. Adams: She's not especially kind nor particularly cool, but she is very fair in grading tests, and she comes with the best degree you could want. Sometimes she misses class, but not often."
        citizen.render();
    l2spriteArray.push(citizen);
    worldStage.addChild(citizen);
    
    // Draw Mr. Baker
    shapex = worldCanvas.width * .3; 
    shapey = worldCanvas.height *.8; 
    shaper = 20;
    shapeRace = 0;
    shapeGender = 0;
    shapeInitWealth = 25;
    citizen = new Citizen("Mr. Baker", shapeRace, shapeGender, shapeInitWealth, shapex, shapey, shaper);
    citizen.degree=75;
    citizen.attendance=95;
    citizen.kindness=50;
    citizen.coolfactor=50;
    citizen.testscores=20;
    citizen.teacherBio="Mr. Baker: He almost never has a substitute! He's pretty average from a kindness and coolness standpoint, but he has a degree from a pretty impressive school. Sadly, his test scoring is pretty unfair!"
    citizen.render();
    l2spriteArray.push(citizen);
    worldStage.addChild(citizen);

    // Draw Mr. Cohen
    shapex = worldCanvas.width * .5;  
    shapey = worldCanvas.height *.8; 
    shaper = 20;
    shapeRace = 0;
    shapeGender = 0;
    shapeInitWealth = 40;
    citizen = new Citizen("Mr. Cohen", shapeRace, shapeGender, shapeInitWealth, shapex, shapey, shaper);
    citizen.degree=20;  //nothing to write home about
    citizen.attendance=30;  //often replaced by a substitute
    citizen.kindness=95;    //especially nice
    citizen.coolfactor=70;  //cooler than avg teacher
    citizen.testscores=60;  //doesn't always grade tests fairly
    citizen.teacherBio="Mr. Cohen: He is just as nice as you could wish, even though his degree is from a pretty poor school. He usually grades tests fairly, but not always. He misses class a lot and we're stuck with a substitute more than you'd like, but still he's quite a cool guy all around."
    citizen.render();
    l2spriteArray.push(citizen);
    worldStage.addChild(citizen);

    // Draw Mr. Darden
    shapex = worldCanvas.width * .7; 
    shapey = worldCanvas.height *.8; 
    shaper = 20;
    shapeRace = 1;
    shapeGender = 0;
    shapeInitWealth = 70;
    citizen = new Citizen("Mr. Darden", shapeRace, shapeGender, shapeInitWealth, shapex, shapey, shaper);
    citizen.degree=50;
    citizen.attendance=20;
    citizen.kindness=95;
    citizen.coolfactor=99;
    citizen.testscores=99;
    citizen.teacherBio="Mr. Darden: He's the coolest teacher by far, and he has never graded any test lower than a B! He has a bad degree from a nameless school, and he misses class very regularly, but he's certainly the nicest teacher in school."
    citizen.render();
    l2spriteArray.push(citizen);
    worldStage.addChild(citizen);

    // Draw Ms. Edwards
    shapex = worldCanvas.width * .9; 
    shapey = worldCanvas.height *.8; 
    shaper = 20;
    shapeRace = 1;
    shapeGender = 1;
    shapeInitWealth = 50;
    citizen = new Citizen("Ms. Edwards", shapeRace, shapeGender, shapeInitWealth, shapex, shapey, shaper);
    citizen.degree=85;
    citizen.attendance=80;
    citizen.kindness=35;
    citizen.coolfactor=75;
    citizen.testscores=60;
    citizen.teacherBio="Ms. Edwards: Kindness is not her strong suit, but Ms. Edwards does boast a decently impressive degree. She rarely misses class, and kids agree she's pretty cool. Sadly, her test grading is usually fair but not always."
    citizen.render();
    l2spriteArray.push(citizen);
    worldStage.addChild(citizen);

    crownShape = new Crown(1);
    crownShape.render();
    crownShape.x = 250;
    crownShape.y = 100;
    worldStage.addChild(crownShape);
    worldStage.addChild(tooltip);
    worldStage.update();

    $("#degreeSlider").mouseup(function() {
        degreeP = this.value;
        log2dblvl2("attempt", ""+degreeP+"-"+attendanceP+"-"+kindnessP+"-"+coolfactorP+"-"+testscoresP+"-"+genderP+"-"+raceP+"-none");
        
    })
    $("#coolfactorSlider").mouseup(function() {
        coolfactorP = this.value;
        log2dblvl2("attempt", ""+degreeP+"-"+attendanceP+"-"+kindnessP+"-"+coolfactorP+"-"+testscoresP+"-"+genderP+"-"+raceP+"-none");
        
    })
    $("#kindnessSlider").mouseup(function() {
        kindnessP = this.value;
        log2dblvl2("attempt", ""+degreeP+"-"+attendanceP+"-"+kindnessP+"-"+coolfactorP+"-"+testscoresP+"-"+genderP+"-"+raceP+"-none");
        
    })
    $("#attendanceSlider").mouseup(function() {
        attendanceP = this.value;
        log2dblvl2("attempt", ""+degreeP+"-"+attendanceP+"-"+kindnessP+"-"+coolfactorP+"-"+testscoresP+"-"+genderP+"-"+raceP+"-none");
        
    })
    $("#testscoresSlider").mouseup(function() {
        testscoresP = this.value;
        log2dblvl2("attempt", ""+degreeP+"-"+attendanceP+"-"+kindnessP+"-"+coolfactorP+"-"+testscoresP+"-"+genderP+"-"+raceP+"-none");
        
    })
    $("#genderSlider").mouseup(function() {
        genderP = this.value;
        log2dblvl2("attempt", ""+degreeP+"-"+attendanceP+"-"+kindnessP+"-"+coolfactorP+"-"+testscoresP+"-"+genderP+"-"+raceP+"-none");
        
    })
    $("#raceSlider").mouseup(function() {
        raceP = this.value;
        log2dblvl2("attempt", ""+degreeP+"-"+attendanceP+"-"+kindnessP+"-"+coolfactorP+"-"+testscoresP+"-"+genderP+"-"+raceP+"-none");
        
    })
    worldStage.on("click", function(evt) {
        tooltip_target = evt.target.parent;
        tooltip.text = " " + evt.target.parent.teacherBio;
        
        worldStage.update();
    });

    $("#eventButton").click(function() {
        // Calculate the new Teacher of the Year
        tooltip.text = " ";
        var TeacherOfTheYear;

        var bestScore = 0;
        l2spriteArray.forEach(function(citizen, i) {
            var currentScore = citizen.degree*degreeP + citizen.attendance*attendanceP + citizen.kindness*kindnessP +
                citizen.coolfactor*coolfactorP + citizen.testscores*testscoresP + (citizen.gender?0:99)*genderP + (citizen.race?0:99)*raceP;
            if(currentScore > bestScore) {
                bestScore = currentScore;
                TeacherOfTheYear = citizen;
            }

        });
        console.log("---DEBUG: "+TeacherOfTheYear.name + " is Teacher of the Year!");
        //record to the database this action
        log2dblvl2("solution", ""+degreeP+"-"+attendanceP+"-"+kindnessP+"-"+coolfactorP+"-"+testscoresP+"-"+genderP+"-"+raceP+"-"+TeacherOfTheYear.name)
                
        tooltip.text = TeacherOfTheYear.name + " is Teacher of the Year!";
        // Tween the Crown to directly above that Teacher
        createjs.Tween.get(crownShape).to({x: TeacherOfTheYear.shapex, y: 100}, 30*(101-tweenSpeed), createjs.Ease.quadInOut).to({x: TeacherOfTheYear.shapex, y: TeacherOfTheYear.shapey-50}, 30*(101-tweenSpeed), createjs.Ease.quadInOut).call(tweenComplete);
    })
    createjs.Ticker.addEventListener("tick", tick);
}


function handleGo() { //This function is the main animation loop. It is re-executed after every Tween
        
   
    

} // End of HandleGo, the main animation loop.

function tweenComplete() {
    
    handleGo();
}
function tick(tickEvent) {

    worldStage.update(tickEvent);
}

function getDetailString() {
    return ""+degreeP+"-"+attendanceP+"";
}
//TODO: log for each BIO VIEW!!!
function log2dblvl2(cat, det) {
    $.ajax("/useractions", {type: "POST", async: true, data: {level: "level2", category: cat, details: det}})
}

