import { COMPONENTS, EditableFields } from './_Base.js';
import { Content } from '../_content.js';
const _cont = new Content()
import { STATUS } from '../_status.js';
const _status = new STATUS()
const statuses = _status['_def']
import { CACHE } from '../_cache.js';
const __cache = new CACHE();
// import { DropDown } from './_Dropdown.js';
// import { CALENDAR } from './_Calendar.js';
import { SVG } from './_svg.js'; const __svg = new SVG();
const d = document;

export class Radio extends COMPONENTS {

    static instanceCount = 0;

    constructor(params) {
        super();
        if (!params) //no class
        {
            this.params = this.gatherAttributes()
            this.selected = 0
            return
        }
        this.params = params
        this.selected = params.selected ? params.selected : 0
        this.ident = Radio.instanceCount++;
        this.setAttribute('selected', this.selected);
        if (this.params.selectall) this.setAttribute('selectall', "true");
    }

    connectedCallback() {
        this.radio = __svg.radioTable(this.params)
        this.render();
    }

    radioCircleDraw = () => {
        this.circleDraw.style.fill = 'transparent'
        this.circleDraw.classList.add('draw')
    }

    RadioBoxFlicker = () => {
        this.classList.add('slider-box-flicker')
        setTimeout(() => {
            this.classList.remove('slider-box-flicker')
        }, 120);
    }

    deactivate = () => {
        this.radioBox.classList.remove('rdo-selected')
        this.selected = 0
        this.setAttribute('selected', 0);
    }

    activate = () => {
        this.radioBox.classList.add('rdo-selected')
        this.selected = 1
        this.setAttribute('selected', 1);
    }

    shiftClickRdoBtn() {
        const parentTable = this.closest('custom-table')
        let first = parentTable.querySelector('[selected="1"]:not([selectall="true"])') || parentTable.querySelector('[selected="0"]:not([selectall="true"])')
        const firstGiven = parseInt(first.selected)
        const lastGiven = parseInt(this.selected)
        const firstIdent = parseInt(first.getAttribute('ident'))
        const lastIdent = parseInt(this.getAttribute('ident'))
        let given = lastGiven
        const idents = [firstIdent, lastIdent]
        if (firstGiven === 1 && lastGiven === 0) given = 0 //Turn on
        if (lastIdent < firstIdent) idents.reverse()
        for (let i = idents[0]; i <= idents[1];) {
            const row = parentTable.querySelector(`[ident="${i}"]`)
            this.toggleTableRow(row, given)
            i++
        }
    }

    render() {
        this.innerHTML = this.radio;
        this.circleDraw = this.querySelector('.radio-outer-circle');
        this.radioBox = this.querySelector('._radio-box')
        if (this.params.draw) this.radioCircleDraw()
        this.addEventListener('click', (e) => {
            if (e.shiftKey === true) {
                this.shiftClickRdoBtn(); return
            }
            this.RadioBoxFlicker();
            if (this.params.selectall) return
            this.toggleTableRow(this, this.selected)
        })
    }
}; customElements.define('custom-radio', Radio);

export class SLIDER extends COMPONENTS {

    constructor(params) {
        super();
        this.params = params
        if (this.params.cache) {
            const { segment, element } = this.params.cache
            this.selected = __cache.read(segment, element)
        } else {
            this.selected = params.selected ? params.selected : 0
        }
        this.contentinit = params.contentinit ? params.contentinit : 'def'
        this.setAttribute('selected', this.selected);
    }

    connectedCallback() {
        this.slider = this.divorow({})
        this.slider += this.divorow({ class: '_sliderbox' })
        this.slider += this.divorow({ class: 'slider-box-outer' })
        this.slider += this.divc({ class: 'slider-box-inner' })
        this.slider += this.end(1)
        this.slider += this.divc({ class: 'slider-ball' })
        this.slider += this.end(1)
        this.slider += this.divc({ class: '_t txt' })
        this.slider += this.end(1)
        this.render();
    }

    sliderBoxFlicker = () => {
        this.sliderBox.classList.add('slider-box-flicker')
        setTimeout(() => {
            this.sliderBox.classList.remove('slider-box-flicker')
        }, 120);
    }

    deactivate = () => {
        this.ball.classList.remove('activate-slider');
        this.ball.classList.add('deactivate-slider');
        this.sliderBoxInner.classList.add('deactivate-sliderbox')
        this.setAttribute('selected', 0);
        this.txt.innerText = this.off
    }

    activate = () => {
        this.ball.classList.remove('deactivate-slider');
        this.ball.classList.add('activate-slider');
        this.sliderBoxInner.classList.remove('deactivate-sliderbox')
        this.setAttribute('selected', 1);
        this.txt.innerText = this.on
    }

    render() {
        this.innerHTML = this.slider;
        this.sliderBox = this.querySelector('.slider-box-outer');
        this.sliderBoxInner = this.querySelector('.slider-box-inner')
        this.txt = this.querySelector('.txt');
        this.ball = this.querySelector('.slider-ball');
        const { on, off } = _cont.getSlider(this.contentinit)
        this.on = on
        this.off = off
        switch (this.selected) {
            case 1:
                this.ball.classList.add('activate-slider');
                this.txt.innerText = on
                break;
            default:
                this.sliderBoxInner.classList.add('deactivate-sliderbox')
                this.ball.classList.add('deactivate-slider');
                this.txt.innerText = off
                break;
        }
        this.addEventListener('click', () => {
            this.sliderBoxFlicker();
            const attr = this.getAttribute('selected');

            if (this.params.cache) {
                const { segment, element } = this.params.cache
                const set = parseInt(attr) === 1 ? 0 : 1
                this.selected = __cache.write(segment, element, set)
            }

            switch (true) {
                case attr === "1":
                    this.deactivate();
                    break;
                default:
                    this.activate();
                    break;
            }
        })
    }
}; customElements.define('custom-slider', SLIDER);

export class Checkbox extends EditableFields {

    constructor(params) {
        super();

        const {
            selected,
            contentinit,
            txt,
            editable = false
        } = params

        this.editable = editable
        this.selected = selected || 0
        this.contentinit = contentinit || 'def'
        this.txt = txt || 'My checkbox'
    }

    connectedCallback() {
        const html = this.buildInput()
        this.render(html);
    }

    buildInput = () => {
        let html = this.divorow({ class: 'input-head' })
        html += this.end(1)
        html += this.divorow({ class: 'form-row-wrapper' })
        html += this.checkbox()
        html += this.end(1)
        return html
    }

    checkbox = () => {
        let h = this.divorow({ class: '' })
        h += this.divorow({ class: '_checkbox_inner' })
        h += __svg.checkBox({ selected: this.selected })
        h += this.end(1)
        h += this.divc({ class: '_t txt', content: this.txt })
        h += this.end(1)
        return h
    }

    grabTitle = () => this.txt

    sliderBoxFlicker = () => {
        this.checkboxInner.classList.add('slider-box-flicker')
        setTimeout(() => {
            this.checkboxInner.classList.remove('slider-box-flicker')
        }, 120);
    }

    deactivate = () => {
        this.selected = 0
        this.checker.style.display = 'none'
    }

    activate = () => {
        this.selected = 1
        this.checker.style.display = 'inherit'
    }

    checkboxClick = () => {
        this.addEventListener('click', () => {
            this.sliderBoxFlicker();
            const attr = this.selected;
            switch (true) {
                case attr === 1:
                    this.deactivate();
                    break;
                default:
                    this.activate();
                    break;
            }
        })
    }

    render(html) {
        this.innerHTML = html;
        this.checker = this.querySelector('._ch_b_s');
        this.checkboxInner = this.querySelector('._checkbox_inner')

        if (this.editable) {
            this.inputHead = this.querySelector('.input-head')
            this.inputHead.innerHTML = this.inputHeadEditable() 
            this.useEditable()
        }
        this.checkboxClick()
    }
}; customElements.define('custom-checkbox', Checkbox);

export class Multitag extends COMPONENTS {

    static instanceCount = 0;

    constructor(params) {
        super();
        this.params = params
        this.selected = params.selected ? params.selected : 0
        this.readonly = params.readonly ? params.readonly : false
        this.active = params.active || null
        this.build()
    }

    reRender = (readonly, active) => {
        this.readonly = readonly
        this.active = active
        this.build()
    }

    build = () => {
        switch (true) {
            case !this.readonly:
                this.renderDefault()
                break;

            default:
                this.renderReadonly()
                break;
        }
        this.render();
    }

    renderReadonly = () => {
        const { background, title, color } = statuses[this.active]()
        this.tag = this.divc({
            class: 'multi-tag-inner-readonly',
            style: `background-color: ${background}; color: ${color}`,
            content: title
        })
    }

    renderDefault = () => {
        this.tag = ''
        const sta = [0, 2, 1, 3, 4, 99] //from template
        sta.map(a => {
            const { background, color, title } = statuses[a]()
            this.tag += this.divc({
                class: `multi-tag-inner __p _t${a === this.active ? ' button-in' : ' button-out'}`,
                style: `background-color: ${background}; color: ${color}`,
                atrs: `_compl${a === this.active ? ' data-ctive="true"' : ''} data-status="${a}"`,
                content: title
            })
        })
    }

    BoxFlicker = (btn) => {
        btn.classList.add('slider-box-flicker')
        setTimeout(() => {
            btn.classList.remove('slider-box-flicker')
        }, 120);
    }

    render() {
        this.innerHTML = this.tag;
        if (this.readonly) return
        const divsInCustomElement = this.querySelectorAll('.multi-tag-inner');

        this.addEventListener('click', (e) => {
            const btn = e.target
            this.BoxFlicker(btn);
            divsInCustomElement.forEach(d => {
                d.classList.add('button-out')
                d.classList.remove('button-in')
            })
            btn.classList.add('button-in')
            btn.classList.remove('button-out')
            btn.setAttribute('data-ctive', false)
            this.active = parseInt(btn.dataset.status)
        })
    }
}; customElements.define('custom-multitag', Multitag);





