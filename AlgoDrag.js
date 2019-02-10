var canvas, boxStage;

var mouseTarget;	// the display object currently under the mouse, or being dragged
var dragStarted;	// indicates whether we are currently in a drag operation
var offset;
var update = true;


function init() {//Draw a square on screen.
    canvas = document.getElementById("myBoxCanvas");
	boxStage = new createjs.Stage('myBoxCanvas');
    /*var shape = new createjs.Shape();
    shape.graphics.beginFill('beige').drawRoundRect(0, 0, 230, 60,10);
    boxStage.addChild(shape);
    var txt = new createjs.Text("Hello World", "40px Arial", "#ff7700");
    txt.x = shape.x + 10;
    txt.y = shape.y + 10;
    boxStage.addChild(txt);
    boxStage.update();*/

    boxStage.enableMouseOver(10);
    boxStage.mouseMoveOutside = true;
    
    var image = new Image();
	image.src = "./img/HelloWorld.bmp";
    image.onload = handleImageLoad;
    
    //Trying different Image creation technique to avoid CORS security warnings
    /*var image = document.createElement("img");
    image.crossOrigin = "Anonymous"; // Should work fine
    image.src = "./img/HelloWorld.bmp";
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
        var i = 0;
		bitmap = new createjs.Bitmap(image);
		container.addChild(bitmap);
		bitmap.x = canvas.width * Math.random() | 0;
		bitmap.y = canvas.height * Math.random() | 0;
		bitmap.rotation = 360 * Math.random() | 0;
		bitmap.regX = bitmap.image.width / 2 | 0;
		bitmap.regY = bitmap.image.height / 2 | 0;
        bitmap.scale = bitmap.originalScale = Math.random() * 0.4 + 0.6;
        bitmap.name = "bmp_" + i;
		bitmap.cursor = "pointer";

		// using "on" binds the listener to the scope of the currentTarget by default
		// in this case that means it executes in the scope of the button.
		bitmap.on("mousedown", function (evt) {
			this.parent.addChild(this);
			this.offset = {x: this.x - evt.boxStageX, y: this.y - evt.boxStageY};
		});

		// the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
		bitmap.on("pressmove", function (evt) {
			this.x = evt.boxStageX + this.offset.x;
			this.y = evt.boxStageY + this.offset.y;
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
    /*createjs.Ticker.addEventListener("tick", tick);
    
    function tick(event) {
        // this set makes it so the stage only re-renders when an event handler indicates a change has happened.
        if (update) {
            update = false; // only update once
            stage.update(event);
        }
    } */
}
