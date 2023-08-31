let minmumBlockWidth;
let horizontalDistance;
let velocity;
let parameter = new URLSearchParams(document.location.search);
let level = parameter.get("level");
switch (level) {//defines some game's paramaters according to the level the user choosed
    case 'beginer':
        minmumBlockWidth = 112;
        horizontalDistance = 60;
        velocity = [0.15, 0.3];
        break;
    case 'advanced':
        minmumBlockWidth = 100;
        horizontalDistance = 70;
        velocity = [0.2, 0.6];
        break;
    default:
        minmumBlockWidth = 80;
        horizontalDistance = 85;
        velocity = [0.3, 0.8];
}
let blocks = [];
let heightToFirstBlock = 5;
let firstDistanceToBlocks = 26;
let verticalDistance = [27];
let score = 0;
let moveScreenFlag = false;
let canvas = document.getElementById("myCanvas");
let context = canvas.getContext('2d');
let scoreSpan = document.querySelector("#score-span");
scoreSpan.innerHTML = score;
const imagePaths = ["../image/first_block.png", "../image/second-block.png", "../image/third-block.png"];
const blockImages = imagePaths.map(path => {
  const image = new Image();
  image.src = path;
  return image;
});
let step = 0;
let inMiddleOfJump = false;
let powerOfJump = -3;
let gradient = context.createLinearGradient(0, 0, canvas.width, 0);
let gradient2 = context.createLinearGradient(0, 0, canvas.width, 0);
gradient.addColorStop("0.2", "magenta");
gradient.addColorStop("0.3", "green");
gradient.addColorStop("1.0", "red");
gradient2.addColorStop("0.2", "red");
gradient2.addColorStop("0.3", "green");
gradient2.addColorStop("1.0", "blue");
let tex = "LET'S ";
let tex2 = "START";
let tex3 = "GAME OVER";
let texString1 = '';
let texString2 = '';
let alphabet_index = 0;
blockImages[step].addEventListener("load", () => {
    initBlocks();
})
class block {
    constructor(x, y, width, height, step) {
        this.x = x; // The x-coordinate of the block
        this.y = y; // The y-coordinate of the block
        this.width = width; // The width of the block
        this.height = height; // The height of the block
        this.scoreBlock = false; // Flag to indicate if the block has been scored
        this.step = step; // The type of image for the block
    }

    IsUnderCharacter() {
        // Check if the block is under the character
        return character.y + character.height < this.y + this.height;
    }
}

function randomMinMax(min, max) {
    // Generate a random number between min and max (inclusive)
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function drawBlocks() {
    // Draw each block on the canvas
    blocks.forEach(function (item) {//Chooses the image according to the current step of the game 
        //(not the level you chose at the beginning but when you progress and accumulate points, the game becomes more difficult)
            context.drawImage(blockImages[step], item.x, item.y, item.width, item.height); 
    })
}
let times = 0;
function movingScreen() { //move the blocks 
    // Move each block downwards based on the velocity
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].y = blocks[i].y + velocity[1]; // Move the block downwards by adding the y-component of the velocity
        if (blocks[i].y > canvas.height) {//if one of the stone is underground
            blocks.splice(i, 1); // Remove the block if it goes beyond the canvas height
            addblock(); // Add a new block
        }
    }
    // Move the current block to the sides only if the game is in advanced step
    if (step==1) {
        times++; // Increase the times variable
        if (times <= 3) {
            blocks[currentBlock].x = blocks[currentBlock].x + 8.5; // Move the block to the right by adding 8.5 to its x-coordinate
        }
        if (times <= 6 && times > 3) {
            blocks[currentBlock].x = blocks[currentBlock].x - 7; // Move the block to the left by subtracting 7 from its x-coordinate
            if (times == 6)
                times = 0; // Reset the times variable to 0 when it reaches 6
        }
    }
    else if (step==2) {
        times++;
        if (times < 3) {
            blocks[currentBlock].x = blocks[currentBlock].x + 13;
        }
        if (times <= 6 && times > 3) {
            blocks[currentBlock].x = blocks[currentBlock].x - 10;
            if (times == 6)
                times = 0;
        }
    }
}
function initBlocks() {
    blocks = []; // Initialize the blocks array
    // Create the first block
    let width = randomMinMax(minmumBlockWidth, canvas.width * 0.09 + minmumBlockWidth); // Generate a random width for the block
    let height = 6; // Set the height of the block
    let x = randomMinMax(100, canvas.width - height) % (canvas.width - width); // Generate a random x-coordinate for the block
    let y = canvas.height - firstDistanceToBlocks - height; // Calculate the y-coordinate of the block
    blocks.push(new block(x, y, width, height, step)); // Add the block to the blocks array
    // Create the remaining blocks
    for (let i = 1; i < 5; i++) {
        width = randomMinMax(minmumBlockWidth, canvas.width * 0.09 + minmumBlockWidth); // Generate a random width for the block
        x = (randomMinMax(horizontalDistance, horizontalDistance * 1.2) + blocks[i - 1].x) % (canvas.width - width); // Calculate the x-coordinate of the block based on the previous block's position
        y = blocks[i - 1].y - verticalDistance[0]; // Calculate the y-coordinate of the block based on the previous block's position
        blocks.push(new block(x, y, width, height, step)); // Add the block to the blocks array
    }
    drawBlocks(); // Draw the blocks on the canvas
}
function letStart() {//animation with the words "let's start"
    if (alphabet_index < 5) {
        if (alphabet_index == 0) {
            context.fillStyle = gradient;
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawBlocks();
        }
        texString1 += tex[alphabet_index];
        console.log(texString1)
        texString2 += tex2[alphabet_index];
        console.log(texString2)
        context.font = "42px Pacifico";
        context.fillText(texString1, 60, 50);
        context.fillText(texString2, 50, 105);
        alphabet_index++;
        setTimeout(letStart, 200);
    }
    else {
        if (alphabet_index == 5) {
            texString1 = '';
            texString2 = '';
            context.beginPath();
            context.save();
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, canvas.width, canvas.height);
            texString1 = '';
            context.fillText(texString1, 60, 50);
            drawBlocks();
            drawCharacter();
        }
    }
}
function addblock() {
    // Get the current length of the blocks array
    let i = blocks.length;
    // Generate random width of the new block within a given range
    let width = randomMinMax(minmumBlockWidth, canvas.width * 0.2 + minmumBlockWidth);
    // Set the height of the new block
    let height = 6;
    // Calculate the x-coordinate of the new block based on the previous block's position
    let x = (randomMinMax(0.5 * horizontalDistance, horizontalDistance * 1.3) + blocks[0].x) % (canvas.width - width);
    // Calculate the y-coordinate of the new block based on the previous block's position
    let y = blocks[i - 1].y - verticalDistance - height * 1.5;
    // Create a new block object and add it to the blocks array
    blocks.push(new block(x, y, width, height, step));
}
// Get the selected hero from the session storage
let hero = sessionStorage.getItem('hero');
// Define the character object
let character = {
    x: canvas.width / 2 - 12.5,
    y: canvas.height - 20,
    height: 20,
    width: 25,
    distanceY: 0,
    distanceX: 0,
    onGround: true,
};
// Create a new image object for the character
let characterImg = new Image();
// Set the source of the character image to the selected hero
characterImg.src = hero;
// Add an event listener to the character image to trigger the drawCharacter function once it's loaded
characterImg.addEventListener("load", () => {
    drawCharacter();
});
function characterUp() {//Note that here, in js it is the opposite of a minus jump is a high jump
    // Set the character's onGround flag to false to indicate that it is in the air
    character.onGround = false;
    
    // Check if the character is not in the middle of a jump
    if (!inMiddleOfJump)
        powerOfJump = -3; // Set the initial jump power
        
    else
        powerOfJump += 0.2; // Increase the jump power if the character is already jumping
    
    // Limit the maximum jump power to -0.3
    if (powerOfJump >= -0.3)
        powerOfJump = -0.4;
    // Add the jump power to the character's vertical distance
    character.distanceY += powerOfJump;
    // Set the flag to indicate that the character is in the middle of a jump
    inMiddleOfJump = true;
};
function characterGoLeft() {
    // Set the character's horizontal distance to move left
    character.distanceX = -2;
};
function characterGoRight() {
    // Set the character's horizontal distance to move right
    character.distanceX = 2;
};
function updatePosition() {
    // Check if the character will go beyond the canvas boundaries
    if (character.x + character.width + character.distanceX > canvas.width || character.x + character.distanceX < 0) {
        character.distanceX = -character.distanceX; // Reverse the character's horizontal movement
    }
    character.x += character.distanceX; // Update the character's x-coordinate
    if (character.y + character.distanceY < 0)
        character.distanceY = 0; // Prevent the character from moving too high above the canvas
    character.y += character.distanceY; // Update the character's y-coordinate
}
function drawCharacter() {
    context.drawImage(characterImg, character.x, character.y, character.width, character.height); // Draw the character image on the canvas
}
const game = {
    gravity: 1.0,
    drag: 0.999,
    groundDrag: 0.9,
}
function checkState() {
    // Check if the character has reached the ground
    if (character.y + character.height >= canvas.height) {
        character.onGround = true; // Set the character's onGround flag to true
        
        if (score / 3 > 3) {
            gameOver = true; // Set the gameOver flag to true if a condition is met
        } // game over condition
    } else {
        character.onGround = false; // Set the character's onGround flag to false
    }

    // Check collision between the character and the blocks
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].x < character.x + character.width - 0.15 * character.width && character.x < blocks[i].x +
            blocks[i].width && blocks[i].y <= character.y + character.height + 0.1 && character.y + character.height < blocks[i].y + 6) {
            character.onGround = true; // Set the character's onGround flag to true if collision occurs
            currentBlock = i; // Store the index of the current block for reference
        }
    }
}
function updateScore() {
    // Iterate through each block in the blocks array
    blocks.forEach(function (block, index) {
        // Check if the block is under the character
        if (block.IsUnderCharacter()) {
            // Check if the block has not been scored yet
            if (!block.scoreBlock) {
                score += 3; // Increase the score by 3
                block.scoreBlock = true; // Set the scoreBlock flag to true to indicate that the block has been scored
            }
        }
    })
    scoreSpan.innerHTML = score; // Update the score displayed on the screen
}

function gravity() {
    // Check if the character is not on the ground
    if (character.onGround == false) {
        character.distanceY += game.gravity; // Apply gravity to the character's vertical movement
        character.distanceY *= game.drag; // Apply drag to the character's vertical movement
    } else {
        character.distanceY = 0; // Reset the character's vertical movement to 0 when on the ground
    }
    
    // Adjust the character's horizontal movement based on whether it is on the ground or not
    character.distanceX *= character.onGround ? game.groundDrag : game.drag;
    // Note: This line allows the character to move horizontally without being affected by the groundDrag when it is on the ground
}

function movingBlocks() {
    let counter = 0;
    while (counter < 15) {
        counter += 0.2; // Increase the counter by 0.2 in each iteration
        for (let i = 0; i < blocks.length; i++) {
            blocks[i].y = blocks[i].y + 0.2; // Move each block downwards by 0.2
            if (blocks[i].y > canvas.height) {
                blocks.splice(i, 1); // Remove the block if it goes beyond the canvas height
                addblock(); // Add a new block
            }
        }
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        drawBlocks(); // Draw the blocks
        drawCharacter(); // Draw the character
    }
    character.y += 0.2; // Move the character downwards by 0.2
}

document.addEventListener("keydown", keyHandler); // Add event listener for keydown event
document.addEventListener("keyup", keyHandler); // Add event listener for keyup event

const keyboard = {
    right: false,
    left: false,
    up: false,
    any: false,
};

function keyHandler(e) {
    let state = e.type === "keydown"; // Check if the event type is keydown
    if (e.keyCode == 39) {
        keyboard.right = state; // Set the right property of the keyboard object based on the key state
    } else if (e.keyCode == 37) {
        keyboard.left = state; // Set the left property of the keyboard object based on the key state
    } else if (e.keyCode == 38) {
        keyboard.up = state; // Set the up property of the keyboard object based on the key state
        e.preventDefault(); // Prevent the default key up behavior (e.g., scrolling)
    }
    if (state) {
        keyboard.any = true; // Set the any property of the keyboard object to true if any key is pressed
    }
}
let gameOver = false;
mainLoop();
letStart();
let fondHighScore = false;
function mainLoop() {//the loop that works while the game. It calls the functions
    if (gameOver == false) {
        if (keyboard.any) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            if (keyboard.up) {
                characterUp();
            }
            else
                inMiddleOfJump = false;
            if (keyboard.left) {
                characterGoLeft();
            }
            if (keyboard.right) {
                characterGoRight();
            }
            updatePosition();
            if ((score / 3) > 5) {
                movingScreen();
            }
            checkState();
            gravity();
            if ((character.y < 70) && character.onGround) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                movingBlocks();
                character.onGround = false;
            }
            if (character.onGround)
                updateScore();
            if (score > 25 && !step==1) {
                step = 1;
                cancelAnimationFrame(mainLoop);
            }
            if (score > 50 && step!=2) {
                step = 2;
            }
            drawBlocks();
            drawCharacter();
        }
        myanim = requestAnimationFrame(mainLoop);
    }
    else {
        alphabet_index = 0;
        character.y += character.height / 2;
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBlocks();
        drawCharacter();
        tex2 = "your score is " + score;
        texString1 = ' ';
        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (score > currentUser.highScore) {
            fondHighScore = true;
            console.log("if");
            let temp = currentUser.highScore;
            currentUser.highScore = score;
            currentUser.secondScore = temp;
        }
        else if (score > currentUser.secondScore && !fondHighScore) {
            fondHighScore = true;
            console.log("else if");
            currentUser.secondScore = score;
        }
        if (fondHighScore) {
            let userInLocal = JSON.parse(localStorage.getItem(currentUser["userName"]));
            userInLocal.highScore = currentUser.highScore;
            userInLocal.secondScore = currentUser.secondScore;
            localStorage.setItem(currentUser["userName"], JSON.stringify(userInLocal));
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        cancelAnimationFrame(myanim);
        gradientAnimation();
    }
}
drawCharacter();
mainLoop();
function gradientAnimation() {//the animation in of game  over in the end of the game
    if (alphabet_index == 9) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBlocks();
        texString1 = '';
    }
    if (alphabet_index > 8) {
        context.fillStyle = gradient2;
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBlocks();
        context.font = "35px Pacifico";
        context.fillText(texString1, 20, 50);
        context.font = "25px Pacifico";
        context.fillText(tex2, 50, 80);
        texString1 += tex3[alphabet_index - 9];
    }
    else {
        context.fillStyle = gradient;
        texString1 += tex3[alphabet_index];
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBlocks();
        context.font = "35px Pacifico";
        context.fillText(texString1, 20, 50);
        context.font = "25px Pacifico";
        context.fillText(tex2, 50, 80);
    }
    alphabet_index += 1;
    if (alphabet_index <= 18)
        setTimeout(gradientAnimation, 100);
    else {//when we finished introduct "game over" twice
        let overMOdal = document.getElementById('over-modal');
        overMOdal.style.display = "block";
    }
}
let closeDiv = document.getElementById('close-modal');//add event listener to the x button in the closal model to close it
closeDiv.addEventListener("click", () => {
    let overMOdal = document.getElementById('over-modal');
    overMOdal.style.display = "none";
})


