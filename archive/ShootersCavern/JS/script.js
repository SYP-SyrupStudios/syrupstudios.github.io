// SOME ESSENTIAL VARIABLES
const gameFrame = document.querySelector("#gameFrame");
var deathscreen = document.getElementById("death-screen")
var winscreen = document.getElementById("win-screen")
deathscreen.style.display = "none"
winscreen.style.display = "none"

var myLifePoints = 100;

function livingEnemies() {
	return document.querySelectorAll(".enemy:not(.dead)");
}


// ENNEMY SHOOTS ME
function enemyShootsMe(enemy) {
	if(enemy) {
		enemy.classList.add("showing");
		setTimeout(function() {
			if(!enemy.classList.contains("dead")) {
				enemy.classList.add("shooting");
				gameFrame.classList.add("enemyShooting");
				updateLifePoints(myLifePoints-20);
				setTimeout(function() {
					enemy.classList.remove("shooting");
					gameFrame.classList.remove("enemyShooting");
					setTimeout(function() {
						enemy.classList.remove("showing");
					}, 150);
				}, 500);
			}
		}, 800);
	}
}

// ELEMENT OF SURPRISE
function randomEnemyShots() {

	if(myLifePoints > 0) {

		if(livingEnemies()) {
			var randomEnemy = Math.floor(Math.random() * livingEnemies().length);
			var randomDelay = Math.floor(Math.random() * 2000) + 1000;

			setTimeout(function() {
				if(myLifePoints > 0) {
					enemyShootsMe(livingEnemies()[randomEnemy]);
					randomEnemyShots();					
				}
			}, randomDelay);
		}

	}

}


// DAMAGE AND DEATH
function updateLifePoints(amount) {
	myLifePoints = amount;
	if(myLifePoints < 1) {
		myLifePoints = 0;
		setTimeout(function() {
			if(livingEnemies().length) {
				deathscreen.style.display = "block"
			}
		}, 500);
	}
	document.getElementById("healthBar").style.width = myLifePoints+"%";
}


// I SHOOT THE ENNEMIES
function iShoot(enemy) {
	/* Consequences on the ennemies */
	enemy.classList.remove("shooting");
	enemy.classList.add("dead");			

	/* Victory! */
	if(!livingEnemies().length) {
		setTimeout(function() {
			winscreen.style.display = "block"
		}, 300);
	}
}

// GETTING THE GAME READY
var playscreen = document.getElementById("play-screen")
function newGame() {

	playscreen.style.display = "none"
	deathscreen.style.display = "none"
	winscreen.style.display = "none"
	document.querySelectorAll(".enemy").forEach(enemy => {
		enemy.classList = ["enemy"];
		enemy.classList.add("shooting");
		enemy.classList.add("showing");
		enemy.classList.add("dead");
		enemy.classList.remove("shooting");
		enemy.classList.remove("showing");
		enemy.classList.remove("dead");			
	});

	updateLifePoints(100);
	gameFrame.classList = [];

	setTimeout(function() {
		randomEnemyShots();
	}, 3000);

}


livingEnemies().forEach(enemy => {

	enemy.addEventListener("click", function() {
		iShoot(enemy);
	});

});