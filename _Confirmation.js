import { COMPONENTS } from './_Base.js';
import { Button } from './_Button.js';

export class Confirmation extends COMPONENTS {

    constructor({ x, y, title = 'are you sure?', content, gotit = true, yes = false, no = false, highlight = false }) {
        super();
        if (highlight) this.highlight = highlight
        this.gotit = gotit
        this.yes = yes
        this.no = no
        this.style.top = `${y + 10}px`
        this.style.left = `${x}px`
        this.data = this.divocol({})
        this.data += this.divc({ class: 'triangle' })
        this.data += this.divorow({ class: '__w-header _t' })
        this.data += this.divc({ class: 'win-header-logo' })
        this.data += this.divc({ class: '_t win-header-title', content: title })
        this.data += this.divc({ class: 'win-header-btn' })
        this.data += this.divc({ class: 'win-close-btn' })
        this.data += this.end(1)
        if (content) this.data += this.divc({ class: '_t confirmation-txt', content })
        this.data += this.divc({ class: 'confirmation-btn-row' })
        this.data += this.end(1)
        this.render();
    }

    close() {
        if (this.highlight) this.highlight.classList.remove('highlight-input')
        this.remove()
    }

    render() {
        this.innerHTML = this.data
        if (this.highlight) this.highlight.classList.add('highlight-input')
        this.header = this.querySelector('.__w-header')
        document.querySelector('[confirmation]').appendChild(this)

        this.winCloseBtn = this.querySelector('.win-close-btn')
        if (this.gotit) {
            this.header.classList.add('gotit')
            const gotitBtn = new Button({ title: "got it!", addclass: "btn-def blue" })
            this.winCloseBtn.appendChild(gotitBtn).addEventListener('click', () => { this.close() })
            return
        }
        const confirmationBtnRow = this.querySelector('.confirmation-btn-row')
        const closeWin = new Button({ title: "winClose", type: "form_add", addclass: "btn-win-close" })
        this.winCloseBtn.appendChild(closeWin).addEventListener('click', () => { this.close() })

        if (this.yes) {
            this.btnTrue = new Button({ title: "yes", addclass: "btn-def blue" })
            confirmationBtnRow.appendChild(this.btnTrue)
        }
        if (this.no) {
            confirmationBtnRow.appendChild(new Button({ title: "no", addclass: "btn-def blue" }))
        }
    }
}; customElements.define('custom-confirmation', Confirmation);
