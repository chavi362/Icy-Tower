let minmumBlockWidth;
let horizontalDistance;
let velocity;
let parameter = new URLSearchParams(document.location.search);
let level = parameter.get('level');
switch (level) {
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
let canvas = document.getElementById('myCanvas');
let context = canvas.getContext('2d');
let scoreSpan = document.querySelector('#score-span');
scoreSpan.innerHTML = score;
let blockImage = new Image();
blockImage.src = '../image/first_block.png';
let secondBlockImg = new Image();
secondBlockImg.src = '../image/second-block.png';
let thirdBlockImg = new Image();
thirdBlockImg.src = '../image/third-block.png';
let typeOfImg = 1;
let moveTosides2 = false;
let moveTosides3 = false;
let inMiddleOfJump = false;
let powerOfJump = -3;
let gradient = context.createLinearGradient(0, 0, canvas.width, 0);
let gradient2 = context.createLinearGradient(0, 0, canvas.width, 0);
gradient.addColorStop('0.2', 'magenta');
gradient.addColorStop('0.3', 'green');
gradient.addColorStop('1.0', 'red');
gradient2.addColorStop('0.2', 'red');
gradient2.addColorStop('0.3', 'green');
gradient2.addColorStop('1.0', 'blue');
let tex = "LET'S ";
let tex2 = 'START';
let tex3 = 'GAME OVER';
let texString1 = '';
let texString2 = '';
let alphabet_index = 0;
blockImage.addEventListener('load', () => {
  initBlocks();
});
class block {
  constructor(x, y, width, height, typeOfImg) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.scoreBlock = false;
    this.typeOfImg = typeOfImg;
  }
  IsUnderCharacter() {
    return character.y + character.height < this.y + this.height;
  }
}
function randomMinMax(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function drawBlocks() {
  blocks.forEach(function (item) {
    if (item.typeOfImg == 1)
      context.drawImage(blockImage, item.x, item.y, item.width, item.height);
    else if (item.typeOfImg == 2)
      context.drawImage(
        secondBlockImg,
        item.x,
        item.y,
        item.width,
        item.height
      );
    else
      context.drawImage(thirdBlockImg, item.x, item.y, item.width, item.height);
  });
}
let times = 0;
function movingScreen() {
  for (let i = 0; i < blocks.length; i++) {
    blocks[i].y = blocks[i].y + velocity[1];
    if (blocks[i].y > canvas.height) {
      blocks.splice(i, 1);
      addblock();
    }
  }
  if (moveTosides2 && !moveTosides3) {
    times++;
    if (times <= 3) {
      blocks[currentBlock].x = blocks[currentBlock].x + 8.5;
    }
    if (times <= 6 && times > 3) {
      blocks[currentBlock].x = blocks[currentBlock].x - 7;
      if (times == 6) times = 0;
    }
  } else if (moveTosides3) {
    times++;
    if (times < 3) {
      blocks[currentBlock].x = blocks[currentBlock].x + 13;
    }
    if (times <= 6 && times > 3) {
      blocks[currentBlock].x = blocks[currentBlock].x - 10;
      if (times == 6) times = 0;
    }
  }
}
function initBlocks() {
  blocks = [];
  let width = randomMinMax(
    minmumBlockWidth,
    canvas.width * 0.09 + minmumBlockWidth
  );
  let height = 6;
  let x = randomMinMax(100, canvas.width - height) % (canvas.width - width);
  let y = canvas.height - firstDistanceToBlocks - height;
  blocks.push(new block(x, y, width, height, typeOfImg));
  for (let i = 1; i < 5; i++) {
    width = randomMinMax(
      minmumBlockWidth,
      canvas.width * 0.09 + minmumBlockWidth
    );
    x =
      (randomMinMax(horizontalDistance, horizontalDistance * 1.2) +
        blocks[i - 1].x) %
      (canvas.width - width);
    y = blocks[i - 1].y - verticalDistance[0];
    blocks.push(new block(x, y, width, height, typeOfImg));
  }
  drawBlocks();
}
function letStart() {
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
  let i = blocks.length;
  let width = randomMinMax(
    minmumBlockWidth,
    canvas.width * 0.2 + minmumBlockWidth
  );
  let height = 6;
  let x =
    (randomMinMax(0.5 * horizontalDistance, horizontalDistance * 1.3) +
      blocks[0].x) %
    (canvas.width - width);
  let y = blocks[i - 1].y - verticalDistance - height * 1.5;
  blocks.push(new block(x, y, width, height, typeOfImg));
}
let hero = sessionStorage.getItem('hero');
let character = {
  x: canvas.width / 2 - 12.5,
  y: canvas.height - 20,
  height: 20,
  width: 25,
  distanceY: 0,
  distanceX: 0,
  onGround: true,
};
let characterImg = new Image();
characterImg.src = hero;
characterImg.addEventListener('load', () => {
  drawCharacter();
});
function characterUp() {
  character.onGround = false;
  if (!inMiddleOfJump) powerOfJump = -3;
  else powerOfJump += 0.2;
  if (powerOfJump >= -0.3) powerOfJump = -0.4;
  character.distanceY += powerOfJump;
  inMiddleOfJump = true;
}
function characterGoLeft() {
  character.distanceX = -2;
}
function characterGoRight() {
  character.distanceX = 2;
}

function updatePosition() {
  if (
    character.x + character.width + character.distanceX > canvas.width ||
    character.x + character.distanceX < 0
  ) {
    character.distanceX = -character.distanceX;
  }
  character.x += character.distanceX;
  if (character.y + character.distanceY < 0) character.distanceY = 0;
  character.y += character.distanceY;
}
function drawCharacter() {
  context.drawImage(
    characterImg,
    character.x,
    character.y,
    character.width,
    character.height
  );
}
const game = {
  gravity: 1.0,
  drag: 0.999,
  groundDrag: 0.9,
};
function checkState() {
  if (character.y + character.height >= canvas.height) {
    character.onGround = true;
    if (score / 3 > 3) {
      gameOver = true;
    } //gameover condition
  } else {
    character.onGround = false;
  }
  for (let i = 0; i < blocks.length; i++) {
    if (
      blocks[i].x < character.x + character.width - 0.15 * character.width &&
      character.x < blocks[i].x + blocks[i].width &&
      blocks[i].y <= character.y + character.height + 0.1 &&
      character.y + character.height < blocks[i].y + 6
    ) {
      character.onGround = true;
      currentBlock = i;
    }
  }
}
function updateScore() {
  blocks.forEach(function (block, index) {
    if (block.IsUnderCharacter()) {
      if (!block.scoreBlock) {
        score += 3;
        block.scoreBlock = true;
      }
    }
  });
  scoreSpan.innerHTML = score;
}
function gravity() {
  if (character.onGround == false) {
    character.distanceY += game.gravity;
    character.distanceY *= game.drag;
  } else {
    character.distanceY = 0;
  }
  character.distanceX *= character.onGround ? game.groundDrag : game.drag; //  לזוז בלי קשר מונע מx
}
function movingBlocks() {
  let counter = 0;
  while (counter < 15) {
    counter += 0.2;
    for (let i = 0; i < blocks.length; i++) {
      blocks[i].y = blocks[i].y + 0.2;
      if (blocks[i].y > canvas.height) {
        blocks.splice(i, 1);
        addblock();
      }
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBlocks();
    drawCharacter();
  }
  character.y += 0.2;
}
document.addEventListener('keydown', keyHandler);
document.addEventListener('keyup', keyHandler);
const keyboard = {
  right: false,
  left: false,
  up: false,
  any: false,
};
function keyHandler(e) {
  let state = e.type === 'keydown';
  if (e.keyCode == 39) {
    keyboard.right = state;
  } else if (e.keyCode == 37) {
    keyboard.left = state;
  } else if (e.keyCode == 38) {
    keyboard.up = state;
    e.preventDefault();
  }
  if (state) {
    keyboard.any = true;
  }
}
let gameOver = false;
mainLoop();
letStart();
let fondHighScore = false;
function mainLoop() {
  if (gameOver == false) {
    if (keyboard.any) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (keyboard.up) {
        characterUp();
      } else inMiddleOfJump = false;
      if (keyboard.left) {
        characterGoLeft();
      }
      if (keyboard.right) {
        characterGoRight();
      }
      updatePosition();
      if (score / 3 > 5) {
        movingScreen();
      }
      checkState();
      gravity();
      if (character.y < 70 && character.onGround) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        movingBlocks();
        character.onGround = false;
      }
      if (character.onGround) updateScore();
      if (score > 25 && !moveTosides2) {
        moveTosides2 = true;
        typeOfImg = 2;
        cancelAnimationFrame(mainLoop);
        secondBlockImg.addEventListener('load', () => {
          myanim = requestAnimationFrame(mainLoop);
        });
      }
      if (score > 50 && !moveTosides3) {
        moveTosides3 = true;
        typeOfImg = 3;
      }
      drawBlocks();
      drawCharacter();
    }
    myanim = requestAnimationFrame(mainLoop);
  } else {
    alphabet_index = 0;
    character.y += character.height / 2;
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBlocks();
    drawCharacter();
    tex2 = 'your score is ' + score;
    texString1 = ' ';
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (score > currentUser.highScore) {
      fondHighScore = true;
      console.log('if');
      let temp = currentUser.highScore;
      currentUser.highScore = score;
      currentUser.secondScore = temp;
    } else if (score > currentUser.secondScore && !fondHighScore) {
      fondHighScore = true;
      console.log('else if');
      currentUser.secondScore = score;
    }
    if (fondHighScore) {
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
drawCharacter();
mainLoop();
function gradientAnimation() {
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
    let overMOdal = document.getElementById('over-modal');
    overMOdal.style.display = 'block';
  }
}
let closeDiv = document.getElementById('close-modal');
closeDiv.addEventListener('click', () => {
  let overMOdal = document.getElementById('over-modal');
  overMOdal.style.display = 'none';
});
