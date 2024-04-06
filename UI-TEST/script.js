// Load the external JavaScript file dynamically
const script = document.createElement('script');
script.src = 'https://syrupstudios.github.io/ast.syrupstudios.github.io/API/UIBuilder.js';
script.onload = function() {
    // Now that the external script is loaded, you can use the createElement function here
    createElement('div', {
        id: 'box1',
        classes: ['container-class'],
        style: {
            width: '300px',
            height: '300px',
            background: 'lightblue',
            position: 'absolute',
            top: '100px',
            left: '100px'
        },
        children: [
            document.createElement('p'),
            document.createElement('span')
        ],
        html: '<span>Hello This is a span</span><p>This is some HTML content</p><button>Click me</button>',
        css: `
            .container-class {
                border: 1px solid black;
            }
            p {
                color: blue;
            }
            span {
                font-weight: bold;
            }
        `
    });

    createElement('div', {
        id: 'box2',
        classes: ['container-class'],
        style: {
            width: '150px',
            height: '150px',
            background: 'grey',
            position: 'absolute',
            top: '200px',
            left: '700px'
        },
        children: [
            document.createElement('span')
        ],
        html: '<button>Click me</button>',
        css: `
            .container-class {
                border: 10px solid black;
            }
            button {
                color: white;
                background: red;
                position: absolute;
                top: 50%;
                left: 50%;
            }
        `
    });

    createElement('div', {
        id: 'test-plr',
        classes: ['plr'],
        style: {
            width: '75px',
            height: '75px',
            background: 'red',
            position: 'absolute',
            top: '50px',
            left: '900px'
        }
    });
};

document.head.appendChild(script);
