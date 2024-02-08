import { API } from './_Api.js'; const __api = new API();
import { SVG } from './_svg.js'; const __svg = new SVG();
import { COMPONENTS } from './_Elements.js';
import { Calendar } from './_Calendar.js';
import { Button } from './_Button.js';
import { DropDown } from './_Dropdown.js';
import { InputElement } from './_InputElement.js';
const d = document;

customElements.define('custom-calendar', Calendar);
customElements.define('custom-btn', Button);
customElements.define('my-dropdown', DropDown);
customElements.define('custom-form-input', InputElement);

class WINDOW extends COMPONENTS {

    connectedCallback() {
        this.window = 'dialog'
        this.selfIdent = `win_${this.window}`
        this.headerIdent = `w_header_${this.window}`
        this.bodyIdent = `w_body_${this.window}`
        this.windowCorpus = this.divocol({ class: '__w-wrapper' })
        this.windowCorpus += this.divc({ class: '__w-header _t', atrs: this.headerIdent, content: 'Dialog' })
        this.windowCorpus += this.divc({ class: '__w-body _t', atrs: this.bodyIdent, content: '---' })
        this.windowCorpus += this.end(1)
        this.loadData();
    }

    async loadData() {
        try {
            const inputElement = d.querySelector('[mainsearch]');
            console.log(inputElement)
            const inputValue = inputElement.value;
            const response = await __api.CALL({ api: 'pagebody', headers: { userQuestion: inputValue } });
            //if (!this.data) //throw
            const { hint, data } = response
            let w_body = this.divocol({ class: "dialog-output" })
            w_body += this.divc({ class: '_t', content: hint })
            if (data) {
                w_body += data.map(d => `<my-hcr data-content="${d.index}"></my-hcr>`).join(' ')
            }
            w_body += this.end(1)
            this.data = w_body

            this.update();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    update() {
        this.render();
    }

    render() {
        if (this.selectorexists(`[${this.selfIdent}]`) === false) {
            this.innerHTML = this.divc({ class: "window", atrs: this.selfIdent, content: this.windowCorpus })
        }
        this.html({ tag: `[${this.bodyIdent}]`, content: this.data })
    }
}; customElements.define('my-window', WINDOW);

class TABLE extends COMPONENTS {

    connectedCallback() {
        this.tablefields = {
            def: ({ input }) => this.divc({ class: 'tbl-txt _t', content: input }),
            input: ({ field, input }) => `<input class="tbl" data-input="${field}" type="text" value="${input}" spellcheck="false">`,
        }
        this.trClass = 'odd_even'
        this.loadData();
        this.header = [
            { title: 'userId' },
            { title: 'title' },
            { title: 'id' },
            { title: 'completed' }
        ]
        this.tableData = null
    }

    async loadData() {
        try {
            // Simulate an asynchronous operation, e.g., fetching data
            this.tableData = await __api.CALL({ api: 'pagebody', body: JSON.stringify({ main: true }) });
            let table = await this.tableHead()
            table += await this.tableBody()
            this.data = table
            this.tablePagination = await this.tablePagination()
            this.update();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    update() {
        this.render();
    }

    tablePagination = async () => {
        console.log(this.tableData.length)
        const max = this.tableData.length
        let h = this.divorow({ class: 'pagination-wrapper' })
        h += this.divc({ content: `Showing 11 of ${max} results` })
        h += this.divc({ class: '_mdl' })
        h += this.divc({ content: __svg.windowPrev({ action: 'tab', page: 1 }) })
        h += `<my-btn title="1" action="upload" type="pagination_number"></my-btn>`
        h += `<my-btn title="2" action="upload" type="pagination_number"></my-btn>`
        h += this.divc({ content: __svg.windowNext({ action: 'tab', page: 1 }) })
        h += this.end(1)
        return h
    }

    tableHead = async () => {
        //const { sort, order, fields } = data
        //const { fields } = data
        let h = `<table><thead><tr>`
        //const fields = __cache.readTableFields()
        let colspan = false
        this.header.map(({ title, meta }) => {
            let content = meta || title
            // switch (true) {
            //     case title === '_rdo':
            //         content = __svg.radioTable({})
            //         break;
            //     case title === '_audit_icon':
            //     case title === '_icon':
            //         content = ''
            //         colspan = true
            //         break;
            //     case title === 'status':
            //         //content = __h.tag({ class: 'tag-status-head', content: '' })
            //         break;
            //     // case title.startsWith('|join'):
            //     //   content = title.replace(/^\|join\|\|/, '');
            //     //   break;
            //     default:

            //         break;
            // }
            const sort = 'remark'
            const order = 1
            switch (colspan) {
                case true:
                    colspan = 'next'
                    break;
                case 'next':
                    h += `<th colspan="2" class="b-l" style="padding-left: 10px">`
                    colspan = false
                    break;
                default:
                    h += `<th class="b-l">`
                    colspan = false
                    break;
            }

            h += this.divorow({ class: '_no_click _chead _t' })
            if (title === sort) {
                const arrow = order === -1 ? 'up' : 'down'
                // settings.headsort = __svg.sortArrow(direction)
                // settings.atrs = `data-tab_head="${title}" data-tab_sort="${order}"`
                //   h += __svg.sort(arrow)
            }
            h += this.divc({ class: '_no_click _t', content })
            //if (title === sort) h += __h.unit({ unit: '€' })
            h += this.end(1)
            h += '</th>'
        })
        h += `</tr></thead>`
        return h
    }

    tableBody = async () => {
        let h = ``
        this.tableData.map((col, i) => { //ROW
            //tr-read-only
            h += `<tr class="${this.trClass}" data-id="12381823901923890183081">`
            h += this.outputTablefields({ col, i }) //FIELDS
            h += `</tr>`
        })
        h += `</table>`
        return h
    }


    outputTablefields = ({ col, i }) => {
        if (!col) return
        let h = ''
        this.header.map(({ title, type }) => {
            let field = title
            const headline = false
            let tdClass = ''
            let tdStyle = ''
            let input = col[title]
            let atrs = ''
            let def = this.default
            h += `<td ${tdClass ? tdClass : ''} ${atrs ? atrs : ''} ${tdStyle ? tdStyle : ''}>`
            h += this.tablefields['input']({ input, title })
            h += `</td>`
        })
        return h
    }

    // ... (rest of your code)

    render() {
        console.log(this.parentNode.getBoundingClientRect())
        const { height } = this.parentNode.getBoundingClientRect()
        //check if pagination is needed = true
        let rnder = this.divocol({})
        rnder += this.divc({ content: this.data, style: `max-height: ${height - 80}px; overflow: auto` })
        rnder += this.tablePagination
        rnder += this.end(1)
        this.innerHTML = rnder
    }
}; customElements.define('my-table', TABLE);


class SearchBar extends COMPONENTS {

    static instanceCount = 0;

    constructor(params) {
        super();
        this.params = params
        this.ident = `_s_${SearchBar.instanceCount++}`;
        this.classList.add('custom-form-input');
    }

    connectedCallback() {
        const placeholder = 'ask me anything';
        this.autocompleteQuestion = true
        const { content, clean, title, date } = this.params
        let html = ''
        html += this.divorow({ class: 'form-search-wrapper', atrs: `data-ident-wrapper="${this.ident}"`, })
        html += this.input({
            class: 'form-input',
            atrs: `data-ident-input="${this.ident}"`,
            maxlength: '200',
            placeholder,
            value: content
        })
        if (clean) html += `<my-btn class="_tgl-hide" data-ident-clean="${this.ident}" title="cleanInput" action="clean_input" type="form_add"></my-btn>`
        html += this.end(1)
        //html += this.divc({ class: 'search-result', atrs: 'data-search-result="true"' })
        html += this.divc({
            class: 'dialog-hint',
            atrs: `data-ident-output="${this.ident}"`
        })
        html += this.divc({ class: 'dialog-ai', atrs: 'dialog-cat' })
        html += this.divc({ class: 'dialog-ai', atrs: 'dialog-ai' })
        this.data = html
        this.render();
    }

    execute = async (content_back) => {
        this.ident = 'searchbar'
        // const response = await __api.CALL({ api: 'pagebody', headers: { userQuestion: content_back } });
        // console.log(response)
        // if (!response) return false
        this.dropDown.remove()
        this.searchOutput.innerHTML = `searchOutput from question: ${content_back}`
        // const { ai, hint, data, categories } = response
        // this.html({ tag: `[dialog-ai]`, content: `Info: ${ai}` })
        // this.html({ tag: `[dialog-cat]`, content: `Info: ${JSON.stringify(categories)}` })
        // this.html({ tag: `[dialog-hint]`, content: hint })
        this.wrapper.style.borderRadius = '20px';
    }

    handleInputFocus = () => {
        const content = this.inputField.value
        const clean = this.querySelector(`[data-ident-clean="${this.ident}"]`)
        if (content !== '' && content !== ' ') {
            if (clean) clean.classList.remove('_tgl-hide')
        }
        this.wrapper.classList.add('form-row-wrapper-active')
    }

    handleInputFocusOut = () => {
        // const title = this.querySelector(`[data-ident-title="${this.ident}"]`);
        // const clean = this.querySelector(`[data-ident-clean="${this.ident}"]`);
        // const plus = this.querySelector(`[data-ident-plus="${this.ident}"]`);
        // if (plus) plus.classList.add('_tgl-hide');
        // if (clean) clean.classList.add('_tgl-hide');
        // title.style.color = 'chocolate';
        // this.wrapper.classList.remove('form-row-wrapper-active');
    }

    handleInputKeyup = () => {
        if (this.autocompleteQuestion) {
            this.wrapper.style.borderRadius = '20px 20px 0 0';
            const { width, top, left, height } = this.getBoundingClientRect();
            this.dropDown = new DropDown({ width: width - 10, top: top - 15, left: left + 5, height, type: "question_autocomplete" })
            this.buildWindow(this.dropDown);
            this.dropDown.querySelector(`[question_autocomplete]`).addEventListener('click', (e) => {
                const content_back = e.target.getAttribute('content_back')
                this.inputField.value = content_back
                this.execute(content_back)
            });



            // this.buildWindow(`<custom-dropdown
            // data-ident-dropdown="question_autocomplete" 
            // class="__d" 
            // style="width: ${width - 10}px; top: ${top + height - 15}px; left: ${left + 5}px; "></custom-dropdown>`)

        }

        // const content = this.inputField.value
        // const title = this.querySelector(`[data-ident-title="${this.ident}"]`)
        // const clean = this.querySelector(`[data-ident-clean="${this.ident}"]`)
        // if (content !== '' && content !== ' ') {
        //     if (title) title.classList.remove('_tgl-hide')
        //     if (clean) clean.classList.remove('_tgl-hide')
        // } else {
        //     if (title) title.classList.add('_tgl-hide')
        //     if (clean) clean.classList.add('_tgl-hide')
        // }

        // clearTimeout(timeoutremId)
        // timeoutremId = setTimeout(() => {
        //     console.log('here')
        //     this.wrapper.style.backgroundColor = 'lavender'
        //     setTimeout(() => {
        //         this.wrapper.style.backgroundColor = 'white'
        //     }, 200)
        // }, 1000)
    }

    render() {
        this.innerHTML = this.data
        this.inputField = this.querySelector(`[data-ident-input="${this.ident}"]`);
        this.inputField.addEventListener('focus', this.handleInputFocus, true);
        this.inputField.addEventListener('focusout', this.handleInputFocusOut, true);
        this.inputField.addEventListener('keyup', this.handleInputKeyup, true);
        this.wrapper = this.querySelector(`[data-ident-wrapper="${this.ident}"]`);
        this.searchOutput = this.querySelector(`[data-ident-output="${this.ident}"]`);
    }
}; customElements.define('custom-searchbar', SearchBar);

class FormRemark extends COMPONENTS {

    static instanceCount = 0;

    constructor(params) {
        super();
        this.ident = `_r_${FormRemark.instanceCount++}`;
        this.params = params
        this.classList.add('custom-form-input');
        this.timeoutremId = null
    }

    connectedCallback() {
        const placeholder = '...';
        const { content = '', title } = this.params;
        this.content = content === '' || !content || content === undefined ? false : content
        let html = this.divc({ class: 'segment-title', content: 'Remark Field' })
        html += this.divc({
            class: `ext-input-w-title${!this.content ? ' _tgl-hide' : ' _tgl'}`,
            atrs: `data-ident-title="${this.ident}"`,
            content: title || placeholder
        })
        html += this.divorow({ class: 'form-row-wrapper', atrs: `data-ident-wrapper="${this.ident}"`, })
        html += this.txtArea({
            class: 'form-input',
            atrs: `data-ident-txt-area="${this.ident}"`,
            maxlength: '2000',
            placeholder: !this.content ? title : placeholder,
            value: content
        })
        html += this.end(1)
        this.data = html
        this.render();
    }

    handleInputFocus = () => {
        const title = this.querySelector(`[data-ident-title="${this.ident}"]`)
        const clean = this.querySelector(`[data-ident-clean="${this.ident}"]`)
        const plus = this.querySelector(`[data-ident-plus="${this.ident}"]`)
        if (plus) plus.classList.remove('_tgl-hide')
        if (clean) clean.classList.remove('_tgl-hide')
        title.style.color = 'dodgerblue'
        this.wrapper.classList.add('form-row-wrapper-active')
    }

    handleInputFocusOut = () => {
        const title = this.querySelector(`[data-ident-title="${this.ident}"]`)
        const clean = this.querySelector(`[data-ident-clean="${this.ident}"]`)
        const plus = this.querySelector(`[data-ident-plus="${this.ident}"]`)
        if (plus) plus.classList.add('_tgl-hide')
        if (clean) clean.classList.add('_tgl-hide')
        title.style.color = 'chocolate'
        this.wrapper.classList.remove('form-row-wrapper-active')
    }

    handleInputKeyup = () => {
        this.adjustTextarea()
        const content = this.inputField.value
        const title = this.querySelector(`[data-ident-title="${this.ident}"]`)
        const clean = this.querySelector(`[data-ident-clean="${this.ident}"]`)
        if (content !== '' && content !== ' ') {
            if (title) title.classList.remove('_tgl-hide')
            if (clean) clean.classList.remove('_tgl-hide')
        } else {
            if (title) title.classList.add('_tgl-hide')
            if (clean) clean.classList.add('_tgl-hide')
        }

        clearTimeout(this.timeoutremId)
        this.timeoutremId = setTimeout(() => {
            this.wrapper.style.backgroundColor = 'lavender'
            setTimeout(() => {
                this.wrapper.style.backgroundColor = 'white'
            }, 200)
        }, 1000)
    }

    adjustTextarea = () => {
        let t = this.inputField
        const contentHeight = t.scrollHeight
        t.style.height = `${contentHeight}px`
    }

    pasteInTextarea = () => {
        this.handleInputKeyup()
        setTimeout(() => {
            this.adjustTextarea()
        }, 10);
    }

    render() {
        this.innerHTML = this.data
        this.inputField = this.querySelector(`[data-ident-txt-area="${this.ident}"]`);
        this.inputField.addEventListener('focus', this.handleInputFocus, true);
        this.inputField.addEventListener('focusout', this.handleInputFocusOut, true);
        this.inputField.addEventListener('keyup', this.handleInputKeyup, true);
        this.inputField.addEventListener('paste', this.pasteInTextarea, true);
        this.wrapper = this.querySelector(`[data-ident-wrapper="${this.ident}"]`);
    }
}; customElements.define('custom-form-remark', FormRemark);

class HazChemRow extends COMPONENTS {

    connectedCallback() {
        //const content = this.getAttribute('data-content')
        const { supplier, tradename } = this.gatherAttributes();
        let html = ''
        html += this.divorow({ class: 'dialog-output-wrapper' })
        html += this.divc({ class: 'svg-container-row', content: '<img class="dialog-output-svg-row" src="chemical-lab-svgrepo-com.svg" alt="Your SVG Image">' })
        html += this.divocol({ class: 'dialog-right-txt _t' })
        html += this.divc({ class: 'dialog-right-txt _t dialog-right-txt-head', content: supplier })
        html += this.divc({ class: 'dialog-right-txt _t', content: tradename })
        html += this.end(1)
        html += this.end(1)
        this.data = html
        this.render();

    }
    render() {
        if (this.data) {
            this.innerHTML = this.data
        } else {
        }
    }
}; customElements.define('my-hcr', HazChemRow);

class TTT extends HTMLElement {
    constructor() {
        super();
        this.classList.add('custom-class');
    }

    async connectedCallback() {
        const data = await this.fetchData();
        this.render(data);
    }

    // disconnectedCallback() {
    //     // Called every time the element is removed from the DOM. 
    // }
    // attributeChangedCallback(attrName, oldVal, newVal) {
    //     // Called when an attribute was added, removed, or updated
    // }
    // adoptedCallback() {
    //     // Called if the element has been moved into a new document
    // }

    async fetchData() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const jsonData = await response.json();
            return jsonData.title;
        } catch (error) {
            console.error(error);
            return 'Error fetching data';
        }
    }

    change = async () => {
        await this.delay(2000)
        this.render('changed')
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    render(data) {
        this.innerHTML = data;
        //this.style.backgroundColor = 'red'
    }
}; customElements.define('element-ttt', TTT);

class PersonEntry extends COMPONENTS {

    constructor() {
        super();
        this.classList.add('custom-form-input_wrapper');
    }

    connectedCallback() {
        this.data = this.divc({ class: 'segment-title', content: 'Adress Informationen' })
        this.data += this.divorow({ atrs: 'name' })
        this.data += this.end(1)
        this.data += this.divorow({ atrs: 'adress' })
        this.data += this.end(1)
        this.data += this.divorow({ atrs: 'tel_mail' })
        this.data += this.end(1)
        this.data += this.divorow({ atrs: 'city' })
        this.data += this.end(2)
        this.render()
    }

    render() {
        this.innerHTML = this.data
        let nameRow = this.querySelector(`[name]`)
        nameRow.appendChild(new InputElement({
            autocomplete: "given-name",
            title: "First Name",
            clean: true
        }));
        nameRow.appendChild(new InputElement({
            autocomplete: "family-name",
            title: "Last Name",
            clean: true
        }));
        let adressRow = this.querySelector(`[adress]`)
        adressRow.appendChild(new InputElement({
            autocomplete: "address-line1",
            title: "address",
            clean: true
        }));
        adressRow.appendChild(new InputElement({
            autocomplete: "address-line2",
            title: "Nr.",
            clean: true
        }));
        let telMailRow = this.querySelector(`[tel_mail]`)
        telMailRow.appendChild(new InputElement({
            autocomplete: "tel",
            title: "Telefon",
            clean: true
        }));
        telMailRow.appendChild(new InputElement({
            autocomplete: "email",
            title: "email",
            fieldident: 'mainfield5',
            clean: true
        }));
        let cityRow = this.querySelector(`[city]`)
        cityRow.appendChild(new InputElement({
            autocomplete: "address-level2",
            title: "City",
            clean: true
        }));
        cityRow.appendChild(new InputElement({
            autocomplete: "postal-code",
            title: "postal-code",
            clean: true
        }));
    }

}; customElements.define('custom-person-form', PersonEntry);

class DIALOG extends COMPONENTS {
    connectedCallback() {
        const desc = "Search the HazChem database to retrieve information related to hazardous chemicals. Or upload your .xls file containing SDS Information. We do the adjustment for you"
        let html = ''
        html += this.divorow({ class: 'dialog-wrapper' })
        html += this.divocol({ class: 'dialog-left' })
        html += this.divc({ class: 'svg-container-tab', content: '<img class="svg-img-tab" src="table-of-contents-svgrepo-com.svg" alt="Your SVG Image">' })
        html += this.divc({ class: 'dongle', content: '21' })
        //html += this.divc({ class: 'svg-container', content: '<img class="svg-img" src="test-tubes-svgrepo-com.svg" alt="Your SVG Image">' })
        html += this.divc({ class: 'dialog-left-txt', content: desc })
        //html += `<iframe width="100%" src="https://www.youtube.com/embed/iQ1NWY0rziE?si=kLp8Nk2365mVZVZ5" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`

        html += this.divorow({ class: 'dialog-upload' })
        //html += this.divc({ class: '', content: '<img style="width: 40px" src="upload-square-svgrepo-com.svg" alt="Your SVG Image">' })

        html += this.divc({ class: '', content: '<img style="width: 40px" src="photos-filled-svgrepo-com.svg" alt="Your SVG Image">' })
        html += this.divc({ class: '', content: '<img style="width: 40px" src="pdf-file-svgrepo-com.svg" alt="Your SVG Image">' })
        html += this.divc({ class: '', content: '<img style="width: 40px" src="xls-svgrepo-com.svg" alt="Your SVG Image">' })
        html += `<my-btn title="upload" action="upload"></my-btn>`
        html += this.end(2)
        html += this.divocol({ class: 'dialog-right', atrs: 'addDialog' })
        html += this.end(3)
        this.data = html
        this.render();
    }

    render() {
        this.innerHTML = this.data
        const add = this.querySelector(`[addDialog]`)

        const searchbar = new SearchBar({
            title: "I'm a teapot",
            dropdown: true,
            clean: true
        });
        add.appendChild(searchbar);

        const myElement1 = new InputElement({
            title: "I'm a teapot",
            dropdown: true,
            clean: true
        });
        add.appendChild(myElement1);

        const myElement2 = new InputElement({
            content: "10.02.2024",
            title: "I control the date",
            date: true,
            clean: true
        });
        add.appendChild(myElement2);
        add.appendChild(new PersonEntry({}));
        add.appendChild(new FormRemark({
            title: "I'm a teapot in a textarea",
            fieldident: 'mainfield2',
        }
        ))
    }
}; customElements.define('my-dialog', DIALOG);

class HEADER extends COMPONENTS {

    connectedCallback() {
        let html = ''
        html += this.divorow({ class: 'header' })
        html += this.divc({ class: 'svg-container-row', content: '<img class="" style="width: 50px;" src="user-circle-svgrepo-com.svg" alt="Your SVG Image">' })
        html += this.end(1)
        this.data = html
        this.render();

    }
    render() {
        this.innerHTML = this.data
    }
}; customElements.define('my-header', HEADER);
