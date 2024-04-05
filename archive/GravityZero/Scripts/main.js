// Canvas Setup
const canvas = document.getElementById('Frame')
const ctx = canvas.getContext('2d')
canvas.width = 485;
canvas.height = 402;
ctx.font = 'bold 25px Baloo';

//REQUIRE KEY VARIABLES
let time = 0;
let game = false;
let debug = false;
let speed = 1300;
const SpeedToMinus = 25;
const lowestSpeed = 800;

//debug script opener
let isShiftPressed = false;

document.addEventListener('keydown', function(event) {
  if (event.key === 'Shift' && !isShiftPressed && debug === false) {
    isShiftPressed = true;
    debug = true;
    console.log("document.debug =", debug);
  }
  if (event.key === 'Shift' && !isShiftPressed && debug === true) {
    isShiftPressed = true;
    debug = false;
    console.log("document.debug =", debug);
  }
});

document.addEventListener('keyup', function(event) {
  if (event.key === 'Shift') {
    isShiftPressed = false;
  }
});

// temporary button

function screenFull() {
  canvas.webkitRequestFullscreen()
}

// Load Images
// top wall //
const topWallImage = new Image();
topWallImage.src = 'Assets/topWall.svg';

// bottom wall //
const bottomWallImage = new Image();
bottomWallImage.src = 'Assets/bottomWall.svg';

// background //
const backgroundImage = new Image();
backgroundImage.src = 'Assets/Game_Background.svg';

// Mouse Interactivity & Key controls

const mouse = {
  x: 49,
  y: 295,
  click: false,
  key_space_pressed: false,
  keyDown: false
}

/* check for mouse click */
canvas.addEventListener('mousedown', function() {
  mouse.click = true;
  if (!cooldownInProgress) {
    startGame()
  }
  if (game === true) {
    if (mouse.y == 107.5) {
      mouse.y = 295;
    } else if (mouse.y == 295) {
      mouse.y = 107.5;
    }
  }
  if (debug === true && game) {
    console.log('mouse.click =', mouse.click, 'mouse.key_space_pressed =', mouse.key_space_pressed, 'mouse.keyDown =', mouse.keyDown);
  }
});

canvas.addEventListener('mouseup', function() {
  mouse.click = false;
  if (debug === true && game) {
    console.log('mouse.click =', mouse.click, 'mouse.key_space_pressed =', mouse.key_space_pressed, 'mouse.keyDown =', mouse.keyDown);
  }
});

/* check for key space clicked */
document.addEventListener('keydown', function(event) {
  mouse.key_space_pressed = true;
  if (event.key === ' ') {
    if (!cooldownInProgress) {
      startGame()
    }
  }
  if (game === true) {
    if (event.key === ' ') {
      if (mouse.keyDown == false) {
        if (mouse.y == 107.5) {
          mouse.y = 295;
          mouse.keyDown = true;
        } else if (mouse.y == 295) {
          mouse.y = 107.5;
          mouse.keyDown = true;
        }
      }
    }
    if (debug === true && game) {
      console.log('mouse.click =', mouse.click, 'mouse.key_space_pressed =', mouse.key_space_pressed, 'mouse.keyDown =', mouse.keyDown);
    }
  }
});

document.addEventListener('keyup', function(event) {
  if (event.key === ' ') {
    mouse.keyDown = false;
    mouse.key_space_pressed = false;
    if (debug === true && game) {
      console.log('mouse.click =', mouse.click, 'mouse.key_space_pressed =', mouse.key_space_pressed, 'mouse.keyDown =', mouse.keyDown);
    }
  }
});

// background
class topWall {
  constructor() {
    this.x = 242;
    this.y = 35;
    this.width = 485;
    this.height = 70;
  }

  draw() {
    ctx.beginPath();
    ctx.drawImage(topWallImage, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.closePath();
  }
}

class bottomWall {
  constructor() {
    this.x = 242;
    this.y = 367;
    this.width = 485;
    this.height = 70;
  }

  draw() {
    ctx.beginPath();
    ctx.drawImage(bottomWallImage, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.closePath();
  }
}

class background {
  constructor() {
    this.x = 242;
    this.y = 201;
    this.width = 485;
    this.height = 402;
  }

  draw() {
    ctx.beginPath();
    ctx.drawImage(backgroundImage, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.closePath();
  }
}

const TopWall = new topWall();
const BottomWall = new bottomWall();
const Background = new background();

// Player
class Player {
  constructor() {
    this.x = canvas.width;
    this.y = canvas.height / 2;
    this.width = 75;
    this.height = 75;
  }

  update() {
    function easeOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const duration = 1.5;
    const speed = distance / (duration * 60);
    const threshold = 1.5;

    if (distance > threshold) {
      const ratio = easeOutCubic(Math.min(1, speed * 30 / distance));
      this.x += dx * ratio;
      this.y += dy * ratio;
    } else {
      this.x = mouse.x;
      this.y = mouse.y;
    }
  }

  draw() {
    if (debug == true && game === true) {
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.closePath();
  }
}

const player = new Player();

// Enemies
let animate1 = false;
let animate2 = false;
let animationStartTime = 0;
let randomInProgress = false;

function random() {
  if (game === true && !randomInProgress) {
    randomInProgress = true;
    let step1 = 2 - 1 + 1;
    let step2 = Math.random() * step1;
    result = Math.floor(step2) + 1;
    if (debug === true) {
      console.log('enemy fired =', result)
    }

    animate1 = false;
    animate2 = false;

    if (result === 1) {
      animate1 = true;
    } else if (result === 2) {
      animate2 = true;
    }

    animationStartTime = performance.now();

    setTimeout(function() {
      randomInProgress = false;
    }, speed);

    setTimeout(function() {
      randomInProgress = false;
    }, cooldownDuration);

    setTimeout(random, speed);
  }
}

class enemy1 {
  constructor() {
    this.x = 520;
    this.y = 297;
    this.width = 70;
    this.height = 70;
    this.startX = 520;
    this.endX = -80;
    this.speed = (this.startX - this.endX) / speed;
  }

  update() {
    if (this.x <= this.endX) {
      this.x = this.startX;
    } else if (animate1) {
      const currentTime = performance.now();
      const elapsedTime = currentTime - animationStartTime;
      this.speed = (this.startX - this.endX) / speed;
      this.x = this.startX - elapsedTime * this.speed;
    } else {
      this.x = this.startX;
    }
  }


  draw() {
    if (debug == true && game === true) {
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.closePath();
  }
}

class enemy2 {
  constructor() {
    this.x = 520;
    this.y = 105;
    this.width = 70;
    this.height = 70;
    this.startX = 520;
    this.endX = -80;
    this.speed = (this.startX - this.endX) / speed;
  }

  update() {
    if (this.x <= this.endX) {
      this.x = this.startX;
    } else if (animate2) {
      const currentTime = performance.now();
      const elapsedTime = currentTime - animationStartTime;
      this.speed = (this.startX - this.endX) / speed;
      this.x = this.startX - elapsedTime * this.speed;
    } else {
      this.x = this.startX;
    }
  }

  draw() {
    if (debug == true && game === true) {
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.closePath();
  }
}

const Enemy1 = new enemy1();
const Enemy2 = new enemy2();

// stop & start game functions
let intervalId;
let gameStartedOnce = false;
let cooldownInProgress = false;
let cooldownDuration = 2000;

function startGame() {
  if (!cooldownInProgress) {
    if (game === false) {
      if (!gameStartedOnce) {
        game = true;
        gameStartedOnce = true;
        intervalId = setInterval(function() {
          if (game === true) {
            clearInterval(intervalId);
            random();
          }
        }, 10);
      } else if (!cooldownInProgress && !game) {
        game = true;
        intervalId = setInterval(function() {
          if (game === true) {
            clearInterval(intervalId);
            random();
          }
        }, 10);
      }
    }
  }
}

function stopGame() {
  if (game === true) {
    game = false;
    time = 0;
    speed = 1300;
    cooldownInProgress = true;
    if (debug === true) {
      console.log('coolDown =', cooldownInProgress)
    }
    setTimeout(function() {
      cooldownInProgress = false;
      if (debug === true) {
        console.log('coolDown =', cooldownInProgress)
      }
    }, cooldownDuration);
  }
}

// collision dectection
/* bottom enemy */
let enemy1collider;
let enemy2collider;
let playercollider;
let enemy1Width = Enemy1.width;
let enemy1Height = Enemy1.height;
let enemy2Width = Enemy2.width;
let enemy2Height = Enemy2.height;
let playerWidth = player.width;
let playerHeight = player.height;

/* check for collision with bottom enemy */

const checkEnemy1Collision = setInterval(function() {
  const enemy1collider = {
    x: Enemy1.x - Enemy1.width / 2,
    y: Enemy1.y - Enemy1.height / 2,
    width: enemy1Width,
    height: enemy1Height,
  };

  const playercollider = {
    x: player.x - player.width / 2,
    y: player.y - player.height / 2,
    width: playerWidth,
    height: playerHeight,
  };

  if (
    enemy1collider.x < playercollider.x + playercollider.width &&
    enemy1collider.x + enemy1collider.width > playercollider.x &&
    enemy1collider.y < playercollider.y + playercollider.height &&
    enemy1collider.y + enemy1collider.height > playercollider.y
  ) {
    stopGame()
  } else {
    return checkEnemy1Collision;
  }
}, 10);

/* top enemy */
const checkEnemy2Collision = setInterval(function() {
  const enemy2collider = {
    x: Enemy2.x - Enemy2.width / 2,
    y: Enemy2.y - Enemy2.height / 2,
    width: enemy2Width,
    height: enemy2Height,
  };

  const playercollider = {
    x: player.x - player.width / 2,
    y: player.y - player.height / 2,
    width: playerWidth,
    height: playerHeight,
  };

  if (
    enemy2collider.x < playercollider.x + playercollider.width &&
    enemy2collider.x + enemy2collider.width > playercollider.x &&
    enemy2collider.y < playercollider.y + playercollider.height &&
    enemy2collider.y + enemy2collider.height > playercollider.y
  ) {
    stopGame()
  } else {
    return checkEnemy2Collision;
  }
}, 10);

// keep track of time survived

setInterval(function() {
  if (game) {
    time++;
  }
}, 1000);

/* speed up game as time goes on */

function getRandomTime() {
  const randomValue = Math.floor(Math.random() * 5);
  return (randomValue + 5) * 1000;
}

let intervalTime = getRandomTime();

setInterval(function() {
  if (game && speed < lowestSpeed) {
    speed = lowestSpeed;
    if (debug) {
      console.log('enemy speed =', speed);
      console.log('interval time =', intervalTime);
    }
  } else if (game && speed >= lowestSpeed + SpeedToMinus) {
    speed -= SpeedToMinus;
    if (debug) {
      console.log('enemy speed =', speed);
      console.log('interval time =', intervalTime);
    }
  }
  intervalTime = getRandomTime();
}, intervalTime);

// TEST 

// Flag to track whether the webpage has fully loaded
let pageLoaded = false;
let loadingScreen = true; // Set this to true initially to display the loading screen

// Loading Background
class loadingBackground {
  constructor() {
    this.x = canvas.width / 2; // Center the background along the X-axis
    this.y = canvas.height / 2; // Center the background along the Y-axis
    this.width = 485;
    this.height = 402;
  }

  draw() {
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.closePath();
  }
}

const LoadingBackground = new loadingBackground();

// Image
const image = new Image();
image.src = 'Assets/Logo.svg'; // Replace with the path to your image
const imageWidth = 100; // Set the width of the image
const imageHeight = 130; // Set the height of the image

// Center the image both horizontally and vertically
function centerImage() {
  const imageX = canvas.width / 2 - imageWidth / 2;
  const imageY = 140; // Center vertically
  return { imageX, imageY };
}

// Variables for rocking the image
let angle = 0; // Initial angle
const amplitude = 20; // Adjust the amplitude of rocking (increase for more vertical movement)
const frequency = 0.08; // Adjust the frequency of rocking

// Game loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  Background.draw();
  Enemy1.update();
  Enemy1.draw();
  Enemy2.update();
  Enemy2.draw();
  player.update();
  player.draw();
  TopWall.draw();
  BottomWall.draw();
  ctx.fillStyle = 'white'
  ctx.fillText('Time: ' + time, 16, 43)
  if (loadingScreen) {
    // Draw the loading screen
    LoadingBackground.draw();

    // Calculate the rocking motion for the image
    const { imageX, imageY } = centerImage();
    const yOffset = amplitude * Math.sin(angle); // Calculate the Y-axis offset based on the sine wave
    ctx.drawImage(image, imageX, imageY - yOffset, imageWidth, imageHeight); // Draw the image with rocking motion
  }

  angle += frequency; // Increment the angle for animation
  requestAnimationFrame(animate);
}

// Function to smoothly return the image to the center quickly
function returnToCenter() {
  const returnDuration = 0.3 * 1000; // 0.5 seconds in milliseconds
  const startTimestamp = performance.now();
  const initialYOffset = amplitude * Math.sin(angle);

  function animateReturnToCenter(timestamp) {
    const elapsed = timestamp - startTimestamp;
    const returnRatio = Math.min(elapsed / returnDuration, 1);

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background
    LoadingBackground.draw();

    // Calculate the Y-axis offset based on the sine wave
    const yOffset = initialYOffset * (1 - returnRatio);

    // Draw the image at the center with reduced Y-axis offset
    const { imageX, imageY } = centerImage();
    ctx.drawImage(image, imageX, imageY - yOffset, imageWidth, imageHeight);

    // Continue the animation until fully returned to center
    if (returnRatio < 1) {
      requestAnimationFrame(animateReturnToCenter);
    } else {
      // Once returned to center, start fading out
      fadeOut();
    }
  }

  requestAnimationFrame(animateReturnToCenter);
}

// Function to fade out the image and loading background
function fadeOut() {
  const fadeDuration = 0.5 * 1000; // 0.5 seconds in milliseconds
  const startTimestamp = performance.now();

  function animateFadeOut(timestamp) {
    const elapsed = timestamp - startTimestamp;
    const fadeRatio = Math.min(elapsed / fadeDuration, 1);

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background
    Background.draw();
    Enemy1.update();
    Enemy1.draw();
    Enemy2.update();
    Enemy2.draw();
    player.update();
    player.draw();
    TopWall.draw();
    BottomWall.draw();
    ctx.fillStyle = 'white'
    ctx.fillText('Time: ' + time, 16, 43)

    // Save the current canvas state
    ctx.save();

    // Set global alpha for transparency (affecting only the following drawings)
    ctx.globalAlpha = 1 - fadeRatio;

    // Draw the loading background with reduced opacity
    LoadingBackground.draw();

    // Draw the image with reduced opacity
    const { imageX, imageY } = centerImage();
    ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight);

    // Restore the canvas state (resetting global alpha to 1)
    ctx.restore();

    // Continue the animation until fully faded out
    if (fadeRatio < 1) {
      requestAnimationFrame(animateFadeOut);
    }
  }

  requestAnimationFrame(animateFadeOut);
}

// Function to start the animation after the webpage loads
function startAnimation() {
  // Display the loading screen here (e.g., spinner, loading text, etc.)
  animate();

  // Once the webpage is fully loaded, start the animation
  if (pageLoaded) {
    // Start smoothly returning to center quickly after 3 seconds
    setTimeout(() => {
      loadingScreen = false; // Set loadingScreen to false to hide the loading screen
      returnToCenter();
    }, 3000);
  } else {
    // If the webpage hasn't loaded yet, set a flag to start the animation when it does
    window.addEventListener('load', () => {
      pageLoaded = true;
      setTimeout(() => {
        loadingScreen = false; // Set loadingScreen to false to hide the loading screen
        returnToCenter();
      }, 4000);
    });
  }
}

// Event listener to start the animation
startAnimation();

//Log game data
console.log("canvas =", canvas, "ctx =", ctx, "time =", time, "game =", game, "debug =", debug, "speed =", speed, "SpeedToMinus =", SpeedToMinus, "lowestSpeed =", lowestSpeed, "isShiftPressed =", isShiftPressed, "topWallImage =", topWallImage, "bottomWallImage =", bottomWallImage, "backgroundImage =", backgroundImage, "mouse =", mouse, "TopWall =", TopWall, "BottomWall =", BottomWall, "Background =", Background, "player =", player, "animate1 =", animate1, "animate2 =", animate2, "animationStartTime =", animationStartTime, "randomInProgress =", randomInProgress, "Enemy1 =", Enemy1, "Enemy2 =", Enemy2, "intervalId =", intervalId, "gameStartedOnce =", gameStartedOnce, "cooldownInProgress =", cooldownInProgress, "cooldownDuration =", cooldownDuration, "enemy1collider =", enemy1collider, "enemy2collider =", enemy2collider, "playercollider =", playercollider, "enemy1Width =", enemy1Width, "enemy1Height =", enemy1Height, "enemy2Width =", enemy2Width, "enemy2Height =", enemy2Height, "playerWidth =", playerWidth, "playerHeight =", playerHeight, "intervalTime =", intervalTime);

/* END OF GAME CODE */