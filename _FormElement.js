import { COMPONENTS } from './_Base.js';
import { Button } from './_Button.js';
// import { DropDown } from './_Dropdown.js';
// import { CALENDAR } from './_Calendar.js';
// import { LinkPersons } from './_Orga.js';
import { InputElement, InputRemark, SearchBar, InputSimple } from './_InputElement.js';
import API from '../_api.js';
const _api = new API()
const d = document;
import { SVG } from './_svg.js'; const _svg = new SVG();
const personsSvg = _svg.linkOrga('persons')
// const siteSvg = _svg.linkOrga('sites')
// const docSvg = _svg.linkOrga('documents')
// const actionSvg = _svg.linkOrga('actions')
// const riskSvg = _svg.linkOrga('risks')

export class Divider extends COMPONENTS {

    constructor(entry) {
        super();
        this.data = entry.title
        this.render();
    }

    render() {
        this.innerHTML = this.divc({ class: 'txt', content: this.data })
    }

} customElements.define('form-divider', Divider);

export class ButtonRow extends COMPONENTS {

    constructor() {
        super();
        this.render();
    }

    render() {
        this.innerHTML = ''
    }

} customElements.define('form-btn-row', ButtonRow);

export class FormElement extends COMPONENTS {

    constructor(entry) {
        super();
        this.elements = entry.elements
        this.formElements = []
        //if savebtn
    }

    connectedCallback() {
        this.buildForms()
        this.saveBtn()

    }

    buildForms = () => {
        this.elements.map(el => {
            let renderElement = {}
            switch (true) {
                case el?.meta?.type === 'remark':
                    renderElement = new InputRemark(el)
                    break;
                case el?.meta?.type === 'divider':
                    renderElement = new Divider(el)
                    break;
                default:
                    renderElement = new InputElement(el)
                    break;
            }
            this.appendChild(renderElement)
            this.formElements.push(renderElement)
        })
    }

    saveBtn = () => {

        const btnRow = new ButtonRow()

        const savebutton = new Button({ title: "save", addclass: "btn-def blue" })
        btnRow.appendChild(savebutton)
        this.appendChild(btnRow)
        savebutton.classList.add('btn-row-end')
        savebutton.addEventListener('click', () => { this.saveInput() })
    }

    saveInput = () => {
        console.log(this.formElements)
        const changeArr = []
        this.formElements.forEach(({ title, validatedinput }) => {
            console.log(validatedinput)
            if (validatedinput) changeArr.push({ title, validatedinput })
        })
        if (changeArr.length === 0) {
            this.feedback({ content: `No chages` })
        } else {
            this.feedback({ content: `Save ${changeArr.length} changes` })
        }
    }

} customElements.define('form-element', FormElement);

export class FormTiles extends COMPONENTS {

    constructor(entry) {
        super();
        const { svg, content } = entry
        this.svg = svg
        this.content = content
    }

    connectedCallback() {
        this.render()
    }

    loadLink = async () => await _api.CALL({ api: 'linkelement', body: JSON.stringify({ el: 'ppl' }) })

    clickItem = () => {
        this.addEventListener('click', async (e) => {
            const parent = this.closest('.__w-body')
            // const backbtn = d.querySelector('win-back-button')
            // backbtn.style.display = 'unset'
            parent.classList.remove('win-tiles')
            parent.innerHTML = ''
            const elements = await this.loadLink()
            elements.some(p => { parent.appendChild( new LinkElement(p) ) })
        })
    }

    render = () => {
        this.innerHTML = this.divocol({})
        this.innerHTML += _svg.nav({ el: this.svg, usage: 'tile' })
        this.innerHTML += this.divc({ content: this.content })
        this.innerHTML += this.end(1)
        this.clickItem()
    }

} customElements.define('form-tiles', FormTiles);

export class LinkElement extends COMPONENTS {

    constructor(joins) {
        super();
        const { title } = joins
        // this.data = this.divo({ class: 'link-circle' })
        this.data = personsSvg
        this.data += this.divc({ class: '_t', style: 'pointer-events: none;', content: title })
        this.data += this.end(1)
        this.render()
    }

    getInitials = (fullName) => {
        const names = fullName.split(' ');
        let initials = '';

        // Get the first letter of each name
        names.forEach(name => {
            initials += name.charAt(0).toUpperCase();
        });
        return initials;
    }

    render() {
        this.innerHTML = this.data
    }

} customElements.define('tile-link-ppl', LinkElement);