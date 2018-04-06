var robot = require("robotjs");

function scrollLeft (x = 300,y = 500) {
	robot.moveMouse(x, y);

	robot.mouseToggle("down");
	robot.dragMouse(x + 300, y);
	robot.mouseToggle("up");
	robot.moveMouse(x, y);
}



function fillInput (x,y, text) {
	robot.moveMouse(x, y);
	robot.mouseClick('left', true);

	for (var i = 0; i < text.length; i++) {
		robot.keyTap(text[i]);
	}

	robot.keyTap("enter");
}


module.exports = {
	scrollLeft,
	fillInput,
};

