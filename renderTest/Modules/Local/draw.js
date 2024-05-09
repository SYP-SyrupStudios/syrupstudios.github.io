function draw() {
    const script = document.createElement('script');
    script.src = 'https://syrupstudios.github.io/ast.syrupstudios.github.io/API/UIBuilder.js';
    script.onload = function() {
        createElement('div', {
            id: 'gameWindow',
            classes: ['game-window'],
            style: {
                width: '485px',
                height: '402px',
                border: '3px solid #000',
                background: '#fff',
                borderRadius: '10px',
                boxShadow: '0 0 40px rgba(0, 0, 0, 0.4)',
                overflow: 'hidden',
                position: 'relative'
            },
            children: [
                document.createElement('div'),
                document.createElement('p')
            ],
            html: '<div class="player" id="player"><p class="text">PLR</p></div>',
            css: `
            body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #f0f0f0;
            }
            
            .player {
                width: 50px;
                height: 50px;
                background-color: blue;
                position: absolute;
            }

            .text {
                color: #fff;
                font-family: Arial, sans-serif;
                font-weight: bold;
                text-align: center;
            }
        `
        });

        loadScript('Modules/Local/controls.js', function() {
            console.log('controls.js loaded');

            initControls();
        });

    };

    document.head.appendChild(script);
}