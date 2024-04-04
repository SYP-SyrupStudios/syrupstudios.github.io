//MOBILE CONTROL 
// Selecting the hamburger icon
var hamburger = document.querySelector(".hamburger");

// Adding click event listener to the hamburger icon
hamburger.onclick = function() {
    // Selecting the navigation bar
    var navBar = document.querySelector(".nav-bar");
    
    // Toggling the 'active' class to show/hide the navigation bar
    navBar.classList.toggle("active");
};

// Selecting all anchor tags inside the navigation bar
var navLinks = document.querySelectorAll(".nav-bar a");

// Adding click event listener to each anchor tag
navLinks.forEach(function(navLink) {
    navLink.addEventListener('click', function() {
        // Selecting the navigation bar
        var navBar = document.querySelector(".nav-bar");
        
        // Removing the 'active' class to hide the navigation bar
        navBar.classList.remove("active");
    });
});


// Automatic slider
document.addEventListener("DOMContentLoaded", function() {
    let radios = document.querySelectorAll('input[name="radio-btn"]');
    let currentIndex = 0;

    function showNextSlide() {
        radios[currentIndex].checked = false; // Uncheck current radio button
        currentIndex = (currentIndex + 1) % radios.length;
        radios[currentIndex].checked = true; // Check next radio button

        // Generate a random interval between 5 to 10 seconds (5000 to 10000 milliseconds)
        let randomInterval = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;

        console.log('time to switch slide: ', randomInterval)
        // Set the interval for the next slide change
        setTimeout(showNextSlide, randomInterval);
    }

    // Show next slide initially
    setTimeout(showNextSlide, 5000); // Start with a 5-second delay
});


// Particles for background
const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d"); // CTX MEANS CONTEXT
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;
let particleArray;

// get mouse mouse position ///////////////////////////////
let mouse = {
	x: null,
	y: null,
  radius: ((canvas.height/80) * (canvas.width/80))
}
window.addEventListener('mousemove', 
	function(event){
		mouse.x = event.x;
		mouse.y = event.y;
});

// create Particle
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.speedX = this.directionX;
        this.speedY = this.directionY;
    }
    // create method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI * 2, false);

        ctx.fillStyle = 'white';
	    ctx.fill();
    }

    // check particle position, check mouse position, move the paticle, draw the particle
    update() {
        // check if particle is still within canvas
        if (this.x > canvas.width || this.x < 0){
			this.directionX = -this.directionX;
            this.speedX = this.directionX;
	    } if (this.y + this.size > canvas.height || this.y - this.size < 0){
		    this.directionY = -this.directionY;
            this.speedY = this.directionY;
	    }
        // check mouse position/particle position - collision detection
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < mouse.radius + this.size){
            if(mouse.x < this.x && this.x < canvas.width - this.size*10){
               this.x+=10;
            }
            if (mouse.x > this.x && this.x > this.size*10){
                this.x-=10;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size*10){
                this.y+=10;
            }
            if (mouse.y > this.y && this.y > this.size*10){
                this.y-=10;
            }
        }
        // move particle
        this.x += this.directionX;
        this.y += this.directionY;
        // call draw method
        this.draw();
    }
}

// check if particles are close enough to draw line between them
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particleArray.length; a++) {
        for (let b = a; b < particleArray.length; b++){
            let distance = ((particleArray[a].x - particleArray[b].x) * (particleArray[a].x - particleArray[b].x))
            +   ((particleArray[a].y - particleArray[b].y) * (particleArray[a].y - particleArray[b].y));
            if  (distance < (canvas.width/7) * (canvas.height/7))
            {   
                opacityValue = 1-(distance/10000);
                ctx.strokeStyle='rgba(255,255,255,' + opacityValue +')';
                ctx.beginPath();
                ctx.lineWidth = 3;
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();

            }    
    }
    }
}

// create particle array 
function init(){
    particleArray = [];
    let numberOfParticles = (canvas.height*canvas.width)/9000;
    for (let i=0; i<numberOfParticles; i++){
        let size = 2
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 2) - 1;
        let directionY = (Math.random() * 2) - 1;
        
        let color = 'white';
        particleArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// create animation loop
function animate(){
	requestAnimationFrame(animate);
	ctx.clearRect(0,0,innerWidth,innerHeight);
	
	for (let i = 0; i < particleArray.length; i++){
		particleArray[i].update();
	}
    connect();
}
init();
animate();


// RESIZE SETTING - empty and refill particle array every time window changes size + change canvas size
window.addEventListener('resize',
	function(){
		canvas.width = innerWidth;
		canvas.height = innerHeight;
        mouse.radius = ((canvas.height/80) * (canvas.width/80));
		init();
	}
)
// 2) SET MOUSE POSITION AS UNDEFINED when it leaves canvas//////
window.addEventListener('mouseout',
	function(){
		mouse.x = undefined;
	    mouse.y = undefined;
        console.log('mouseout');
	}
)