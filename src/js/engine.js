var animCounter = 0;// Controls the updating of animations
// Keyboard stuff
var key = [false,false,false,false]; //  Up, down, left, right
var up = 0, down = 1, left = 2, right = 3;
// Mouse stuff
var mouse_x = 0, mouse_y = 0, mouse_pressed = false;

/* My Code */
var GameState = {
	Menu: 0,
	MenuToGame: 1,
	Game: 2,
};

var current_level = test_level;

function Player(startx, starty, image_speed, move_speed, gravity, jumpSpeed, maskw, maskh) {
	this.x = startx;
	this.y = starty;
	
	this.img_spd = image_speed;
	this.mv_spd = move_speed;
	
	this.grav = gravity;
	this.jmp_spd = jumpSpeed;
	
	this.vsp = 0;
	this.hsp = 0;
	
	this.mask_w = maskw;
	this.mask_h = maskh;
	
	this.grounded = false;
	
	this.collision = new Rect(this.x, this.y, 64, 64);
}

var player = new Player(400, 300, 1, 8, 0.2, 7, 53, 60);

var game_state = GameState.Game;

function blockAt(checky, checkx) {
	return current_level[Math.floor(checky / 64)][Math.floor(checkx / 64)];
}

// Updates whenever possible (to be fast)
function Update() {
	switch(game_state) {
	case GameState.Menu: // Click to start
		if(mouse_pressed &&
			(mouse_x >= 300 && mouse_x <= 500 &&
			 mouse_y >= 275 && mouse_y <= 325)) { // Mouse is in box
			game_state = GameState.MenuToGame; // Wait for release
		}
		break;
	
	case GameState.MenuToGame:
		if(!mouse_pressed) {
			game_state = GameState.Game;
			// Play music in the background
			//bg_music.play();
		}
		break;
	
	case GameState.Game: // play the game
		// Player physics
		var move = key[right] - key[left];
		player.hsp = player.mv_spd * move;
		
		if(!player.grounded)
			player.vsp += player.grav;
		
		// Check y collision
		if(blockAt(player.y + player.mask_h + player.vsp, player.x + player.mask_w / 2) > 0) {
			while(blockAt(player.y + player.mask_h + 1, player.x + player.mask_w / 2) == 0)
				player.y += Math.sign(player.vsp);
			
			player.vsp = 0;
			player.grounded = true;
		}
		
		// Check x collision
		if(blockAt(player.y + player.mask_h / 2, player.x + player.mask_w + player.hsp) > 0) {
			while(blockAt(player.y + player.mask_h / 2, player.x + player.mask_w + 1) == 0)
				player.x += Math.sign(player.hsp);
			
			player.hsp = 0;
		} else if(player.x + player.hsp < 0) {
			player.x = 0;
			player.hsp = 0;
		}
		
		player.x += player.hsp;
		player.y += player.vsp;
		
		// Jump
		if(key[up] && player.grounded) {
			player.grounded = false;
			player.vsp -= player.jmp_spd;
		}
		break;
	}
}

// Updates every frame (60 fps)
function Render() {
	ctx.clearRect(0, 0, 800, 600); // Clear the screen
	
	switch(game_state) {
	case GameState.Menu:
	case GameState.MenuToGame:// start screen
		// Make a little button
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(300, 275, 200, 50);
		ctx.font = "30px Arial";
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText("Click to play!", 312, 310);
		break;
	
	case GameState.Game: // Actual test code
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, 800, 600);
		
		// Draw level map
		for(var y = 0; y < 10; y++)
			for(var x = 0; x < 13; x++)
				draw_block(current_level[y][x], x, y);
		
		// Draw player
		spr_chunks.draw(player.x, player.y, 64, 64, animCounter / player.img_spd);
		
		break;
	}
	
	animCounter++; //  Update the animation for all sprites every frame
}

function draw_block(block_id, x, y) {
	switch(block_id) {
	case 1: // Grass block
		spr_grass_block.draw(x * 64, y * 64, 64, 64, 0);
		break;
		
	case 2: // Dirt block
		spr_grass_block.draw(x * 64, y * 64, 64, 64, 1);
		break;
	}
}

// Key pressed event
function OnKeyDown(event) {
	switch(event.keyCode) {
		case 38:
			key[up] = true;
			break;
		
		case 40:
			key[down] = true;
			break;
			
		case 37:
			key[left] = true;
			break;
			
		case 39:
			key[right] = true;
			break;
	}
}

// Key released event
function OnKeyUp(event) {
	switch(event.keyCode) {
		case 38:
			key[up] = false;
			break;
		
		case 40:
			key[down] = false;
			break;
			
		case 37:
			key[left] = false;
			break;
			
		case 39:
			key[right] = false;
			break;
	}
}

// When the mouse is pressed
function OnMouseDown(event) {
	mouse_pressed = true;
	
	mouse_x = event.clientX;
	mouse_y = event.clientY;
}

function OnMouseUp(event) {
	mouse_pressed = false;
	
	mouse_x = event.clientX;
	mouse_y = event.clientY;
}
