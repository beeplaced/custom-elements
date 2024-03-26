import { COMPONENTS, EditableFields } from './_Base.js';
import { Button, InputButton } from './_Button.js';
import { DropDown } from './_Dropdown.js';
import { CALENDAR } from './_Calendar.js';
import API from '../_api.js';
const _api = new API()
const d = document;
import { SVG } from './_svg.js'; const _svg = new SVG();

export class InputSimple extends COMPONENTS {

    constructor(params) {
        console.log(params)
        super();
        if (params.atrs) this.atrs = params.atrs
        if (params.placeholder) this.placeholder = params.placeholder
        this.content = ''
        this.ident = null
    }
    connectedCallback() {
        this.data = `<input class="ou-input-input" ${this.atrs ? this.atrs : ''} maxlength="100" type="text" placeholder="${this.placeholder}" spellcheck="false"  autocomplete="off" value="">`
        this.render();
    }

    handleInputFocus = () => {
        console.log('focus')
    }

    handleInputKeyup = () => {
        console.log('modify')
    }

    render() {
        this.innerHTML = this.data;
        this.inputField = this.querySelector(`.ou-input-input`);
        this.inputField.addEventListener('focus', this.handleInputFocus, true);
        //this.data.addEventListener('focusout', this.handleInputFocusOut, true);
        this.inputField.addEventListener('keyup', this.handleInputKeyup, true);
        // this.data.addEventListener('input', this.handleInput, true);
    }

} customElements.define('input-simple', InputSimple);

export class InputElement extends EditableFields {

    constructor(params) {
        super();
        console.log(params)
        const {
            content = '',
            title = 'input',
            readonly = false,
            dropdown = false,
            autocomplete = false,
            clean = true,
            meta,
            editable = false
        } = params

        this.content = content
        this.readonly = readonly
        this.title = title
        this.autocomplete = autocomplete
        if (clean) this.clean = clean
        if (dropdown) this.dropdown = dropdown
        this.placeholder = title === 'input' ? '...' : title
        if (meta) {
            this.type = meta?.type ? meta.type : 'text'
            this.unit = meta?.unit ? meta.unit : false
        }
        this.editable = editable
        this.classList.add('custom-form')
        if (this.readonly) this.classList.add('active')
        this.timeoutremId = null
    }

    inner = () => {
        return this.input({
            type: this.type,
            class: 'form-input',
            autocomplete: this.autocomplete,
            maxlength: '200',
            placeholder: this.placeholder,
            readonly: this.readonly,
            value: this.content
        })
    }

    inputHeadRaw = () => {//also used in documents, build via class later
        return this.divc({ class: `ext-input-w-title${!this.content ? ' _tgl-hide' : ' _tgl'}`, content: this.title || '...' })
    }

    handleInputFocus = () => {
        const content = this.inputField.value
        const clean = this.querySelector(`[data-ident-clean="${this.ident}"]`)
        const plus = this.querySelector(`[data-ident-plus="${this.ident}"]`)

        if (content !== '' || content !== ' ' || content !== undefined) {
            if (plus) plus.classList.remove('_tgl-hide')
            if (clean) clean.classList.remove('_tgl-hide')
        }
        this.fieldTitle.classList.add('title-active')
        this.wrapper.classList.add('form-row-wrapper-active')

        if (this.dropdown) {
            this.dropDownAction()
        }
    }

    handleInputFocusOut = () => {
        const title = this.querySelector(`[data-ident-title="${this.ident}"]`);
        const clean = this.querySelector(`[data-ident-clean="${this.ident}"]`);
        const plus = this.querySelector(`[data-ident-plus="${this.ident}"]`);
        if (plus) plus.classList.add('_tgl-hide');
        if (clean) clean.classList.add('_tgl-hide');
        this.fieldTitle.classList.remove('title-active')
        this.wrapper.classList.remove('form-row-wrapper-active');
    }

    handleInputKeyup = (e) => {
        clearTimeout(this.timeoutremId)
        const val = e.target.value
        this.valInput(val)
        this.timeoutremId = setTimeout(() => {
            if (this.dropdown) this.dropDownAction()
            setTimeout(() => {
                if (this.validatedinput === '') {
                    this.fieldTitle.classList.add('_tgl-hide')
                } else {
                    this.fieldTitle.classList.remove('_tgl-hide')
                }
                console.log('type end - autosave if on')
            }, 200)
        }, 400)
    }

    valInput = (val) => {
        this.validatedinput = this.validatedContent({ type: this.type, val })
    }

    grabContent = () => this.validatedinput || this.content

    grabTitle = () => this.title || this.content

    handleInput = (e) => {
    }

    action = {
        calendar: () => {
            this.dateButton = new Button({ classAdd: '_tgl', title: "dropdownInput", type: "form_add_date" });
            this.wrapper.appendChild(this.dateButton);
            this.dateButton.addEventListener('click', () => {
                this.inputField.focus()
                const { width, top, left, height } = this.wrapper.getBoundingClientRect();
                const cal = new CALENDAR({ width, top, left, height })
                this.buildWindow(cal);
                const _cal_body = cal.querySelector(`[_cal_selector_body]`)
                _cal_body.addEventListener('click', (e) => {
                    const content_back = e.target.getAttribute('content_back')
                    if (content_back !== '' && content_back !== null) { //IS DATE
                        this.inputField.value = content_back
                        this.validatedinput = content_back
                    }
                });
            })
        },
        dropdown: () => {
            this.dropDownButton = new InputButton({ svg: "dropdownInput" });
            this.wrapper.appendChild(this.dropDownButton);
            this.dropDownButton.addEventListener('click', e => {
                this.dropDownAction()
            })
        },
        savebtn: () => {
            this.savebtn = new InputButton({ classAdd: 'input-btn-save', svg: "inputSave" });
            this.wrapper.appendChild(this.savebtn);
            this.savebtn.addEventListener('click', () => {
                const drawer = this.savebtn.querySelector('.c-i-svg-cxxx')
                drawer.classList.add('draw-input-btn')
                setTimeout(function () {
                    drawer.classList.remove('draw-input-btn')
                }, 400);
            })
        },
        clean: () => {
            this.cleanButton = new InputButton({ classAdd: 'clean-input-svg', svg: "cleanInput" });
            this.wrapper.appendChild(this.cleanButton);
            this.cleanButton.addEventListener('click', () => {
                this.inputField.value = ''
                this.content = ''
                this.validatedinput = ''
                // this.cleanButton.classList.add('_tgl-hide')
            })
        },
        unit: () => {
            this.unit = new Button({ classAdd: '_tgl', title: this.unit, type: "form-add" });
            this.unit.classList.add('btn-unit')
            this.wrapper.appendChild(this.unit);
            // this.cleanButton.addEventListener('click', () => {
            //     this.inputField.value = ''
            //     this.cleanButton.classList.add('_tgl-hide')
            // })
        }
    }

    dropDownAction = () => {
        console.log(this.dropdown, 'modify')
        //switch dropdwontype
        if (this.dropdownWindow) {
            this.dropdownWindow.update({ filter: this.inputField.value })
            return
        }

        const { width, top, left, height } = this.wrapper.getBoundingClientRect();
        this.dropdownWindow = new DropDown({ width, top, left, height })
        this.buildWindow(this.dropdownWindow);
        this.dropdownWindow.addEventListener('click', (e) => {
            if (e?.target?.dataset?.contentback) {
                const content = e.target.dataset.contentback
                this.inputField.value = content
                this.validatedinput = content
            }
        });
    }

    postRender = () => {
        this.inputField = this.querySelector(`.form-input`);
        this.wrapper = this.querySelector(`.form-row-wrapper`);
        this.fieldTitle = this.querySelector(`.ext-input-w-title`)
        if (!this.readonly) {
            this.inputField.addEventListener('focus', this.handleInputFocus, true);
            this.inputField.addEventListener('focusout', this.handleInputFocusOut, true);
            this.inputField.addEventListener('keyup', this.handleInputKeyup, true);
            this.inputField.addEventListener('input', this.handleInput, true);
            if (this.dropdown) this.action['dropdown']()
            if (this.clean) this.action['clean']()
            if (this.datepicker) this.action['calendar']()
            if (this.unit) this.action['unit']()
            if (this.savebtn) this.action['savebtn']()
        }
    }

    render(data) {
        this.innerHTML = data;
        this.inputHead = this.querySelector('.input-head')
        this.inputHead.innerHTML = this.editable ? this.inputHeadEditable() : this.inputHeadRaw()
        if (this.editable) {
            this.useEditable()
        }
        this.postRender()
    }

}; customElements.define('custom-form-input', InputElement);

export class InputRemark extends InputElement {

    inner = () => {
        return this.txtArea({
            class: `form-input${this.readonly ? ' readonly' : ''}`,
            maxlength: '2000',
            placeholder: this.placeholder,
            value: this.content,
            readonly: this.readonly
        })
    }

    adjustTextarea = () => {
        const { height } = this.inputField.getBoundingClientRect()
        const scrollHeight = this.inputField.scrollHeight
        if (scrollHeight > height) {
            this.inputField.style.height = `${scrollHeight}px`
            this.inputField.style.minHeight = `${scrollHeight}px`
        }
    }

    handleInput = () => {
        this.adjustTextarea()
    }

    postRender = () => {
        this.inputField = this.querySelector(`textarea`);
        this.wrapper = this.querySelector(`.form-row-wrapper`);
        this.fieldTitle = this.querySelector(`.ext-input-w-title`)
        if (!this.readonly) {
            this.inputField.addEventListener('focus', this.handleInputFocus, true);
            this.inputField.addEventListener('focusout', this.handleInputFocusOut, true);
            this.inputField.addEventListener('keyup', this.handleInputKeyup, true);
            this.inputField.addEventListener('input', this.handleInput, true);
            this.inputField.addEventListener('paste', this.pasteInTextarea, true);
            if (this.clean) this.action['clean']()
        }
        this.adjustTextarea()
    }

}; customElements.define('custom-form-remark', InputRemark);

export class SearchBar extends COMPONENTS {

    constructor() {
        super();
        this.data = ''
    }

    connectedCallback() {
        this.data = this.buildInput()
        this.render();
    }

    buildInput = () => {
        let h = this.divocol({ class: 'head-search-wrapper' })
        h += this.divorow({})
        h += this.divc({ class: 'head-search-tag', content: 'title' })
        h += this.input({
            type: 'text',
            class: 'search-input',
            // atrs: `data-ident-input="${this.ident}"`,
            autocomplete: 'off',
            maxlength: '125',
            placeholder: 'search',
            value: ''
        })
        h += this.end(2)
        return h

    }

    emptySearchbar = () => {
        this.wrapper.classList.remove('head-search-recommend')
        this.header.classList.remove('searchbar-recommend')
        this.recommend.render()
        this.inputField.value = ''
        this.inputField.focus()
    }

    handleInputFocus = () => {
        this.header.classList.add('searchbar-open')
    }

    openInput = () => {
        this.header.classList.add('searchbar-open')
    }

    dostuffext = () => {
        console.log('modify')
    }

    handleInputKeyup = async () => {
        const inputVal = this.inputField.value
        switch (true) {
            case inputVal !== '' && inputVal.length >= 3:
                this.wrapper.classList.add('head-search-recommend')
                this.header.classList.add('searchbar-recommend')
                this.queryReloaData = await this.recommend.output(inputVal)
                this.dostuffext()
                break;
            case inputVal !== '' && inputVal.length < 3:
                break;
            default: //empty
                this.wrapper.classList.remove('head-search-recommend')
                this.header.classList.remove('searchbar-recommend')
                this.recommend.render()
                break;
        }
    }

    render() {
        this.innerHTML = this.data;
        this.header = d.querySelector(`header`);
        this.wrapper = d.querySelector(`.head-search`);
        this.inputField = this.querySelector(`.search-input`);
        this.recWrapper = this.querySelector('.head-search-wrapper')
        this.recommend = new RecommendOutput()
        this.recWrapper.appendChild(this.recommend)
        this.inputField.addEventListener('focus', this.handleInputFocus, true);
        // this.inputField.addEventListener('focusout', this.handleInputFocusOut, true);
        this.inputField.addEventListener('keyup', this.handleInputKeyup, true);
        // this.inputField.addEventListener('input', this.handleInput, true);
    }
}; customElements.define('base-search-bar', SearchBar);

export class RecommendOutput extends COMPONENTS {

    constructor() {
        super();
        this.data = ''
        this.content = ''
    }

    connectedCallback() {
        //this.render();
    }

    load = async (entry) => {
        const ret = await _api.CALL({
            api: 'query', body: JSON.stringify({
                entry
            })
        })
        return ret
    }


    output = async (entry) => {
        const regex = /\[([^\]]+)\]/g;
        const ret = await this.load(entry)

        //need change tag???
        let h = this.divocol({ class: "search-bar-recommend-wrapper" })
        h += '<ul>'
        ret.map(content => {
            h += `<li class="reco-click">${content.replace(regex, "<span class='hint'>$1</span>")}</li>`
        })
        h += '</ul>'
        h += this.end(1)
        this.innerHTML = h
        // this.appendChild(new Button({ title: "ok", addclass: "btn-def blue" }))
        // this.undoBtn = new Button({ title: "undo", addclass: "btn-def pink" })
        // this.appendChild(this.undoBtn)
        // this.appendChild(new Button({ title: "remember", addclass: "btn-def orange" }))
        // return data
    }

    render() {
        this.innerHTML = '';
    }
}; customElements.define('search-bar-recommend', RecommendOutput);