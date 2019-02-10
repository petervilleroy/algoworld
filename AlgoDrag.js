var worldCanvas, boxCanvas, boxStage;

var mouseTarget;	// the display object currently under the mouse, or being dragged
var dragStarted;	// indicates whether we are currently in a drag operation
var offset;
var update = true;


function init() {//Draw a square on screen.
    worldCanvas = document.getElementById("myWorldCanvas");
	worldStage = new createjs.Stage(worldCanvas);
	boxCanvas = document.getElementById("myBoxCanvas");
	boxStage = new createjs.Stage('myBoxCanvas');
    var shape = new createjs.Shape();
    shape.graphics.beginFill('blue').drawCircle(30, 60, 10);
    worldStage.addChild(shape);
    worldStage.update();

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
	boxStage.update();
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
        bitmap.scale = bitmap.originalScale = 1;
        bitmap.name = "bmp_" + i;
		bitmap.cursor = "pointer";
		/*bitmap.x = 0;
		bitmap.y = 0;
		bitmap.name = "bmp_2";*/

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
        }
    } 
}
