class Modal {
  constructor(elementId) {
    this.modal = document.getElementById(elementId);
  }
  hide() { this.modal.style.display = 'none'; }
  show() { this.modal.style.display = 'block'; }
}

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

const modalGameOver = new Modal('over-modal')
const modalMusicAgreement = new Modal('agree-to-sound')

const urlParams = new URLSearchParams(document.location.search);
const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

const music = {
  isPlayMusic: false,
  background: new Audio('../audio/happy-day-113985.mp3'),
  success: new Audio('../audio/game-bonus-144751.mp3'),
  failure: new Audio('../audio/wah-wah-sad-trombone-6347.mp3'),
}

const gameConf = setGameConfig()
const keyboardEvents = ['keyup','keydown']
const keyboard = { right: false, left: false, up: false, any: false };
const gameState = {
  inMiddleOfJump: false,
  isGameOver: false,
  isHighScore: false,
  powerOfJump: -4,
  score: 0,
  step: 0,
  times: 0,
}

let blocks = [];
let gradient = context.createLinearGradient(0, 0, canvas.width, 0);
let gradient2 = context.createLinearGradient(0, 0, canvas.width, 0);
let tex = "LET'S ";
let tex2 = 'START';
let tex3 = 'GAME OVER';
let texString1 = '';
let texString2 = '';
let alphabet_index = 0;

let character = { // Define the character object
  x: canvas.width / 2 - 12.5,
  y: canvas.height - 20,
  height: 20,
  width: 25,
  distanceY: 0,
  distanceX: 0,
  onGround: true,
};

let characterImg = new Image(); // Create a new image object for the character
characterImg.src = gameConf.heroImagePath; // Set the source of the character image to the selected hero

const imagePaths = [
  '../image/first_block.png',
  '../image/second-block.png',
  '../image/third-block.png',
];

const blockImages = imagePaths.map((path) => {
  const image = new Image();
  image.src = path;
  return image;
});

// INIT /////////////
letStart();
modalMusicAgreement.show();

displayScore();
gradient.addColorStop('0.2', 'magenta');
gradient.addColorStop('0.3', 'green');
gradient.addColorStop('1.0', 'red');
gradient2.addColorStop('0.2', 'red');
gradient2.addColorStop('0.3', 'green');
gradient2.addColorStop('1.0', 'blue');

mainLoop();
drawCharacter();
//Check for mobile device

//Put events for touch based actions
let canvasElement = document.querySelector("canvas");
let touchStartX = 0;
let touchStartY=0;
let touchEndX=0;
let touchEndY=0
canvasElement.addEventListener("touchstart",(e)=>{
  touchStartX=e.changedTouches[0].screenX;
  touchStartY=e.changedTouches[0].screenY;
  if(e.touches.length === 1){
    console.log("up")
    keyboard.up = true;
    keyboard.any = true;
  }
  // keyboard.any = true;
},false)

canvasElement.addEventListener("touchmove",(e)=>{
  const delx = e.changedTouches[0].screenX - touchStartX;
  const dely = e.changedTouches[0].screenY - touchStartY;
  document.getElementById('score-span').innerHTML = "touchmove";
  if(Math.abs(delx) > Math.abs(dely)){
    if(delx > 0) {
      keyboard.right=true;
      document.getElementById('score-span').innerHTML = "right";
    }
    else {
      keyboard.left=true;
      document.getElementById('score-span').innerHTML = "left";
    }
  }
  else if(Math.abs(delx) < Math.abs(dely)){
      if(dely > 0) {
        console.log("down");
      }
      else {
        // keyboard.up=true;
        // document.getElementById('score-span').innerHTML = "up";
      }
  }
  else console.log("tap")
  keyboard.any = true;
})
canvasElement.addEventListener("touchend",(e)=>{
  keyboard.left=false;
  keyboard.right=false;
  keyboard.up=false;
  // keyboard.any=false;
})
// EVENTS /////////////
keyboardEvents.forEach((eventString)=>{
  document.addEventListener(eventString, (e)=>{
    let state = e.type === 'keydown'; // Check if the event type is keydown
    
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
  })
})

modalMusicAgreement.modal.querySelectorAll('button').forEach((el)=>{
  el.addEventListener('click', ()=>{
    modalMusicAgreement.hide();
    if(el.classList.contains('btn-agree')){
      music.isPlayMusic = true;
    }
  })
})

modalGameOver.modal.querySelector('#close-modal').addEventListener('click', ()=>{
  modalGameOver.hide()
})

blockImages[gameState.step].addEventListener('load', () => {
  initBlocks();
});

// Add an event listener to the character image to trigger the drawCharacter function once it's loaded
characterImg.addEventListener('load', () => {
  drawCharacter();
});

// FUNCTIONS /////////////
function setGameConfig(){
  const defaultConf = {
    minBlockWidth: 0,
    horizontalDistance: 0,
    verticalDistance: [27],
    firstDistanceToBlocks: 26,
    velocity: 0,
    difficulty: urlParams.get('level') || 'beginner',
    gravity: 1.0,
    drag: 0.999,
    groundDrag: 0.9,
    heroImagePath: sessionStorage.getItem('hero') || '../image/hero2_2.png'
  }

  let newConf = {}
  
  switch(defaultConf.difficulty){
    case 'beginner':
      newConf = { minBlockWidth: 112, horizontalDistance: 60, velocity: [0.15, 0.3] }
      break;
    case 'advanced':
      newConf = { minBlockWidth: 100, horizontalDistance: 70, velocity: [0.2, 0.6] }
      break;
    case 'champions':
      newConf = { minBlockWidth: 80, horizontalDistance: 85, velocity: [0.3, 0.8] }
      break;
    default:
      newConf = { minBlockWidth: 112, horizontalDistance: 60, velocity: [0.15, 0.3] }
      break;
  }
  
  Object.assign(defaultConf, {...defaultConf, ...newConf})

  return defaultConf
}

const moveChar = {
  up: function(){
    //Note that here, in js it is the opposite of a minus jump is a high jump
    // Set the character's onGround flag to false to indicate that it is in the air
    character.onGround = false;

    // Check if the character is not in the middle of a jump
  
    if (!gameState.inMiddleOfJump) gameState.powerOfJump = -3; // Set the initial jump power
    else gameState.powerOfJump += 0.2; // Increase the jump power if the character is already jumping

    // Limit the maximum jump power to -0.3
    if (gameState.powerOfJump >= -0.3) gameState.powerOfJump = -0.4;
    // Add the jump power to the character's vertical distance
    character.distanceY += gameState.powerOfJump;
    // Set the flag to indicate that the character is in the middle of a jump
    gameState.inMiddleOfJump = true;
    if (gameState.moveLeft){
      character.distanceX = -2;
      gameState.moveLeft=false;
    } else if(gameState.moveRight) {
      character.distanceX = 2;
      gameState.moveRight=false;
    }

  },
  left: function(){ 
    gameState.moveLeft = true;
    if (!gameState.inMiddleOfJump){
      character.distanceX = -2;
    }
  },
  right: function(){ 
    gameState.moveRight=true;
    if(!gameState.inMiddleOfJump){
      character.distanceX = 2;
    }
  }
}

function randomMinMax(min, max) {
  // Generate a random number between min and max (inclusive)
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function drawBlocks() {
  // Draw each block on the canvas
  blocks.forEach(function (item) {
    //Chooses the image according to the current step of the game
    //(not the level you chose at the beginning but when you progress and accumulate points, the game becomes more difficult)
    context.drawImage(
      blockImages[gameState.step],
      item.x,
      item.y,
      item.width,
      item.height
    );
  });
}

function movingScreen() {
  //move the blocks
  // Move each block downwards based on the velocity
  for (let i = 0; i < blocks.length; i++) {
    blocks[i].y = blocks[i].y + gameConf.velocity[1]; // Move the block downwards by adding the y-component of the velocity
    if (blocks[i].y > canvas.height) {
      //if one of the stone is underground
      blocks.splice(i, 1); // Remove the block if it goes beyond the canvas height
      addblock(); // Add a new block
    }
  }
  // Move the current block to the sides only if the game is in advanced step
  if (gameState.step == 1) {
    gameState.times++; // Increase the times variable
    if (gameState.times <= 3) {
      blocks[currentBlock].x = blocks[currentBlock].x + 8.5; // Move the block to the right by adding 8.5 to its x-coordinate
    }
    if (gameState.times <= 6 && gameState.times > 3) {
      blocks[currentBlock].x = blocks[currentBlock].x - 7; // Move the block to the left by subtracting 7 from its x-coordinate
      if (gameState.times == 6) gameState.times = 0; // Reset the times variable to 0 when it reaches 6
    }
  } else if (gameState.step == 2) {
    gameState.times++;
    if (gameState.times < 3) {
      blocks[currentBlock].x = blocks[currentBlock].x + 13;
    }
    if (gameState.times <= 6 && gameState.times > 3) {
      blocks[currentBlock].x = blocks[currentBlock].x - 10;
      if (gameState.times == 6) gameState.times = 0;
    }
  }
}

function initBlocks() {
  blocks = []; // Initialize the blocks array
  // Create the first block
  let width = randomMinMax(
    gameConf.minBlockWidth,
    canvas.width * 0.09 + gameConf.minBlockWidth
  ); // Generate a random width for the block
  let height = 6; // Set the height of the block
  let x = randomMinMax(100, canvas.width - height) % (canvas.width - width); // Generate a random x-coordinate for the block
  let y = canvas.height - gameConf.firstDistanceToBlocks - height; // Calculate the y-coordinate of the block
  blocks.push(new block(x, y, width, height, gameState.step)); // Add the block to the blocks array
  // Create the remaining blocks
  for (let i = 1; i < 5; i++) {
    width = randomMinMax(
      gameConf.minBlockWidth,
      canvas.width * 0.09 + gameConf.minBlockWidth
    ); // Generate a random width for the block
    x =
      (randomMinMax(gameConf.horizontalDistance, gameConf.horizontalDistance * 1.2) +
        blocks[i - 1].x) %
      (canvas.width - width); // Calculate the x-coordinate of the block based on the previous block's position
    y = blocks[i - 1].y - gameConf.verticalDistance[0]; // Calculate the y-coordinate of the block based on the previous block's position
    blocks.push(new block(x, y, width, height, gameState.step)); // Add the block to the blocks array
  }
  drawBlocks(); // Draw the blocks on the canvas
}

function letStart() {
  //animation with the words "let's start"
  if (alphabet_index < 5) {
    if (alphabet_index == 0) {
      context.fillStyle = gradient;
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawBlocks();
    }
    texString1 += tex[alphabet_index];
    console.log(texString1);
    texString2 += tex2[alphabet_index];
    console.log(texString2);
    context.font = '42px Pacifico';
    context.fillText(texString1, 60, 50);
    context.fillText(texString2, 50, 105);
    alphabet_index++;
    setTimeout(letStart, 200);
  } else {
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
  let width = randomMinMax(
    gameConf.minBlockWidth,
    canvas.width * 0.2 + gameConf.minBlockWidth
  );
  // Set the height of the new block
  let height = 6;
  // Calculate the x-coordinate of the new block based on the previous block's position
  let x =
    (randomMinMax(0.5 * gameConf.horizontalDistance, gameConf.horizontalDistance * 1.3) +
      blocks[0].x) %
    (canvas.width - width);
  // Calculate the y-coordinate of the new block based on the previous block's position
  let y = blocks[i - 1].y - gameConf.verticalDistance - height * 1.5;
  // Create a new block object and add it to the blocks array
  blocks.push(new block(x, y, width, height, gameState.step));
}

function updatePosition() {
  // Check if the character will go beyond the canvas boundaries
  if (
    character.x + character.width + character.distanceX > canvas.width ||
    character.x + character.distanceX < 0
  ) {
    character.distanceX = -character.distanceX; // Reverse the character's horizontal movement
  }
  character.x += character.distanceX; // Update the character's x-coordinate
  if (character.y + character.distanceY < 0) character.distanceY = 0; // Prevent the character from moving too high above the canvas
  character.y += character.distanceY; // Update the character's y-coordinate
}

function drawCharacter() {
  context.drawImage(
    characterImg,
    character.x,
    character.y,
    character.width,
    character.height
  ); // Draw the character image on the canvas
}

function checkState() {
  // Check if the character has reached the ground
  if (character.y + character.height >= canvas.height) {
    character.onGround = true; // Set the character's onGround flag to true

    if (gameState.score / 3 > 3) {
      gameState.isGameOver = true; // Set the isGameOver flag to true if a condition is met
    } // game over condition
  } else {
    character.onGround = false; // Set the character's onGround flag to false
  }

  // Check collision between the character and the blocks
  for (let i = 0; i < blocks.length; i++) {
    if (
      blocks[i].x < character.x + character.width - 0.15 * character.width &&
      character.x < blocks[i].x + blocks[i].width &&
      blocks[i].y <= character.y + character.height + 0.1 &&
      character.y + character.height < blocks[i].y + 6
    ) {
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
        gameState.score += 3; // Increase the score by 3
        block.scoreBlock = true; // Set the scoreBlock flag to true to indicate that the block has been scored
      }
    }
  });
  displayScore(); // Update the score displayed on the screen
}

function gravity() {
  // Check if the character is not on the ground
  if (character.onGround == false) {
    character.distanceY += gameConf.gravity; // Apply gravity to the character's vertical movement
    character.distanceY *= gameConf.drag; // Apply drag to the character's vertical movement
  } else {
    character.distanceY = 0; // Reset the character's vertical movement to 0 when on the ground
  }

  // Adjust the character's horizontal movement based on whether it is on the ground or not
  character.distanceX *= character.onGround ? gameConf.groundDrag : gameConf.drag;
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

function mainLoop() {
  //the loop that works while the game. It calls the functions
  if (music.isPlayMusic) {
    music.background.play();
  }

  if (gameState.isGameOver == false) {
    if (keyboard.any) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (keyboard.up) { moveChar.up(); } else { gameState.inMiddleOfJump = false; }
      if (keyboard.left) { moveChar.left(); }
      if (keyboard.right) { moveChar.right(); }

      updatePosition();

      if (gameState.score / 3 > 5) { movingScreen(); }

      checkState();
      gravity();
      
      if (character.y < 70 && character.onGround) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        movingBlocks();
        character.onGround = false;
      }

      if (character.onGround) { updateScore(); }

      if (gameState.score > 25 && !gameState.step == 1) {
        gameState.step = 1;
        if (music.isPlayMusic) { music.success.play(); }
        cancelAnimationFrame(mainLoop);
      }

      if (gameState.score > 50 && gameState.step != 2) {
        gameState.step = 2;
        if (music.isPlayMusic) { music.success.play(); }
      }

      drawBlocks();
      drawCharacter();
    }

    myanim = requestAnimationFrame(mainLoop);

  } else {
    if (music.isPlayMusic) {
      music.background.pause();
      music.failure.play();
    }

    alphabet_index = 0;
    character.y += character.height / 2;
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBlocks();
    drawCharacter();
    tex2 = 'your score is ' + gameState.score;
    texString1 = ' ';
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (gameState.score > currentUser.highScore) {
      gameState.isHighScore = true;
      console.log('if');
      let temp = currentUser.highScore;
      currentUser.highScore = gameState.score;
      currentUser.secondScore = temp;
    } else if (gameState.score > currentUser.secondScore && !gameState.isHighScore) {
      gameState.isHighScore = true;
      console.log('else if');
      currentUser.secondScore = gameState.score;
    }
    if (gameState.isHighScore) {
      let userInLocal = JSON.parse(
        localStorage.getItem(currentUser['userName'])
      );
      userInLocal.highScore = currentUser.highScore;
      userInLocal.secondScore = currentUser.secondScore;
      localStorage.setItem(
        currentUser['userName'],
        JSON.stringify(userInLocal)
      );
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    cancelAnimationFrame(myanim);
    gradientAnimation();
  }
}

function gradientAnimation() {
  //the animation in of game  over in the end of the game
  if (alphabet_index == 9) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBlocks();
    texString1 = '';
  }
  if (alphabet_index > 8) {
    context.fillStyle = gradient2;
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBlocks();
    context.font = '35px Pacifico';
    context.fillText(texString1, 20, 50);
    context.font = '25px Pacifico';
    context.fillText(tex2, 50, 80);
    texString1 += tex3[alphabet_index - 9];
  } else {
    context.fillStyle = gradient;
    texString1 += tex3[alphabet_index];
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBlocks();
    context.font = '35px Pacifico';
    context.fillText(texString1, 20, 50);
    context.font = '25px Pacifico';
    context.fillText(tex2, 50, 80);
  }
  alphabet_index += 1;
  if (alphabet_index <= 18) setTimeout(gradientAnimation, 100);
  else {
    //when we finished introduct "game over" twice
    modalGameOver.show()
  }
}

function displayScore(){
  document.querySelector('#score-span').innerHTML = gameState.score;
}