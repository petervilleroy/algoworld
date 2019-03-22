var worldCanvas, boxCanvas, boxStage;

var mouseTarget;	// the display object currently under the mouse, or being dragged
var dragStarted;	// indicates whether we are currently in a drag operation
var offset;
var update = true;
var currentLevel = 0;

function init() {//Draw a square on screen.
    worldCanvas = document.getElementById("myWorldCanvas");
	worldStage = new createjs.Stage(worldCanvas);
	boxCanvas = document.getElementById("myBoxCanvas");
	boxStage = new createjs.Stage('myBoxCanvas');
	switch(currentLevel) {
		case 0: 
			populateLevel_0();
			break;
		default: 
			populateLevel_0();
	}
	update = true;
	
	
    boxStage.enableMouseOver(10);
    boxStage.mouseMoveOutside = true;
		
    var image = new Image();
	image.src = "./img/HelloWorld.bmp";
    image.onload = handleImageLoad;
    
    //Trying different Image creation technique to avoid CORS security warnings
    /*var image = document.createElement("img");
    image.crossOrigin = "Anonymous"; // Should work fine
    image.src = "http://i.stack.imgur.com/OGtMI.jpg?s=32&g=1";
    temp = new createjs.Bitmap(image);
	temp.onload = handleImageLoad;*/
	//boxStage.update();
	update=true;
}

function populateLevel_0() {
	var shape, shapex, shapey, shaper;
	
	//All these shapes become children of WorldStage
	//TODO: consider bundling shapes into a container for easier access
	//      separate from other worldStage children.
	
	shape = new createjs.Shape();
	shapex = worldCanvas.width * Math.random() | 0;
	shapey = worldCanvas.height * Math.random() | 0;
	shaper = 10;
	console.log("Drawing circle at ("+shapex+", "+shapey+").")
	shape.graphics.beginFill('blue').drawCircle(shapex, shapey, shaper);
	shape.on("rollover", function (evt) {
		this.scale = this.originalScale * 1.2;
		update = true;
	});
	//teach the shape to move.
	shape.moveTo = moveShape;
	worldStage.addChild(shape);
	
	shape.moveTo(400,150,10);
	// assign color, size, icon according to rules TBD
	//worldStage.update();
	update = true;
}

function moveShape (xarg, yarg, t) {
	if (xarg - this.x > 5 || xarg - this.x < -5) {
		this.x += ((xarg - this.x) / 5);
	}
	else {
		this.x = xarg;
	}
	if (yarg - this.y > 5 || yarg - this.y < -5) {
		this.y += ((yarg - this.y) / 5);
	}
	else {
		this.y = yarg;
	}
	
	
	update = true;
}
function handleImageLoad(event) {
	var image = event.target;
	var bitmap;
	var container = new createjs.Container();
	boxStage.addChild(container);

	// create and populate the screen with random daisies:
	//for (var i = 0; i < 100; i++) {
        var i = 2;
		bitmap = new createjs.Bitmap(image);
		container.addChild(bitmap);
		bitmap.x = boxCanvas.width * Math.random() | 0;
		bitmap.y = boxCanvas.height * Math.random() | 0;
		//bitmap.rotation = 360 * Math.random() | 0;
		bitmap.regX = bitmap.image.width / 2 | 0;
		bitmap.regY = bitmap.image.height / 2 | 0;
        bitmap.scale = bitmap.originalScale = 0.5;
        bitmap.name = "bmp_" + i;
		bitmap.cursor = "pointer";
		

		// using "on" binds the listener to the scope of the currentTarget by default
		// in this case that means it executes in the scope of the button.
		bitmap.on("mousedown", function (evt) {
			this.parent.addChild(this);
			this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
		});

		// the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
		bitmap.on("pressmove", function (evt) {
			this.x = evt.stageX + this.offset.x;
			this.y = evt.stageY + this.offset.y;
			// indicate that the boxStage should be updated on the next tick:
			update = true;
		});

		bitmap.on("rollover", function (evt) {
			this.scale = this.originalScale * 1.2;
			update = true;
		});

		bitmap.on("rollout", function (evt) {
			this.scale = this.originalScale;
			update = true;
		});

	//}

	//examples.hideDistractor();
    createjs.Ticker.addEventListener("tick", tick);
    
    function tick(event) {
        // this set makes it so the stage only re-renders when an event handler indicates a change has happened.
        if (update) {
            update = false; // only update once
			boxStage.update(event);
			worldStage.update(event);
        }
    } 
}
