import { COMPONENTS } from './_Base.js';
import { Button } from './_Button.js';
const d = document;

class BackButton extends Button {

}; customElements.define('win-back-button', BackButton);

export class Window extends COMPONENTS {

    static instanceCount = 0;

    constructor(params) {
        super();
        this.params = params
        this.title = params.title || 'header'
        this.ident = `_w_${Window.instanceCount++}`;
        this.window = 'dialog'
        this.selfIdent = `win_${this.window}`
        this.headerIdent = `w_header_${this.window}`
        this.bodyIdent = `w_body_${this.window}`
        this.data = 'Window'
        this.windowCorpus = this.divocol({ class: '__w-wrapper' })
        this.windowCorpus += this.divorow({ class: '__w-header _t' })
        this.windowCorpus += this.divc({ class: 'win-header-logo' })
        this.windowCorpus += this.divc({ class: '_t win-header-title', content: this.title })
        this.windowCorpus += this.divc({ class: 'win-header-btn' })
        this.windowCorpus += this.divc({ class: 'win-close-btn' })
        this.windowCorpus += this.end(1)
        this.windowCorpus += this.divc({ class: '__w-body _t' })
        this.windowCorpus += this.end(1)
    }

    connectedCallback() {
        this.loadData();
    }

    async loadData() {//extend later

    }

    dragWindow = () => {
        const dragMouseDown = (e) => {
            e = e || window.e
            e.preventDefault()
            pos3 = e.clientX
            pos4 = e.clientY
            this.onmouseup = closeDragElement
            this.onmousemove = elementDrag
            //this.highlightWindow(this.selector)
        }
        const elementDrag = (e) => {
            e = e || window.e
            e.preventDefault()
            pos1 = pos3 - e.clientX
            pos2 = pos4 - e.clientY
            pos3 = e.clientX
            pos4 = e.clientY
            this.style.top = (this.offsetTop - pos2) + 'px'
            this.style.left = (this.offsetLeft - pos1) + 'px'
            this.cleanDropdown()
        }
        const closeDragElement = () => {
            this.onmouseup = null
            this.onmousemove = null
            //this.adjustWIndowOverScreen(input.selector)

        }
        let pos1 = 0
        let pos2 = 0
        let pos3 = 0
        let pos4 = 0
        this.header.onmousedown = dragMouseDown
    }

    renderBackBtn = () => {
        this.backBtn = new BackButton({ title: "winBack", type: "form_add", addclass: "btn-win-back" })
        this.winLogo.appendChild(this.backBtn)
    }

    render() {
        this.innerHTML = this.windowCorpus
        const _window = d.querySelector('[window]');
        _window.appendChild(this)
        this.body = this.querySelector('.__w-body')
        this.header = this.querySelector(`.__w-header`)
        this.renderHead()
        const { drag, center, modal, back } = this.params
        if (drag) this.dragWindow();
        if (modal) _window.classList.add('_block')
        if (center) this.classList.add('win-center')
        if (back) this.renderBackBtn()
    }

    renderHead = () => {
        this.winBtn = this.querySelector('.win-header-btn')
        this.winCloseBtn = this.querySelector('.win-close-btn')
        this.winLogo = this.querySelector('.win-header-logo')
        const closeWin = new Button({ title: "winClose", type: "form_add", addclass: "btn-win-close" })
        this.winCloseBtn.appendChild(closeWin).addEventListener('click', () => { this.remove() })

        // const logoWin = new Button({ title: "user", type: "form_add", addclass: "btn-head-user" })
        // this.winLogo.appendChild(logoWin)
    }

}; customElements.define('custom-window', Window);

export class ImageWindow extends Window {
    renderHead = () => {
        this.winBtn = this.querySelector('.win-header-btn')
        const closeWin = new Button({ title: "winClose", type: "form_add", addclass: "btn-win-close" })
        this.winBtn.appendChild(closeWin).addEventListener('click', () => { this.remove() })
    }
}; customElements.define('image-window', ImageWindow);