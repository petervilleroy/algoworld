var worldCanvas, worldStage;
var spriteArray, deadArray;
var currentLevel = 3;
var update = true;
var TOTALWORLDCYCLES;
var PAUSE;
var bankShape, prisonShape, companyShape, shapex, shapey, shaper, citizen, citizenx, citizeny;
var worldPopulation, deathToll;
var movex, movey;
var graveyard, bank, prison, company;
var misogyny, racism, employmentProb, loanProb, prisonProb;
var prisonRacism, bankRacism, companyRacism, bankMisogyny, companyMisogyny;
var prisonPrisonRelevant, bankPrisonRelevant, companyPrisonRelevant;
var tooltip,tooltip_target;
var onlyOnce, finishedTweens, tweenSpeed;
var whiteMortality, colorMortality, maleMortality, femaleMortality, whitewealth, colorwealth, malewealth, femalewealth;

//TODO: figure out a way to show wealth with a skinny-fat instead of full-empty
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



function init() {

    tweenSpeed = 50;
    // Button Handler functions for level navigation
   
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

    $("#pauseButton").click(function() {
        if(PAUSE) {
            console.log("--- DEBUG: Unpausing...");
            $("#pauseButton").text("PAUSE");
            PAUSE = false;
            finishedTweens = 0;
            handleGo();

        }
        else {
            console.log("--- DEBUG: Pausing...");
            $("#pauseButton").text("UN-PAUSE");
            PAUSE = true;
        }
        
        
    })
    
    $("#goButton").click(function() {
        spriteArray.forEach(function(citizen, i) {worldStage.removeChild(this)})
        worldStage = null;
        spriteArray = null;
        deadArray = null;
        worldPopulation = 20;
        TOTALWORLDCYCLES = 20;
        PAUSE = false;
        deathToll = 0;
        populateLevel_3();
    })
    $("#speedSlider").mouseup(function() {
        tweenSpeed = this.value;
        $("#currentSpeedLabel").text(this.value);
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
    PAUSE = false;
    deathToll = 0;
    movex = worldCanvas.width / 2;
    movey = worldCanvas.height / 2;
    graveyard = {height: 50, width: worldCanvas.width};
    bank = {height: worldCanvas.height/2, width: worldCanvas.width/2};//{height: worldCanvas.height/4, width: worldCanvas.width/4};
    prison = {height: worldCanvas.height/2, width: worldCanvas.width/2};//{height: worldCanvas.height/4, width: worldCanvas.width/4};
    company = {height: worldCanvas.height/2, width: worldCanvas.width/2};//{height: worldCanvas.height/4, width: worldCanvas.width/4};
    misogyny = 0;//.8;
    bankMisogyny = 0;//.8;
    companyMisogyny = 0;//.9;
    racism = 0;//.8;
    prisonRacism = 0;//.9;
    bankRacism = 0;//.7;
    companyRacism = 0;//.6;
    employmentProb = .25;
    loanProb = .25;
    prisonProb = .25;
    companyPrisonRelevant = false;
    bankPrisonRelevant = false;
    prisonPrisonRelevant = false;
    tooltip = new createjs.Text("");
    onlyOnce = true;
    finishedTweens = 0;
    

    tooltip.x = tooltip.y = 10;
    prisonShape = new createjs.Shape();
    prisonShape.graphics.beginFill('red').drawRect(0,0,prison.width, prison.height);
    prisonShape.x = 0;
    prisonShape.y = worldCanvas.height - prison.height - graveyard.height;
    prisonText = new createjs.Text("PRISON", "16pt Arial")
    prisonText.x = prisonShape.x + 5;
    prisonText.y = prisonShape.y + 5;

    bankShape = new createjs.Shape();
    bankShape.graphics.beginFill('green').drawRect(0, 0, bank.width, bank.height);
    bankShape.x = worldCanvas.width - (worldCanvas.width/4 + bank.width/2);
    bankShape.y = 0 + worldCanvas.height/4 - bank.height/2;
    bankText = new createjs.Text("Bank", "16pt Times New Roman", "orange");
    bankText.x = bankShape.x + 5;
    bankText.y = bankShape.y + 5;

    companyShape = new createjs.Shape();
    companyShape.graphics.beginFill('blue').drawRect(0,0,company.width, company.height);
    companyShape.x = 0 + worldCanvas.width/4 - company.width/2;
    companyShape.y = 0 + worldCanvas.height/4 - company.height/2;
    companyText = new createjs.Text("Company", "16pt Times New Roman", "white");
    companyText.x = companyShape.x + 5;
    companyText.y = companyShape.y + 5;

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
    worldStage.addChild(prisonText);
    worldStage.addChild(bankShape);
    worldStage.addChild(bankText);
    worldStage.addChild(companyShape);
    worldStage.addChild(companyText);
    worldStage.addChild(graveyardShape);
    worldStage.addChild(tooltip);
    worldStage.update();
    
    worldStage.on("click", function(evt) {
        if(evt.target == companyShape) {
            $(".lvl3BankSelectors").hide();
            $(".lvl3PrisonSelectors").hide();
            $(".lvl3CompanySelectors").show();
            $("#myBoxCanvas").css("border", "8px solid blue");
        }
        else if(evt.target == bankShape) {
            $(".lvl3CompanySelectors").hide();
            $(".lvl3PrisonSelectors").hide();
            $(".lvl3BankSelectors").show();
            $("#myBoxCanvas").css("border", "8px solid green");
        }
        else if(evt.target == prisonShape) {
            $(".lvl3CompanySelectors").hide();
            $(".lvl3BankSelectors").hide();
            $(".lvl3PrisonSelectors").show();
            $("#myBoxCanvas").css("border", "8px solid red");
        }
        else {
            tooltip_target = evt.target.parent;
            //remove selected shape for every sprite.
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
    
 
    //Find more about handling checkbox events at this useful entry: https://stackoverflow.com/questions/3442322/jquery-checkbox-event-handling

    //$("#checkbox1").
    // The Event! Button represents (for now) a single move in the game. Will infinite loop eventually.
    

    //$("#eventButton").click(handleGo()); // End of Click Event Handler
        
	//worldStage.update();
	
	//update = true; 
}; // end of Populate Lvl3


function handleGo() { //This function is the main animation loop. It is re-executed after every Tween
    //console.log("!!!DEBUG - Value of Bank Checkbox Race is "+ $("#bnkRace").prop("checked")); 
    companyPrisonRelevant = $("#jobCrimes").prop("checked");
    bankPrisonRelevant = $("#bnkCrimes").prop("checked");
    prisonPrisonRelevant = $("#prsCrimes").prop("checked");

 
    //Reminder: racism start values are bank: 0, company: 0, prison: 0
    bankRacism = 0;
    bankRacism += $("#bnkRace").prop("checked") ? 0.5 : 0; //if checked, racism increases .5
    bankRacism += $("#bnkAmazon").prop("checked") ? 0.1 : 0; //if checked, racism increases .1

    companyRacism = 0;
    companyRacism += $("#jobRace").prop("checked") ? 0.5 : 0; //if checked, racism increases .5
    companyRacism += $("#jobAmazon").prop("checked") ? 0.1 : 0; //if checked, racism increases .1

    prisonRacism = 0;
    prisonRacism += $("#prsRace").prop("checked") ? 0.9 : 0; //if checked, racism increases .5
    prisonRacism += $("#prsAmazon").prop("checked") ? 0.1 : 0; //if checked, racism increases .1
    
    //Reminder: misogyny start values are bank: 0, company: 0
    bankMisogyny = 0;
    bankMisogyny += $("#bnkGender").prop("checked") ? 0.5 : 0; //if checked, misogyny increases .5
    bankMisogyny += $("#bnkSexuality").prop("checked") ? 0.1 : 0; //if checked, misogyny increases .2
    bankMisogyny += $("#bnkAmazon").prop("checked") ? 0.1 : 0; //if checked, misogyny increases .1
    bankMisogyny += $("#bnkSalary").prop("checked") ? 0.1 : 0; //if checked, misogyny increases .1

    companyMisogyny = 0;
    companyMisogyny += $("#jobGender").prop("checked") ? 0.6 : 0; //if checked, misogyny increases .5
    companyMisogyny += $("#jobSexuality").prop("checked") ? 0.2 : 0; //if checked, misogyny increases .2
    companyMisogyny += $("#jobAmazon").prop("checked") ? 0.1 : 0; //if checked, misogyny increases .1
    companyMisogyny += $("#jobSalary").prop("checked") ? 0.1 : 0; //if checked, misogyny increases .1


    console.log("!!!DEBUG - Racism and Misogyny levels- \nBank   : "+ bankRacism+","+bankMisogyny+"\nCompany: "+companyRacism+","+companyMisogyny+"\nPrison : "+prisonRacism);
    spriteArray.forEach (function(citizen, i){
        // Check if citizen is at the bank
        if(atBank(citizen, bank, bankShape)) {
            if(calculateLoan(citizen, bankRacism, bankMisogyny)) {
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
                if(calculateSentence(citizen, prisonRacism, misogyny)) {
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
                
                if(calculateJobOffer(citizen, companyRacism, companyMisogyny)) {
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
    
    whitedead = 0, colordead = 0;
    whitepop = 0, colorpop = 0;
    maledead = 0, femaledead = 0;
    malepop = 0, femalepop = 0;
    malewealth = 0, femalewealth = 0;
    whitewealth = 0, colorwealth = 0;

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

   
    // I am here deliberately calculating per-person wealth before dead population is added to the total pop
    if(whitepop > 0) {whitewealth = whitewealth / whitepop;} else {whitewealth = 0}
    if(colorpop > 0) {colorwealth = colorwealth / colorpop;} else {colorwealth = 0}
    if(malepop > 0) {malewealth = malewealth / malepop;} else {malewealth = 0}
    if(femalepop > 0) {femalewealth = femalewealth / femalepop;} else {femalewealth = 0}

    whitepop += whitedead;
    colorpop += colordead;
    malepop += maledead;
    femalepop += femaledead;
    whiteMortality = 100*(whitedead / whitepop);
    colorMortality = 100*(colordead / colorpop);
    maleMortality = 100*(maledead / malepop);
    femaleMortality = 100*(femaledead / femalepop);
    
    
    //Update tooltip
    if(currentLevel == 3 && tooltip_target){
    tooltip.text = " " + tooltip_target.name +", "+(tooltip_target.gender == 0 ? "Male" : "Female") +
    ", "+(tooltip_target.race == 0 ? "White" : "Color") + 
    ", "+(tooltip_target.employed == false ? "Unemployed" : "Employed") +
    ", Wealth: "+(100-tooltip_target.wealth).toFixed(0) +
    ", "+ (tooltip_target.imprisoned == true? "Imprisoned" : "");
    };


} // End of HandleGo, the main animation loop.

function tweenComplete() {
    finishedTweens++;
    console.log ("DEBUG::: TOTALWORLDCYCLES = "+TOTALWORLDCYCLES + " movedThisTurn: "+finishedTweens)
    if(finishedTweens >= spriteArray.length && TOTALWORLDCYCLES > 0) {
        TOTALWORLDCYCLES --;
        onlyOnce = false;
        finishedTweens = 0;
        if(!PAUSE){
            handleGo();
        }
        
        
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
    if(prisonPrisonRelevant && c.prisonHistory) { // skip the calculations if the person has a prison sentence
        return true;
    }
    var randomSentence = (Math.random()*2)-1 + prisonProb; // a number between -1+PP and 1+PP.
    var score = r*c.race + randomSentence// + m*c.gender;
    console.log("---DEBUG: "+c.name+" imprisonment score: "+score);
    if(score > 1) {
        return true;
    }
    else {
        return false;
    }
}
function calculateJobOffer(c, r, m) {
    if(companyPrisonRelevant && c.prisonHistory) { // skip the calculations if the person has a prison history
        return false;
    }
    var randomOffer = (Math.random()*2)-1 + employmentProb; // a number between -1+EP and 1+EP.
    var score = (r*c.race + m*c.gender + 2*randomOffer) /2;
    console.log("---DEBUG: "+c.name+" employment score: "+score);
    
    if(score > 1) {
        return false;
    }
    else {
        return true;
    }
}
function calculateLoan(c, r, m) {
    if(bankPrisonRelevant && c.prisonHistory) { // skip the calculations if the person has a prison history
        return false;
    }
    var randomOffer = (Math.random()*2)-1 + loanProb;  // a number between -1+LP and 1+LP
    var score = (r*c.race + m*c.gender + 2*randomOffer) /2;
    console.log("---DEBUG: "+c.name+" loan score: "+score);
    if(score > 1) {
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


