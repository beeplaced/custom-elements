import { COMPONENTS } from './_Base.js';
import { SVG } from './_svg.js'; const _svg = new SVG();
import { DropDown } from './_Dropdown.js';
import { FormTiles, LinkElement } from './_FormElement.js';


const d = document;
import API from '../_api.js';
const _api = new API()

import { CACHE } from '../_cache.js';
const _cache = new CACHE();

const personsSvg = _svg.linkOrga('persons')

export class Button extends COMPONENTS {

    constructor(params) {
        super();
        this.params = params
        const { classAdd, title, type, svg, locked } = this.params
        if (locked !== undefined) this.locked = locked
        if (type) this.type = type
        if (title) this.title = title
        if (svg) this.svg = svg
        if (classAdd) this.classList.add(classAdd);
        this.render();
    }

    // buttonAction = {
    //     nextcal: () => { __dt.nextCal() },
    //     prevcal: () => { __dt.prevCal() },
    //     year_month_select: () => {
    //         const { width, top, left } = this.getBoundingClientRect();
    //         this.buildWindow(`<custom-dropdown data-ident-dropdown="year_month_select" class="__d" style="width: ${width}px; top: ${top + 10}px; left: ${left + width}px; "></custom-dropdown>`)
    //     },
    //     form_dropdown: () => {
    //         const { width, top, left, height } = this.parentNode.getBoundingClientRect();
    //         this.buildWindow(`<custom-dropdown data-ident-dropdown="dialog" class="__d" style="width: ${width}px; top: ${top + height + 1}px; left: ${left}px; "></custom-dropdown>`)
    //     },
    //     clean_input: () => {
    //         const data_ident_clean = this.getAttribute('data-ident-clean');
    //         const inputField = d.querySelector(`[data-ident-input="${data_ident_clean}"]`)
    //         inputField.value = ''
    //         this.classList.add('_tgl-hide')
    //     },
    //     form_date: () => {
    //         const { width, top, left, height } = this.parentNode.getBoundingClientRect();
    //         const data_ident_cal = this.getAttribute('data-ident-date');
    //         this.buildWindow(`<custom-calendar class="__d" data-ident-cal="${data_ident_cal}" style="width: ${width}px; top: ${top + height + 1}px; left: ${left}px;"></custom-calendar>`)
    //     },
    //     query_feedback: async () => {
    //         const inputElement = d.querySelector('[mainsearch]');
    //         const inputValue = inputElement.value;
    //         const response = await __api.CALL({ api: 'pagebody', headers: { userQuestion: inputValue } });
    //         const { ai, hint, data, categories } = response
    //         let output = ''
    //         if (data) {
    //             output += data.map(d => `<my-hcr supplier="${d.supplier}" tradename="${d.tradename}"></my-hcr>`).join(' ')
    //         }
    //         this.html({ tag: `[dialog-ai]`, content: `Info: ${ai}` })
    //         this.html({ tag: `[dialog-cat]`, content: `Info: ${JSON.stringify(categories)}` })
    //         this.html({ tag: `[dialog-hint]`, content: hint })
    //         this.html({ tag: `[dialog-output]`, content: output })
    //     }
    // }

    buttonType = {
        pagination_number: (title) => {
            this.buttonElement.innerText = title
            this.buttonElement.setAttribute('data-page', title);
        },
        form_add: (title) => {
            const svgNode = document.createRange().createContextualFragment(_svg[title]());
            this.buttonElement.appendChild(svgNode)
        },
        form_add_date: () => {
            const svgNode = document.createRange().createContextualFragment(_svg['inputCal']());
            this.buttonElement.appendChild(svgNode)
        },
        toogle_lock: () => {
            let title = 'lockOpen'//default              
            switch (true) {
                case this.locked === true:
                    title = 'lockClosed'
                    break;
            }
            console.log(title)
            const svgNode = document.createRange().createContextualFragment(_svg[title]());
            this.buttonElement.appendChild(svgNode)
        },
        def: (title) => {
            this.buttonElement.innerText = title
            this.classList.add('btn-def') //text btn
        }
    }

    toogleLock = async () => {
        return new Promise((resolve) => {
            this.parentNode.textContent = '';
            switch (true) {
                case this.locked === true:
                    this.buttonType['form_add']('lockClosed');
                    break;
                default:
                    this.buttonType['form_add']('lockOpen');
                    break;
            }
            this.classList.add('button-pop');
            setTimeout(() => {
                this.classList.remove('button-pop');
                resolve(); // Resolve the promise after the timeout
            }, 200);
        });
    };

    // btnClick = () => {
    //     console.log('modify')
    // }

    waveThisBtn = () => {
        this.btnWaves(this.buttonElement)
    }

    postRender = () => {
        this.buttonType[this.type] ? this.buttonType[this.type](this.title) : this.buttonType.def(this.title)
    }

    render() {
        const addClass = this.params.addclass ? this.params.addclass : ''
        this.innerHTML = `<button class="__b ${addClass}" data-waves="true"></button>`
        this.buttonElement = this.querySelector('button');
        this.buttonElement.addEventListener('click', e => { if (e.target.dataset.waves) this.btnWaves(e.target) })
        this.postRender()
    }

}; customElements.define('custom-btn', Button);


export class MultiSelectButton extends COMPONENTS {

    constructor(params) {
        super();
        this.params = params
        this.linkageBox = this.params?.linkageBox
        this.title = _cache.read('workflow', 'action')
    }

    connectedCallback() {
        this.render();
    }

    linkElements = () => {

        // window.backBtn.style.display = 'none'
        // window.body.classList.add('d-c-grow')
        // window.body.classList.add('win-tiles')
        // window.body.innerHTML = ''

        const tiles = [
            { svg: 'ppl', content: 'Persons' },
            { svg: 'documents', content: 'Documents/ Images' },
            { svg: 'risks', content: 'Risk Assessments' },
            { svg: 'roles', content: 'Roles' },
            { svg: 'sites', content: 'Site Units' },
            { svg: 'actions', content: 'Actions' },
            { svg: 'auditquestions', content: 'Auditquestions' },
            { svg: 'norms', content: 'Norms' },
        ]

        tiles.some(t => {
            const FormTile = new FormTiles(t)
            this.dropDownWindow.appendChild(FormTile)
        })
    }

    loadLink = async () => await _api.CALL({ api: 'linkelement', body: JSON.stringify({ el: 'ppl' }) })

    clickMore = () => {
        this.classList.add('msb-active')
        const rect = this.closest('orga-action-bar').getBoundingClientRect();
        rect.dropDown = { bla: 'true' }
        this.dropDownWindow = new DropDown(rect)
        this.buildWindow(this.dropDownWindow);
        this.dropDownWindow.addEventListener('click', async (e) => {
            if (e?.target?.dataset?.action) {
                const action = e.target.dataset.action
                switch (action) {
                    case 'linkelements':
                        this.dropDownWindow.classList.add('d-c-grow')
                        this.dropDownWindow.classList.add('win-tiles')
                        this.dropDownWindow.innerHTML = ''
                        //this.linkElements() //Skip for now and go with people linked
                        const elements = await this.loadLink()
                        elements.some(p => { this.dropDownWindow.appendChild(new LinkElement(p)) })
                        this.backBtn.style.display = "unset"

                        //CLICK ALL ELEMENTS
                        console.log(this.linkageBox.getBoundingClientRect())
                        const { width } = this.linkageBox.getBoundingClientRect()
                        this.linkageBox.style.padding = '10px 0 0 0'
                        //this.linkageBox.style.maxWidth = `${width}px`
                        this.dropDownWindow.addEventListener('click', (e) => {
                             this.linkageBox.appendChild(new LinkPersons({ title: 'asd' }))
                            e.target.remove()
                            })
                        break;

                    default:
                        this.titleBtn.innerHTML = e.target.innerHTML
                        this.titleBtn.setAttribute('data-action', action);
                        _cache.write('workflow', 'action', action)
                        this.dropDownWindow.remove()
                        break;
                }
            }
        });
    }

    render() {
        // title grab from cache || more
        this.innerHTML = `<button class="__b btn-def b-multi" back></button>`
        this.innerHTML += `<button class="__b btn-def b-multi" title>${this.title}</button>`
        this.innerHTML += `<button class="__b btn-def b-multi b-multi-def" more></button>`
        this.innerHTML += `<button class="__b btn-def b-multi b-multi-active" moreactive></button>`
        const moreBtn = this.querySelector('[more]')
        this.backBtn = this.querySelector('[back]')
        this.backBtn.style.display = "none"
        this.titleBtn = this.querySelector('[title]')
        this.titleBtn.setAttribute('data-action', this.title);
        moreBtn.appendChild(d.createRange().createContextualFragment(_svg.btnDown()))
        this.backBtn.appendChild(d.createRange().createContextualFragment(_svg.btnBack()))
        const moreBtnActive = this.querySelector('[moreactive]')
        const svgNodeActive = d.createRange().createContextualFragment(_svg.btnDownActive());
        moreBtnActive.appendChild(svgNodeActive)
        this.classList.add('btn-def')
        moreBtn.addEventListener('click', () => {
            this.clickMore()
        })

    }

}; customElements.define('multi-select-btn', MultiSelectButton);

export class InputButton extends Button {

    connectedCallback() {
        this.render();
    }

    postRender = () => {
        console.log(this.svg)
        const svgNode = d.createRange().createContextualFragment(_svg[this.svg]());
        this.buttonElement.appendChild(svgNode)
    }

}; customElements.define('input-btn', InputButton);

export class LinkPersons extends COMPONENTS {

    constructor(joins) {
        super();
        const { title, id } = joins
        // this.data = this.divo({ class: 'link-circle' })
        this.data = personsSvg
        // this.data += this.divc({content: this.getInitials(title)})
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

} customElements.define('link-orga-link-element-persons-btn', LinkPersons);