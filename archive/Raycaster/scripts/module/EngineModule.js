const map = [
  [2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
  [2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 3],
  [2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 3],
  [2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 0, 0, 0, 0, 3],
  [2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [2, 2, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 3],
  [1, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 3],
  [1, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 3],
  [1, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 3],
  [1, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 3],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 3],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
]

const SCREEN_WIDTH = 485;
const SCREEN_HEIGHT = 402;
const Minimap = false

const canvas = document.getElementById('Frame');
const ctx = canvas.getContext('2d')

const TICK = 30;
const CELL_SIZE = 20;
const PLAYER_SIZE = 10;
const FOV = toRadians(60);

const COLORS = {
  floor: "#d52b1e", // "#ff6361"
  ceiling: "#ffffff", // "#012975",
  walls: {
    1: "#013aa6", // Wall type 1 color
    2: "#00ff00", // Wall type 2 color
    3: "#9542f5",
    4: "#42f593"
  },
  rays: "#ffa600",
};

const player = {
  x: CELL_SIZE * 1.5,
  y: CELL_SIZE * 2,
  angle: 0,
  speed: 0
}

function clearScreen() {
  ctx.fillStyle = 'red'
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
}

function movePlayer() {
  const nextX = player.x + Math.cos(player.angle) * player.speed;
  const nextY = player.y + Math.sin(player.angle) * player.speed;

  const validWallValues = Object.keys(COLORS.walls).map(Number); // Get all valid wall values as numbers

  if (!isWallCollision(nextX, nextY, validWallValues)) {
    player.x = nextX;
    player.y = nextY;
  }
}

function isWallCollision(x, y, validWallValues) {
  const cellX = Math.floor(x / CELL_SIZE);
  const cellY = Math.floor(y / CELL_SIZE);

  if (outOfMapBounds(cellX, cellY)) {
    return true;
  }

  const cellValue = map[cellY][cellX];

  // Check if the cellValue is included in the validWallValues array
  return validWallValues.includes(cellValue);
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function outOfMapBounds(x, y) {
  return x < 0 || x >= map[0].length || y < 0 || y >= map.length;
}

function getVCollision(angle) {
  const right = Math.abs(Math.floor((angle - Math.PI / 2) / Math.PI) % 2);

  const firstX = right
    ? Math.floor(player.x / CELL_SIZE) * CELL_SIZE + CELL_SIZE
    : Math.floor(player.x / CELL_SIZE) * CELL_SIZE;

  const firstY = player.y + (firstX - player.x) * Math.tan(angle);

  const xA = right ? CELL_SIZE : -CELL_SIZE;
  const yA = xA * Math.tan(angle);

  let wall;
  let nextX = firstX;
  let nextY = firstY;
  while (!wall) {
    const cellX = right
      ? Math.floor(nextX / CELL_SIZE)
      : Math.floor(nextX / CELL_SIZE) - 1;
    const cellY = Math.floor(nextY / CELL_SIZE);

    if (outOfMapBounds(cellX, cellY)) {
      break;
    }
    wall = map[cellY][cellX];
    if (!wall) {
      nextX += xA;
      nextY += yA;
    }
  }
  return {
    angle,
    distance: distance(player.x, player.y, nextX, nextY),
    vertical: true,
    type: wall, // Added line to return the type of wall
  };
}

function getHCollision(angle) {
  const up = Math.abs(Math.floor(angle / Math.PI) % 2);
  const firstY = up
    ? Math.floor(player.y / CELL_SIZE) * CELL_SIZE
    : Math.floor(player.y / CELL_SIZE) * CELL_SIZE + CELL_SIZE;
  const firstX = player.x + (firstY - player.y) / Math.tan(angle);

  const yA = up ? -CELL_SIZE : CELL_SIZE;
  const xA = yA / Math.tan(angle);

  let wall;
  let nextX = firstX;
  let nextY = firstY;
  while (!wall) {
    const cellX = Math.floor(nextX / CELL_SIZE);
    const cellY = up
      ? Math.floor(nextY / CELL_SIZE) - 1
      : Math.floor(nextY / CELL_SIZE);

    if (outOfMapBounds(cellX, cellY)) {
      break;
    }

    wall = map[cellY][cellX];
    if (!wall) {
      nextX += xA;
      nextY += yA;
    }
  }
  return {
    angle,
    distance: distance(player.x, player.y, nextX, nextY),
    vertical: false,
    type: wall, // Added line to return the type of wall
  };
}

function castRay(angle) {
  const vCollision = getVCollision(angle);
  const hCollision = getHCollision(angle);

  return hCollision.distance >= vCollision.distance ? vCollision : hCollision;
}

function fixFishEye(distance, angle, playerAngle) {
  const diff = angle - playerAngle;
  return distance * Math.cos(diff);
}

function getRays() {
  const initialAngle = player.angle - FOV / 2;
  const numberOfRays = SCREEN_WIDTH;
  const angleStep = FOV / numberOfRays;
  return Array.from({ length: numberOfRays }, (_, i) => {
    const angle = initialAngle + i * angleStep;
    const ray = castRay(angle)
    return ray
  })
}

function renderScene(rays) {
  rays.forEach((ray, i) => {
    const distance = fixFishEye(ray.distance, ray.angle, player.angle);
    const wallHeight = ((CELL_SIZE * 5) / distance) * 277;

    let wallColor;
    if (ray.vertical) {
      wallColor = ray.type in COLORS.walls ? COLORS.walls[ray.type] : "#013aa6";
    } else {
      wallColor = ray.type in COLORS.walls ? COLORS.walls[ray.type] : "#013aa6";
    }

    // Add a black overlay with slight opacity for vertical walls
    ctx.fillStyle = ray.vertical ? applyBlackOverlay(wallColor, 0.3) : wallColor;

    ctx.fillRect(i, SCREEN_HEIGHT / 2 - wallHeight / 2, 1, wallHeight);

    ctx.fillStyle = COLORS.floor;
    ctx.fillRect(
      i,
      SCREEN_HEIGHT / 2 + wallHeight / 2,
      1,
      SCREEN_HEIGHT / 2 - wallHeight / 2
    );

    ctx.fillStyle = COLORS.ceiling;
    ctx.fillRect(i, 0, 1, SCREEN_HEIGHT / 2 - wallHeight / 2);
  });
}

// Function to apply a black overlay with opacity to a color
function applyBlackOverlay(color, opacity) {
  const blackOverlay = "#000000";
  const rgb = hexToRgb(color);
  const overlayRgb = hexToRgb(blackOverlay);

  // Calculate the resulting RGB values with the overlay
  const resultR = (1 - opacity) * rgb.r + opacity * overlayRgb.r;
  const resultG = (1 - opacity) * rgb.g + opacity * overlayRgb.g;
  const resultB = (1 - opacity) * rgb.b + opacity * overlayRgb.b;

  return `rgb(${resultR},${resultG},${resultB})`;
}

// Function to convert hex color to RGB
function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

function renderMinimap(posX = 0, posY = 0, scale = 1, rays) {
  const cellSize = scale * CELL_SIZE;
  map.forEach((row, y) => {
    row.forEach((cell, x) => {
      if(cell) {
        ctx.fillStyle = 'gray'
        ctx.fillRect(posX + x * cellSize, posY + y * cellSize, cellSize, cellSize)
      }
    })
  });

  ctx.strokeStyle = COLORS.rays;
  rays.forEach(ray => {
    ctx.beginPath()
    ctx.moveTo(player.x * scale + posX, player.y * scale + posY)
    ctx.lineTo((player.x + Math.cos(ray.angle) * ray.distance) * scale, (player.y + Math.sin(ray.angle) * ray.distance) * scale);
    ctx.closePath();
    ctx.stroke();
  })

  ctx.fillStyle = 'yellow'
  ctx.fillRect(posX + player.x * scale - PLAYER_SIZE / 2, posY + player.y * scale - PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE)

  const rayLength = PLAYER_SIZE * 2;
  ctx.strokeStyle = 'yellow'
  ctx.beginPath()
  ctx.moveTo(player.x * scale + posX, player.y * scale + posY)
  ctx.lineTo((player.x + Math.cos(player.angle) * rayLength) * scale, (player.y + Math.sin(player.angle) * rayLength) * scale)
  ctx.closePath()
  ctx.stroke()
}

function toRadians(deg) {
  return (deg * Math.PI) / 180
}

let turningLeft = false;
let turningRight = false;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    player.speed = 2;
  }
  if (e.key === "ArrowDown") {
    player.speed = -2;
  }
  if (e.key === "ArrowLeft") {
    turningLeft = true;
  }
  if (e.key === "ArrowRight") {
    turningRight = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    player.speed = 0;
  }
  if (e.key === "ArrowLeft") {
    turningLeft = false;
  }
  if (e.key === "ArrowRight") {
    turningRight = false;
  }
});

function updatePlayerAngle() {
  if (turningLeft) {
    player.angle -= toRadians(5);
  }
  if (turningRight) {
    player.angle += toRadians(5);
  }
}

function gameLoop() {
  clearScreen()
  movePlayer()
  updatePlayerAngle();
  const rays = getRays()
  renderScene(rays)
  if(Minimap) {
    renderMinimap(0, 0, 0.75, rays)
  }
}

setInterval(gameLoop, TICK)