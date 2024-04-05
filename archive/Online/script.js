/* game */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, onValue, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

import firebaseConfig from './config.js';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Generate a unique session-based identifier for each person
const sessionId = generateSessionId();

function generateSessionId() {
  return Math.random().toString(36).substr(2, 9);
}

var selectedColor = 'red';
let playerUsername = null;

// COLOR CHANGER
function changeColor() {
  // Get the color value from the input
  var colorValue = document.getElementById('colorInput').value;
      // Set the color to a variable or use it directly in your application
      selectedColor = colorValue;

      // You can use the 'selectedColor' variable in your application as needed
      console.log("Color changed to: " + selectedColor);
}

// Add the button dynamically in the script
document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('btn');
  button.addEventListener('click', changeColor);

  //TEST
  const usernameBtn = document.getElementById('usernameBtn');
  usernameBtn.addEventListener('click', function() {
    const usernameInput = document.getElementById('usernameInput').value;
    if (usernameInput.length > 7) {
      alert('Username should be 7 characters or less.');
      return;
    }
    playerUsername = usernameInput;
    console.log("Username set to: " + playerUsername);
    // Add username to Firebase alongside other player data
    set(ref(database, `Servers/server1/players/${sessionId}/username`), playerUsername);
  });
});

// Canvas Setup
const canvas = document.getElementById('Frame');
const ctx = canvas.getContext('2d');
canvas.width = 485;
canvas.height = 402;
ctx.font = 'bold 25px Baloo';

// Player
class Player {
  constructor(playerId, initialX, initialY) {
    this.playerId = playerId;
    this.x = initialX;
    this.y = initialY;
    this.Color = selectedColor;
    this.width = 75;
    this.height = 75;
    this.speed = 5;
    this.username = playerUsername;
    this.databaseRef = ref(database, `Servers/server1/players/${this.playerId}`);
  }

  update() {
    if (keys.ArrowLeft) {
      this.x -= this.speed;
    }
    if (keys.ArrowRight) {
      this.x += this.speed;
    }
    if (keys.ArrowUp) {
      this.y -= this.speed;
    }
    if (keys.ArrowDown) {
      this.y += this.speed;
    }

    this.Color = selectedColor;
    this.username = playerUsername;

    // Keep the player within the canvas bounds
    this.x = Math.max(this.width / 2, Math.min(canvas.width - this.width / 2, this.x));
    this.y = Math.max(this.height / 2, Math.min(canvas.height - this.height / 2, this.y));

    // Update the player's position and lastActive timestamp in the database
    set(this.databaseRef, {
      x: this.x,
      y: this.y,
      Color: this.Color,
      Username: this.username,
      lastActive: serverTimestamp(), // Add a timestamp
    });

    console.log(`Player ${this.playerId} - x: ${this.x}, y: ${this.y}`);
  }

  draw() {
    // Draw the player on the canvas
    ctx.fillStyle = this.Color;
    ctx.beginPath();
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.closePath();

    // Display the username above the player
    ctx.fillStyle = 'black';  // You can change this color as per your design
    ctx.font = '16px Arial';  // You can adjust the font size and style
    ctx.textAlign = 'center';
    ctx.fillText(this.username, this.x, this.y - this.height / 2 - 10);  // Adjust the positioning as per your needs
  }
}

// Function to update other players' data from the database
const otherPlayers = [];

function updateOtherPlayers() {
  const playersRef = ref(database, 'Servers/server1/players');

  // Listen for changes in player positions
  onValue(playersRef, (snapshot) => {
    const players = snapshot.val();

    if (players) {
      // Clear the array
      otherPlayers.length = 0;

      for (const playerId in players) {
        if (playerId !== sessionId) {
          const playerData = players[playerId];
          const currentTime = Date.now();
          const lastActive = playerData.lastActive || 0;

          // Check if the player is inactive for more than 5 seconds
          if (currentTime - lastActive < 5000) {
            otherPlayers.push({
              id: playerId,
              x: playerData.x,
              y: playerData.y,
              color: playerData.Color, // Store the color directly within the otherPlayers array
              plrUsername: playerData.Username
            });
          } else {
            set(ref(database, `Servers/server1/players/${playerId}`), null);
            console.log(`Player ${playerId} is inactive. You can delete the player.`);
          }
        }
      }
    }
  });
}

// Initialize a player with the session-based identifier
const player = new Player(sessionId, canvas.width / 2, canvas.height / 2);

// Keyboard controls
const keys = {};

document.addEventListener('keydown', function (event) {
  keys[event.key] = true;
});

document.addEventListener('keyup', function (event) {
  keys[event.key] = false;
});

// Remove the player from the database when the user leaves or closes the tab
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'hidden') {
    // The user has left the page
    set(ref(database, `Servers/server1/players/${sessionId}`), null);
  }
});

// Call the function to update other player positions
updateOtherPlayers();

// Game loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  player.draw();

  // Loop through other players and draw them
  for (const otherPlayer of otherPlayers) {
    const color = otherPlayer.color;
    const name = otherPlayer.plrUsername;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.fillRect(otherPlayer.x - player.width / 2, otherPlayer.y - player.height / 2, player.width, player.height);
    ctx.fill();
    ctx.closePath();

    //TEST USERNAMES
    ctx.fillStyle = 'black';  // You can change this color as per your design
    ctx.font = '16px Arial';  // You can adjust the font size and style
    ctx.textAlign = 'center';
    ctx.fillText(name, otherPlayer.x, otherPlayer.y - player.height / 2 - 10);  // Adjust the positioning as per your needs
  }

  requestAnimationFrame(animate);
}

animate();
