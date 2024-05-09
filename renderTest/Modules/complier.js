function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";

    script.onload = callback;

    script.src = url;

    document.head.appendChild(script);
}

loadScript('Modules/Local/draw.js', function() {
    console.log('draw.js loaded');

    draw()
});