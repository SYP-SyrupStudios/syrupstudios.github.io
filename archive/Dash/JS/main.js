var char = document.getElementById("char");
var block = document.getElementById("block");
var cloud = document.getElementById("Clouds")
var cloud2 = document.getElementById("Clouds2")
var scoreSign = document.getElementById("score")
var playscreen = document.getElementById("play-screen")
var deathscreen = document.getElementById("death-screen")
const preloader = document.getElementById("loading");
let input = document.querySelector('input')

playscreen.style.display = "none"

function loadData() {
    window.addEventListener("load", async function(){
        await sleep(6);
        preloader.style.display = "none"
        playscreen.style.display = "block"
    });
}

async function sleep(seconds) {
    return new Promise(resolve=>setTimeout(resolve, seconds*1000));
}

loadData();


canjump = false
deathscreen.style.display = "none"

function play() {
    playscreen.style.display = "none"
    block.classList.add("blockanimate")
    canjump = true
    score = 0
    scoreSign.textContent = score
}

function restart() {
    deathscreen.style.display = "none"
    block.classList.add("blockanimate")
    canjump = true
    score = 0;
}

function jump() {
    if(char.classList != "animate"){
        char.classList.add("animate");
        if(canjump == true) {
            if(score == NaN) {
                score = 0
            } else {
                score++;
                scoreSign.textContent = score
            }
        }
    };
    setTimeout(function(){
        char.classList.remove("animate")
    },500);
};

var checkDead = setInterval(function(){
    var charTop = parseInt(window.getComputedStyle(char).getPropertyValue("top"));
    var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    if(blockLeft<20 && blockLeft>0 && charTop>=130) {
        block.classList.remove("blockanimate")
        deathscreen.style.display = "block"
    };
},10);

window.addEventListener('keyup', (e) => {
    if(e.code === "Space") {
        jump()
    }
    if(e.code === "ArrowUp") {
        jump()
    }
    if(e.code === "KeyW") {
        jump()
    }
})