function createElement(type, attributes) {
    const element = document.createElement(type);

    // Set attributes
    for (const key in attributes) {
        if (key === 'classes') {
            element.classList.add(...attributes[key]);
        } else if (key === 'id') {
            element.id = attributes[key];
        } else if (key === 'children') {
            for (const child of attributes[key]) {
                element.appendChild(child);
            }
        } else if (key === 'html') {
            element.innerHTML = attributes[key];
        } else if (key === 'style') {
            const style = attributes[key];
            for (const property in style) {
                element.style[property] = style[property];
            }
        } else if (key !== 'css') {
            element.setAttribute(key, attributes[key]);
        }
    }

    document.body.appendChild(element);

    // Load inline CSS if provided
    if (attributes.css) {
        const styleTag = document.createElement('style');
        styleTag.innerHTML = attributes.css;
        document.head.appendChild(styleTag);
    }
}