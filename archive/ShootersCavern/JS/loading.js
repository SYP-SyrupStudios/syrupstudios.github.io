healthBar.style.display = "none"
playscreen.style.display = "none"

const preloader = document.getElementById("loading");
const hideAtStart = document.getElementById("hideAtStart")
playscreen.style.display = "none"
hideAtStart.classList.add("hidden")

function loadData() {
    window.addEventListener("load", async function(){
        await sleep(6);
        preloader.style.display = "none"
        playscreen.style.display = "block"
        healthBar.style.display = "block"
        hideAtStart.classList.remove("hidden")
    });
}

async function sleep(seconds) {
    return new Promise(resolve=>setTimeout(resolve, seconds*1000));
}

loadData()