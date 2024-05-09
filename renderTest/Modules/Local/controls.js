function initControls() {
    const Window = document.getElementById('gameWindow');
    const Player = document.getElementById('player');
    
    // Get the width and height of the element
    let widthWindow = Window.clientWidth;
    let heightWindow = Window.clientHeight;

    let widthPlayer = Player.clientWidth;
    let heightPlayer = Player.clientHeight;

    // Center the player element within the window
    const initialX = widthWindow / 2 - widthPlayer / 2;
    const initialY = heightWindow / 2 - heightPlayer / 2;
    let posX = initialX;
    let posY = initialY;

    Player.style.position = 'absolute';
    Player.style.left = `${posX}px`;
    Player.style.top = `${posY}px`;

    // Keyboard controls
    const keys = {};

    document.addEventListener('keydown', function(event) {
        keys[event.key] = true;
    });

    document.addEventListener('keyup', function(event) {
        keys[event.key] = false;
    });

    // Move player function
    const movePlayer = () => {
        const speed = 5;

        if (keys['ArrowLeft']) {
            posX -= speed;
        }
        if (keys['ArrowRight']) {
            posX += speed;
        }
        if (keys['ArrowUp']) {
            posY -= speed;
        }
        if (keys['ArrowDown']) {
            posY += speed;
        }

        // Keep the player within the canvas bounds
        posX = Math.max(0, Math.min(widthWindow - widthPlayer, posX));
        posY = Math.max(0, Math.min(heightWindow - heightPlayer, posY));

        Player.style.left = `${posX}px`;
        Player.style.top = `${posY}px`;
    };

    // Continuous movement loop
    const moveLoop = () => {
        movePlayer();
        requestAnimationFrame(moveLoop);
    };

    moveLoop();
}