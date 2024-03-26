import { COMPONENTS } from './_Base.js';
import { SVG } from './_svg.js'; const __svg = new SVG();
const d = document;

export class Text extends COMPONENTS {

    static instanceCount = 0;

    constructor(params) {
        super();
        this.txt = params.txt || 'Although any tag can be used for a button, it will only be <a href="http://webaim.org/techniques/keyboard/tabindex">keyboard focusable</a> if you use a <code>&lt;button&gt;</code> tag or you add the property <code>tabindex="0"</code>. Keyboard accessible buttons will preserve focus styles after click, which may be visually jarring.<p></p>'
    }

generateRandomText(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomText = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomText += charset.charAt(randomIndex);
    }

    return randomText;
}

    connectedCallback() {
        this.data = this.divocol({})
        this.data += `<div class="ui ignored warning message">${this.txt}</div>`
        this.data += `<div class="ui ignored info message">${this.generateRandomText(20)}</div>`
        this.data += this.end(1)
        this.render();
    }

    render() {
        this.innerHTML = this.data;
    }
}; customElements.define('custom-text', Text);

//         <h1 class="ui header">
//   H1
//   <div class="sub header">Sub Header</div>
// </h1>
// <h2 class="ui header">
//   H2
//   <div class="sub header">Sub Header</div>
// </h2>
// <h3 class="ui header">
//   H3
//   <div class="sub header">Sub Header</div>
// </h3>
// <h4 class="ui header">
//   H4
//   <div class="sub header">Sub Header</div>
// </h4>
// <h5 class="ui header">
//   H5
//   <div class="sub header">Sub Header</div>
// </h5>

// <h4 class="ui red header">Red</h4>
// <h4 class="ui orange header">Orange</h4>
// <h4 class="ui yellow header">Yellow</h4>
// <h4 class="ui olive header">Olive</h4>
// <h4 class="ui green header">Green</h4>
// <h4 class="ui teal header">Teal</h4>
// <h4 class="ui blue header">Blue</h4>
// <h4 class="ui purple header">Purple</h4>
// <h4 class="ui violet header">Violet</h4>
// <h4 class="ui pink header">Pink</h4>
// <h4 class="ui brown header">Brown</h4>
// <h4 class="ui grey header">Grey</h4>
