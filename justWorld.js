var worldCanvas, worldStage;
var spriteArray, deadArray;
var currentLevel = 3;
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
//TODO: for results calculation, make divide by zero NOT result in NaN
//TODO: figure out a way to show wealth with a skinny-fat instead of full-empty.
//TODO: Bios are not showing in Chrome!

//TODO-Today: Label the 3 boxes in lvl3 ***
//TODO-Today: Fix the results box to update 'not only when a user is clicked' WTF
//TODO-Today: Fix the text in canvas to be bigger, sharper
//TODO-Today: make boxes lvl3 click-able, alter the contents of Green selection boxes ****


//TODO-Today: write proper bios for 5 teachers lvl2 ****

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



function init() {

    // Button Handler functions for level navigation
    $("#lvl1Button").click(function() {
        //TODO: fix the issue where going from level1 to level3 kills the tick functionality. maybe need to destroy and re-create createjs.Ticker.addEventListener("tick", tick);
        console.log("--- DEBUG: switching to level 1...");
        currentLevel = 1;
        worldCanvas = null;
        init();
    })
    $("#lvl2Button").click(function() {
        console.log("--- DEBUG: switching to level 2...");
        currentLevel = 2;
        init();
    })
    $("#lvl3Button").click(function() {
        console.log("--- DEBUG: switching to level 3...");
        currentLevel = 3;
        worldCanvas = null;
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

function populateLevel_1() {
    $(".level2").hide();
    $(".level3").hide();
    $(".level1").show();
    worldCanvas = document.getElementById("myWorldCanvas");
	worldStage = new createjs.Stage(worldCanvas);
    spriteArray = new Array();
    TOTALWORLDCYCLES = 20;
    movex = worldCanvas.width / 2;
    movey = worldCanvas.height / 2;
    
    tooltip = new createjs.Text("");
    onlyOnce = true;
    finishedTweens = 0;
    tweenSpeed = 50;
    tooltip.x = tooltip.y = 10;

    companyShape = new createjs.Shape();
    companyShape.graphics.beginFill('blue').drawCircle(0,0,5);
    companyShape.x = 45;
    companyShape.y = 45;
    worldStage.addChild(companyShape);
    worldStage.update();
}

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
    citizen = new Citizen("a", shapeRace, shapeGender, shapeInitWealth, shapex, shapey, shaper);
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
    citizen = new Citizen("b", shapeRace, shapeGender, shapeInitWealth, shapex, shapey, shaper);
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
    citizen = new Citizen("c", shapeRace, shapeGender, shapeInitWealth, shapex, shapey, shaper);
    citizen.degree=20;  //nothing to write home about
    citizen.attendance=30;  //often replaced by a substitute
    citizen.kindness=95;    //especially nice
    citizen.coolfactor=70;  //cooler than avg teacher
    citizen.testscores=60;  //doesn't always grade tests fairly
    citizen.teacherBio="Mr. Cohen: He is just as nice as you could wish, even though his degree is from a pretty poor school. He usually grades test fairly, but not always. He misses class a lot and we're stuck with a substitute more than you'd like, but still he's quite a cool guy all around."
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
    citizen = new Citizen("d", shapeRace, shapeGender, shapeInitWealth, shapex, shapey, shaper);
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
    citizen = new Citizen("e", shapeRace, shapeGender, shapeInitWealth, shapex, shapey, shaper);
    citizen.degree=85;
    citizen.attendance=80;
    citizen.kindness=35;
    citizen.coolfactor=75;
    citizen.testscores=60;
    citizen.teacherBio="Ms. Edwards: Kindness is not her strong suit, but Ms. Edwards does boast a decently impressive degree. She rarely misses class, and kids agree she's pretty cool. Sadly, her test grading is usually fair but not always."
    citizen.render();
    l2spriteArray.push(citizen);
    worldStage.addChild(citizen);

    crownShape = new createjs.Shape();
    crownShape.graphics.beginFill('green').drawCircle(0,0,15);
    crownShape.x = worldCanvas.width / 2;
    crownShape.y = 90;
    worldStage.addChild(crownShape);
    worldStage.addChild(tooltip);
    worldStage.update();

    $("#degreeSlider").mouseup(function() {
        degreeP = this.value;
        
    })
    $("#coolfactorSlider").mouseup(function() {
        coolfactorP = this.value;
       
    })
    $("#kindnessSlider").mouseup(function() {
        kindnessP = this.value;
        
    })
    $("#attendanceSlider").mouseup(function() {
        attendanceP = this.value;
        
    })
    $("#testscoresSlider").mouseup(function() {
        testscoresP = this.value;
        
    })
    $("#genderSlider").mouseup(function() {
        genderP = this.value;
        
    })
    $("#raceSlider").mouseup(function() {
        raceP = this.value;
        
    })
    worldStage.on("click", function(evt) {
        tooltip_target = evt.target.parent;
        tooltip.text = " " + evt.target.parent.teacherBio;
        
        worldStage.update();
    });

    $("#eventButton").click(function() {
        // Calculate the new Teacher of the Year
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

        // Tween the Crown to directly above that Teacher
        createjs.Tween.get(crownShape).to({x: TeacherOfTheYear.shapex, y: crownShape.y}, 30*(101-tweenSpeed), createjs.Ease.quadInOut);//.call(tweenComplete);
    })

}

function populateLevel_3() {
	$(".level1").hide();
    $(".level2").hide();
    $(".level3").show();

    worldCanvas = document.getElementById("myWorldCanvas");
	worldStage = new createjs.Stage(worldCanvas);
    spriteArray = new Array();
    deadArray = new Array();
    worldPopulation = 20;
    //TOTALWORLDCYCLES = TOTALWORLDCYCLES * worldPopulation;
    TOTALWORLDCYCLES = 20;
    deathToll = 0;
    movex = worldCanvas.width / 2;
    movey = worldCanvas.height / 2;
    graveyard = {height: 50, width: worldCanvas.width};
    bank = {height: worldCanvas.height/4, width: worldCanvas.width/4};
    prison = {height: worldCanvas.height/4, width: worldCanvas.width/4};
    company = {height: worldCanvas.height/4, width: worldCanvas.width/4};
    misogyny = .8;
    racism = .8;
    tooltip = new createjs.Text("");
    onlyOnce = true;
    finishedTweens = 0;
    tweenSpeed = 50;

    tooltip.x = tooltip.y = 10;
    prisonShape = new createjs.Shape();
    prisonShape.graphics.beginFill('red').drawRect(0,0,prison.width, prison.height);
    prisonShape.x = 0;
    prisonShape.y = worldCanvas.height - prison.height - graveyard.height;

    bankShape = new createjs.Shape();
    bankShape.graphics.beginFill('green').drawRect(0, 0, bank.width, bank.height);
    bankShape.x = worldCanvas.width - (worldCanvas.width/4 + bank.width/2);
    bankShape.y = 0 + worldCanvas.height/4 - bank.height/2;

    companyShape = new createjs.Shape();
    companyShape.graphics.beginFill('blue').drawRect(0,0,company.width, company.height);
    companyShape.x = 0 + worldCanvas.width/4 - company.width/2;
    companyShape.y = 0 + worldCanvas.height/4 - company.height/2;

    graveyardShape = new createjs.Shape();
    graveyardShape.graphics.beginFill('grey').drawRect(0, 0, graveyard.width, graveyard.height);
    graveyardShape.x = 0;
    graveyardShape.y = worldCanvas.height - graveyard.height;

    whiteMortality = 0;
    colorMortality = 0;
    maleMortality = 0;
    femaleMortality = 0;
    whitewealth = 0;
    colorwealth = 0;
    malewealth = 0;
    femalewealth = 0;

    worldStage.addChild(prisonShape);
    worldStage.addChild(bankShape);
    worldStage.addChild(companyShape);
    worldStage.addChild(graveyardShape);
    worldStage.addChild(tooltip);
    worldStage.update();
    
    worldStage.on("click", function(evt) {
        tooltip_target = evt.target.parent;
        //This removal of rendering doesn't work at all.
        spriteArray.forEach(function(sprite, i) {
            sprite.selected = false;
            sprite.reRender();
        });
        evt.target.parent.selected = true;
        evt.target.parent.reRender();
        
        tooltip.text = " " + evt.target.parent.name +", "+(evt.target.parent.gender == 0 ? "Male" : "Female") +
        ", "+(evt.target.parent.race == 0 ? "White" : "Color") + 
        ", "+(evt.target.parent.employed == false ? "Unemployed" : "Employed") +
        ", Wealth: "+(100-evt.target.parent.wealth).toFixed(0) +
        ", "+ (evt.target.parent.imprisoned == true? "Imprisoned" : "");

// If the click was on one of the world entities, update the checkbox area to reflect that entity
        if(evt.target == companyShape) {
            $(".lvl3BankSelectors").hide();
            $(".lvl3PrisonSelectors").hide();
            $(".lvl3CompanySelectors").show();
        }
        if(evt.target == bankShape) {
            $(".lvl3CompanySelectors").hide();
            $(".lvl3PrisonSelectors").hide();
            $(".lvl3BankSelectors").show();
        }
        if(evt.target == prisonShape) {
            $(".lvl3CompanySelectors").hide();
            $(".lvl3BankSelectors").hide();
            $(".lvl3PrisonSelectors").show();
        }

        worldStage.update();
    });

    for (var i = 0; i < worldPopulation; i++) {
        // Create and attach Body
        shapex = 0; 
        shapey = 0; 
        shaper = 10;
        shapeRace = 100*Math.random() | 0;
        shapeGender = 100*Math.random() | 0;
        shapeInitWealth = Math.random();
        shapeInitWealth = Math.round(shapeInitWealth*40)+5; // a number 5-45
        console.log("DEBUG: shapeInitWealth is "+shapeInitWealth);
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
    spriteArray.forEach(function(citizen, i){createjs.Tween.get(citizen).to({x: movex, y: movey}, 1500, createjs.Ease.quadInOut)
    .call(function(citizen){console.log("DEBUG: citizen is now at ("+this.x+","+this.y+")");}).call(tweenComplete)});
    
    createjs.Ticker.addEventListener("tick", tick);
    
    $("#speedSlider").mouseup(function() {
        tweenSpeed = this.value;
        $("#currentSpeedLabel").text(this.value);
    })
    //Find more about handling checkbox events at this useful entry: https://stackoverflow.com/questions/3442322/jquery-checkbox-event-handling

    //$("#checkbox1").
    // The Event! Button represents (for now) a single move in the game. Will infinite loop eventually.
    

    //$("#eventButton").click(handleGo()); // End of Click Event Handler
        
	//worldStage.update();
	
	//update = true; 
}; // end of Populate Lvl3


function handleGo() { //This function is the main animation loop. It is re-executed after every Tween
        
    
    spriteArray.forEach (function(citizen, i){
        // Check if citizen is at the bank
        if(atBank(citizen, bank, bankShape)) {
            if(calculateLoan(citizen, racism, misogyny)) {
                if(citizen.wealth > 25) {
                    citizen.wealth -= 25;
                }
                else {
                    citizen.wealth = 5;
                }
                console.log("DEBUG: "+citizen.name + " received a loan!");
            }
            else {
                console.log("DEBUG: "+citizen.name + " was rejected for a bank loan!");
            }
            
        }

        // Check if citizen is in prison
        if(atPrison(citizen, prison, prisonShape)) {
            if(citizen.imprisoned == false) {
                if(calculateSentence(citizen, racism, misogyny)) {
                    console.log("DEBUG: "+citizen.name + " has been put in prison. Timer: "+citizen.prisonTimer);
                    citizen.imprisoned = true;
                    citizen.employed = false;
                    citizen.jobHistory = false;
                    citizen.jobTimer = 5;
                    citizen.prisonHistory = true;
                }
                else {
                    console.log("DEBUG: "+citizen.name + " was released without a prison sentence!");
                }
                
            }
            if(citizen.imprisoned == true) {
                citizen.prisonTimer -= 1;
                if(citizen.prisonTimer <= 0) {
                    console.log("DEBUG: "+citizen.name + " has been released from prison!");
                    citizen.imprisoned = false;
                    citizen.prisonTimer = 7;
                    // move citizen to random non-prison spot
                    citizenx = prison.width + ((worldCanvas.width-prison.width) * Math.random() | 0)
                    citizeny = ((worldCanvas.height-prison.height) * Math.random() | 0)
                }
                else {
                    console.log("DEBUG: "+citizen.name + " is still in prison. Timer: "+citizen.prisonTimer);
                    citizenx = citizen.x;
                    citizeny = citizen.y;
                }
            }
            
        }

        // Check if citizen is at the Company
        if(atCompany(citizen, company, companyShape)) {
            if(citizen.employed == false) {
                console.log("DEBUG: "+citizen.name + " is applying for a job.");
                // TODO: make some calculation to determine jobworthiness
                if(calculateJobOffer(citizen, racism, misogyny)) {
                    console.log("DEBUG: "+citizen.name + " received a job!");
                    citizen.employed = true;
                    citizen.jobHistory = true;
                }
                else {
                    console.log("DEBUG: "+citizen.name + " didn't get the job.");
                }
                
            }
            
        }
        
        // Pay Salary to employed Citizens
        if(citizen.employed) {
            if(citizen.wealth > 15) {
                citizen.wealth -= 15;
            }
            else {
                citizen.wealth = 5;
            }
            console.log("DEBUG: "+citizen.name + " earned a salary!");
            citizen.jobTimer -= 1;
            if(citizen.jobTimer <= 0) {
                console.log("DEBUG: "+citizen.name + " has retired from a job.");
                citizen.employed = false;
                citizen.jobHistory = true;
                citizen.jobTimer =10; // greater than the init value, because repeat jobs last longer
                // Move citizen to a non-company spot
                citizenx = company.width + ((worldCanvas.width-prison.width) * Math.random() | 0)
                citizeny = company.height + ((worldCanvas.height - prison.height) * Math.random() | 0)
            }
        }

        // Decrement Wealth
        citizen.wealth += 5;
        citizen.reRender();
        //citizen.bodyShape.draw();

        // Determine mortality and move accordingly
        if(citizen.wealth > 85){
            citizenx = graveyard.width - 25*deathToll;
            citizeny = worldCanvas.height - graveyard.height / 2;
            deathToll += 1;
            deadArray.push(spriteArray.splice(i,1));
            console.log("DEBUG: "+citizen.name + " has died.");
        }
        // If not imprisoned and not dead, perform Random Move
        else {
            if(citizen.imprisoned == false) {
                if(inQuadrantOne(citizen, worldCanvas)) {
                    citizenx = 15 + ((worldCanvas.width/2)*Math.random() | 0);
                    citizeny = worldCanvas.height/2 + (((worldCanvas.height-50)/2)*Math.random() | 0);
                }
                else if(inQuadrantTwo(citizen, worldCanvas)) {
                    citizenx = worldCanvas.width/2 + ((worldCanvas.width/2)*Math.random() | 0);
                    citizeny = worldCanvas.height/2 + (((worldCanvas.height-50)/2)*Math.random() | 0);
                }
                else if(inQuadrantThree(citizen, worldCanvas)) {
                    citizenx = worldCanvas.width/2 + ((worldCanvas.width/2)*Math.random() | 0);
                    citizeny = 15 + (((worldCanvas.height-50)/2)*Math.random() | 0);
                }
                else if(inQuadrantFour(citizen, worldCanvas)) {
                    citizenx = 15 + ((worldCanvas.width/2)*Math.random() | 0);
                    citizeny = 15 + (((worldCanvas.height-50)/2)*Math.random() | 0);
                }
                else {
                    citizenx = 15 + (400 * Math.random() | 0)
                    citizeny = 15 + (350 * Math.random() | 0)
                }
                
            }
            
        }
        
        onlyOnce = true;
        createjs.Tween.get(citizen).to({x: citizenx, y: citizeny}, 30*(101-tweenSpeed), createjs.Ease.quadInOut).call(tweenComplete); //, createjs.Ease.getPowInOut(2))
    /*.call(function(citizen){
        console.log("DEBUG: "+this.name +","+this.wealth+"% is now at (" +this.x+","+this.y+"). Living Population: "+spriteArray.length+".");
    })*/;
    
    }); //end of foreach Sprite Loop

    //reminder, 0=white, 1=color
    
    //worldStage.update();
    
    var whitedead = 0, colordead = 0;
    var whitepop = 0, colorpop = 0;
    var maledead = 0, femaledead = 0;
    var malepop = 0, femalepop = 0;
    var malewealth = 0, femalewealth = 0;
    var whitewealth = 0, colorwealth = 0;

    deadArray.forEach(function(citizen, y){
        if(citizen[0].race < 1){ //Note: the deadArray is populated with single-member arrays (not just citizens) because of the use of Splice() to fill it, which returns arrays not elements.
            whitedead += 1;
        }
        else{
            colordead += 1;
        }
        if(citizen[0].gender < 1){
            maledead += 1;
        }
        else{
            femaledead += 1;
        }
        //console.log("Citizen "+y+" has race "+citizen[0].race)
    });
    spriteArray.forEach(function(citizen, b){
        if(citizen.race < 1){
            whitepop += 1;
            whitewealth += (100 - citizen.wealth)
        }else{
            colorpop += 1;
            colorwealth += (100 - citizen.wealth)
        }
        
        if(citizen.gender < 1){
            malepop += 1;
            malewealth += (100 - citizen.wealth)
        }else{
            femalepop += 1;
            femalewealth += (100 - citizen.wealth)
        }
    });

    //Update tooltip
    if(currentLevel == 3){
    tooltip.text = " " + tooltip_target.name +", "+(tooltip_target.gender == 0 ? "Male" : "Female") +
    ", "+(tooltip_target.race == 0 ? "White" : "Color") + 
    ", "+(tooltip_target.employed == false ? "Unemployed" : "Employed") +
    ", Wealth: "+(100-tooltip_target.wealth).toFixed(0) +
    ", "+ (tooltip_target.imprisoned == true? "Imprisoned" : "");
    }
    // I am here deliberately calculating per-person wealth before dead population is added to the total pop
    whitewealth = whitewealth / whitepop;
    colorwealth = colorwealth / colorpop;
    malewealth = malewealth / malepop;
    femalewealth = femalewealth / femalepop;

    whitepop += whitedead;
    colorpop += colordead;
    malepop += maledead;
    femalepop += femaledead;
    whiteMortality = 100*(whitedead / whitepop);
    colorMortality = 100*(colordead / colorpop);
    maleMortality = 100*(maledead / malepop);
    femaleMortality = 100*(femaledead / femalepop);
    
    
    


} // End of HandleGo, the main animation loop.

function tweenComplete() {
    finishedTweens++;
    console.log ("DEBUG::: TOTALWORLDCYCLES = "+TOTALWORLDCYCLES + " movedThisTurn: "+finishedTweens)
    if(finishedTweens >= spriteArray.length && TOTALWORLDCYCLES > 0) {
        TOTALWORLDCYCLES --;
        onlyOnce = false;
        finishedTweens = 0;
        handleGo();
        
    }
}
function tick(tickEvent) {
    $("#mortalityRaceWhite").text(whiteMortality.toFixed(1));
    $("#mortalityRaceColor").text(colorMortality.toFixed(1));
    $("#mortalityGenderMale").text(maleMortality.toFixed(1));
    $("#mortalityGenderFemale").text(femaleMortality.toFixed(1));
    $("#wealthRaceWhite").text(whitewealth.toFixed(1));
    $("#wealthRaceColor").text(colorwealth.toFixed(1));
    $("#wealthGenderMale").text(malewealth.toFixed(1));
    $("#wealthGenderFemale").text(femalewealth.toFixed(1));
    worldStage.update(tickEvent);
}
function atCompany(c, comp, compShape) {
    if(c.x < compShape.x + comp.width && 
        c.x > compShape.x &&
        c.y > compShape.y && 
        c.y < compShape.y+comp.height) 
       {
            return true;
       }
       else
       {
           return false;
       }
}
function atPrison(c, pr, prshape) {
    if(c.x < prshape.x + pr.width && 
        c.x > prshape.x &&
        c.y > prshape.y && 
        c.y < prshape.y+pr.height) 
       {
            return true;
       }
       else
       {
           return false;
       }
}
function atBank(c, ba, bshape) {
    if(c.x < bshape.x + ba.width && 
        c.x > bshape.x &&
        c.y > bshape.y && 
        c.y < bshape.y+ba.height) 
       {
            return true;
       }
       else
       {
           return false;
       }
}
function calculateSentence(c, r, m) {
    var score = r*c.race// + m*c.gender;
    console.log("---DEBUG: citizen imprisonment score: "+score);
    if(score > 0) {
        return true;
    }
    else {
        return false;
    }
}
function calculateJobOffer(c, r, m) {
    var score = r*c.race + m*c.gender;
    console.log("---DEBUG: citizen employment score: "+score);
    if(score > 0) {
        return false;
    }
    else {
        return true;
    }
}
function calculateLoan(c, r, m) {
    var score = r*c.race + m*c.gender;
    console.log("---DEBUG: citizen loan score: "+score);
    if(score > 0) {
        return false;
    }
    else {
        return true;
    }
}
function inQuadrantOne(c, wc) {
    var width = wc.width / 2;
    var height = (wc.height-50) / 2;
    if(c.x < width && c.y < height) {
        return true;
    }
    else {
        return false;
    }
}
function inQuadrantTwo(c, wc) {
    var width = wc.width / 2;
    var height = (wc.height-50) / 2;
    if(c.x < width && c.y >= height) {
        return true;
    }
    else {
        return false;
    }
}
function inQuadrantThree(c, wc) {
    var width = wc.width / 2;
    var height = (wc.height-50) / 2;
    if(c.x >= width && c.y >= height) {
        return true;
    }
    else {
        return false;
    }
}
function inQuadrantFour(c, wc) {
    var width = wc.width / 2;
    var height = (wc.height-50) / 2;
    if(c.x >= width && c.y < height) {
        return true;
    }
    else {
        return false;
    }
}
/*function fireEvent() {
    var event = new createjs.Event("GO");

    new createjs.EventDispatcher().dispatchEvent(event);
};*/


