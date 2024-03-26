import { COMPONENTS } from './_Base.js';
import { Button } from './_Button.js';
import { SVG } from './_svg.js'; const _svg = new SVG();

export class UPLOAD extends COMPONENTS {

    static instanceCount = 0;

    constructor() {
        super();
    }

    connectedCallback() {
        this.buildData()
    }

    buildData = () => {
        this.data = this.divocol({})
        this.data += this.divc({ content: 'add files: images, .pdf, .xlsx' })
        this.data += this.divc({ class: 'upload-btn-row' })
        this.data += this.end(1)
        this.render()
    }

    render() {
        this.innerHTML = this.data
        const btn = this.querySelector(`.upload-btn-row`);
        const useDocsbutton = new Button({ title: "use docs from folder", addclass: "btn-def upload" })
        btn.appendChild(useDocsbutton)
        const uploadbutton = new Button({ title: "open folder", addclass: "btn-def upload" })
        btn.appendChild(uploadbutton)
        btn.appendChild(document.createRange().createContextualFragment(_svg.uploadDND()))

        
    }
}; customElements.define('custom-upload', UPLOAD);