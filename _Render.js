import { COMPONENTS, EditableFields } from './_Base.js';
import { SVG } from './_svg.js'; const _svg = new SVG();
const man = _svg.man()


export class RENDER extends COMPONENTS {

    static instanceCount = 0;

    constructor(input) {
        super();
        this.input = input
    }

    forwardUrl = () => {
        window.location.href = `/use/?audits=#123`;
    }

    linkCircle = () => {
        let c = this.divorow({ class: 'link-circle' })
        c += man
        c += this.end(1)
        return c
    }

    linkDoc = (entry) => {
        const { content } = entry
        let c = this.divorow({ class: 'link-doc' })
        c += _svg.linkTab('doc')
        c += this.divc({ class: '_t', content })
        c += this.end(1)
        return c
    }

    dateTimeTag = (entry) => {
        const { time } = entry
        let c = this.divorow({ class: 'datetime-tag' })
        c += this.divc({ class: '_t', content: time })
        c += this.end(1)
        return c
    }

    headline = (content) => {
        let c = this.divorow({ class: 'linkage-headline' })
        c += this.divc({ class: '_t', content })
        c += this.end(1)
        this.innerHTML += c
    }

    render() {
        this.innerHTML = this.data
    }
}; customElements.define('custom-render', RENDER);

export class DocumentBox extends EditableFields {

    constructor(params) {
        super();
        const {
            content = '',
            title = 'input',
            readonly = false,
            joins_docs,
            evidence_documents,
            editable = false
        } = params
        this.content = content
        this.readonly = readonly
        this.title = title
        this.joins_docs = joins_docs
        this.evidence_documents = evidence_documents
        this.editable = editable //move // delete
        this.classList.add('custom-form')
        if (this.readonly) this.classList.add('active')
    }

    inner = () => {
        let h = this.divorow({ class: 'form-input' })
        this.joins_docs.some(j => {
            const { title, _id, extension, thumbnail } = this.evidence_documents.find(p => p._id === j)
            h += this.linkDocs({ title, _id, extension, thumbnail })
        })
        h += this.end(1)
        return h
    }

    grabTitle = () => this.title || this.content

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
        if (this.editable) this.useEditable()
        this.postRender()
    }

}; customElements.define('document-box', DocumentBox);

export class Element extends COMPONENTS {

    constructor() {
        super();
        this.render()
    }

    render() {

    }
}; customElements.define('custom-element', Element);

