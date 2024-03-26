import { COMPONENTS } from './_Base.js';
import API from '../_api.js';
import { DropDown } from './_Dropdown.js';
const _api = new API();
import { SVG } from './_svg.js'; const _svg = new SVG();
import { Window } from './_Window.js';
import { InputElement, InputSimple } from './_InputElement.js';
import { Button } from './_Button.js';
const main = document.querySelector(`main`)
const personsSvg = _svg.linkOrga('persons')
const siteSvg = _svg.linkOrga('sites')
const docSvg = _svg.linkOrga('documents')
const actionSvg = _svg.linkOrga('actions')
const riskSvg = _svg.linkOrga('risks')
const nodeTop = _svg.nodeTop()
const d = document
import Sortable from 'https://cdn.jsdelivr.net/npm/@shopify/draggable/build/esm/Sortable/Sortable.mjs';

const blueShade =
    [
        "#1284b5",
        "#1394d1",
        "#13a3ed",
        "#2caaf1",
        "#45b2f4",
        "#5ebaf7",
        "#78c3fa",
        "#93cefc",
        "#aed9fd",
        "#c9e5ff",
        "#e5f2ff"
    ]

const darker = [
    "#0d6287",
    "#0f73a2",
    "#0f83be",
    "#0f92db",
    "#159ef1",
    "#2da5f5",
    "#47adf8",
    "#61b7fb",
    "#7cc2fc",
    "#96ccff",
    "#b2d8ff"
]

export class OrgaElement extends COMPONENTS {

    constructor({
        lvl = 0,
        title = '',
        connector = 'top',
        ident,
        settings = {},
        type = null,
        root }) {

        super();
        this.setAttribute('data-element', ident);
        this.setAttribute('data-lvl', lvl);

        const backClr = blueShade[lvl]
        const darkerClr = darker[lvl]
        this.setAttribute('data-lvl', typeof lvl === 'number' ? lvl + 1 : lvl);
        if (type) lvl = type
        this.data = ""
        switch (connector) {
            case 'top':
                this.data += this.divocol({ class: 'drag-single-box', atrs: `${title}` })
                if (!root) { this.data += this.divc({ class: 'orga-m orga-connnector orga-connnector-r', content: nodeTop }) }
                break;
            case 'left':
                this.data += this.divorow({ class: 'orga-m' })
                this.data += this.divc({ class: 'orga-connnector orga-connnector-l', content: _svg.nodeL(backClr) })
                break;
        }

        this.data += this.divocol({
            class: `orga-modify orga-box_upper${root ? ' orga-box-root' : ''}`
        })

        this.data += this.divorow({
            class: `orga-box${!root ? ' drag-org' : ''}`,
            style: `background-color: ${settings.bck_color}`
        })
        if (!root) {
            this.data += this.divc({ class: 'orga-img', content: _svg.orgUnit(darkerClr) })
            this.data += _svg.dnd()
        }
        this.data += `<input class="orga-txt" data-openorga="${ident}" style="color: ${settings.color}" maxlength="100" type="text" placeholder="...title" spellcheck="false" autocomplete="off" value="${title}" readonly></input>`
        this.data += this.end(1)
        this.data += this.divc({ class: 'orga-connnector-e', atrs: `_ext_${ident}` })
        this.data += this.end(5)
        this.render()
    }

    render() {
        this.innerHTML = this.data
        this.linkageBox = this.querySelector('.orga-connnector-e')
    }

} customElements.define('ou-element', OrgaElement);

export class ElementRow extends COMPONENTS {

    constructor() {

        super();
        this.data = this.end(1)
        this.render()
    }

    render() {

        //  const tlength = treeNodeIdent.length
        // if (highlight) {
        //     connector = 'left'
        //     elementContent += this.divocol({ class: 'orga-m ch-row-adj' })
        //     decision = true
        // }
        // if (!decision && (tlength > 1 && index >= 3)) {
        //     connector = 'top'
        //     elementContent += this.divorow({ class: 'orga-m' })
        // }
        //connector = 'left'

        this.innerHTML = this.data
    }

} customElements.define('ou-row', ElementRow);

export class ORGA extends COMPONENTS {

    constructor(input) {
        super();
        this.setAttribute('root', true);
        this.setAttribute('data-lvl', 0);
        this.input = input
        this.elementFootprint = {}
        this.focus = 'root'
        this.largeElement = 3
        this.orga = this
        this.click = true
        this.editmode = false
    }

    loadData = async () => {
        this.orga = await _api.CALL({ api: 'ou', body: JSON.stringify({ focus: this.focus }) })
    }

    renderData = async () => {
        await this.orgaChart()
    }

    async updateData() {
        const orga = await _api.CALL({ api: 'ou', body: JSON.stringify({ focus: this.focus }) })
        return orga
    }

    async changeParentOU({ from, to }) {
        await _api.CALL({ api: 'changeparentou', body: JSON.stringify({ from, to }) })
        await this.loadData()
    }

    async linkElement(entry) {
        const { elIdent } = entry
        const orga = await _api.CALL({ api: 'linkorgaelememt', body: JSON.stringify({ elIdent }) })
        return await this.loadData()
    }

    async createElement({ createAtParent, content, _id }) {
        const orga = await _api.CALL({ api: 'createou', body: JSON.stringify({ createAtParent, content, _id }) })
        return orga
        // return await this.loadData()
    }

    async deleteElement({ _id }) {
        await _api.CALL({ api: 'deleteElement', body: JSON.stringify({ _id }) })
        //remove all windows
        //unset focus mode
        this.classList.remove('orga-box-focused')
        return await this.loadData()
    }

    addJoins = (joins, linkageBox) => {
        linkageBox.classList.add('link-added')
        joins.documents.some(j => { linkageBox.appendChild(new LinkDocument(j)) })
        joins.persons.some(j => { linkageBox.appendChild(new LinkPersons(j)) })
        joins.sites.some(j => { linkageBox.appendChild(new LinkSites(j)) })
        joins.actions.some(j => { linkageBox.appendChild(new LinkActions(j)) })
        joins.risks.some(j => { linkageBox.appendChild(new LinkRisks(j)) })
    }

    async orgaChart() {
        const { tree } = this.orga.data
        this.innerHTML = ''
        this.placeholderrows = [] //if needed
        this.lvl = 0
        const that = this

        const loop = async () => {
            await new Promise((resolve, reject) => {
                Object.keys(tree).some((nodeIdent) => {
                    const treeNodeIdent = tree[nodeIdent]
                    if (treeNodeIdent.length === 0) return
                    let existingDiv = that.querySelector(`[data-element="${nodeIdent}"]`)
                    let placeholderDiv = false
                    if (!existingDiv) {
                        if (nodeIdent !== 'root') placeholderDiv = true
                        existingDiv = that //PUT TO ROOT AND CHANGE LATER
                    }

                    const newDiv = new ElementRow()//CREATE DIV HOLDER - 
                    if (placeholderDiv) that.placeholderrows.push({ nodeIdent, newDiv })
                    existingDiv.appendChild(newDiv);

                    if (treeNodeIdent.length > 1) {
                        const orga_box_upper = existingDiv.querySelector('.orga-box_upper')
                        orga_box_upper.classList.add('o-b-u-spread')
                    }
                    that.lvl = parseInt(existingDiv.dataset.lvl)
                    treeNodeIdent.some(({ ident, title, parentId, type, joins, settings, lastChild }) => {
                        const OrgaElementR = new OrgaElement({
                            lvl: that.lvl,
                            title,
                            connector: 'top',
                            ident,
                            type,
                            settings,
                            root: parentId === 'root' ? true : false,
                            parentId
                        })
                        if (joins) {
                            const linkageBox = OrgaElementR.linkageBox
                            that.addJoins(joins, linkageBox)
                        }
                        newDiv.appendChild(OrgaElementR)
                        if (lastChild && !that.editmode) OrgaElementR.setAttribute('data-last', true)
                        that.elementFootprint[ident] = { title, parentId }
                    })
                })
                resolve();
            });
        }; loop()
            .then(() => { this.movePlaceholder() })
            .then(() => { this.addPlusBtn() })
            .then(() => { this.dragAndDropContainer() })
            .catch((error) => {
                console.error("Error occurred:", error);
            });
    }

    addPlusBtn = () => {
        const adds = this.querySelectorAll('[data-last="true"]')
        adds.forEach(OrgaElementR => {
            const ident = OrgaElementR.dataset.element
            const addChild = new Button({ title: "moreAdd", type: "form_add", addclass: "btn-add-child-orga" })
            OrgaElementR.appendChild(addChild)
            addChild.classList.add('btn-center')
            addChild.buttonElement.setAttribute('data-parent', ident);

        })
    }

    movePlaceholder = () => {
        console.log("m,ove");
        if (this.placeholderrows.length === 0) return
        this.placeholderrows.some(({ nodeIdent, newDiv }) => {
            let existingDiv = this.querySelector(`[data-element="${nodeIdent}"]`)
            existingDiv.appendChild(newDiv)
        })
    }

    orgaClick = () => {

        this.addEventListener('click', (e) => {
            let target = e.target
            const entireBox = target.closest('.drag-ou')
            entireBox.classList.add('drag-ou-active')
            switch (true) {
                case target.classList.contains('link-circle')://click ppl
                    break;
                default: //orga window
                    const el = target.querySelector('[data-openorga]')
                    const elTitle = el.innerHTML
                    const elIdent = el.dataset.openorga
                    const { parentId } = this.elementFootprint[elIdent]
                    const window = new Window({
                        title: `org | options | open | focus | ${elTitle}`,
                        drag: true,
                        center: true,
                        modal: false,
                    })
                    window.render()

                    class ChangeOrga extends InputElement {

                        dropDownAction = () => {
                            const rect = this.wrapper.getBoundingClientRect();
                            rect.dropDown = this.dropdown //setiings
                            this.dropDownWindow = new DropDown(rect)
                            this.buildWindow(this.dropDownWindow);
                            this.dropdownChange()
                        }
                        dropdownChange = () => {
                            this.dropDownWindow.addEventListener('click', (e) => {
                                const target = e.target
                                if (target.classList.contains("rec-tag")) {
                                    if (target.dataset.id) {
                                        this.style.backgroundColor = 'red'
                                    }
                                }
                                // this.inputField.value = e.target.innerHTML
                                // const clean = this.cleanButton
                                // if (clean) clean.classList.remove('_tgl-hide')
                            });
                        }

                    } customElements.define('change-orga-dropdown', ChangeOrga);

                    this.inputChange = new ChangeOrga({
                        title: 'parent',
                        dropdown: { _id: elIdent, parentId },
                        content: parentId
                    })

                    window.body.appendChild(this.inputChange)

                    this.inputChange.addEventListener('click', (e) => {
                        const target = e.target
                        if (target.classList.contains("rec-tag"))
                            if (target.dataset.id) {
                                this.orga.style.backgroundColor = 'red'
                            }
                    }
                        // this.inputField.value = e.target.innerHTML
                        // const clean = this.cleanButton
                        // if (clean) clean.classList.remove('_tgl-hide')
                    )

                    //dropDownButton.addEventListener('click', (e) => {




                    // console.log(e.target.classList)
                    // const target = e.target
                    // if (target.classList.contains("rec-tag")) {
                    //     if (target.dataset.id) {
                    //         console.log(target.dataset)
                    //     }
                    // }
                    // // this.inputField.value = e.target.innerHTML
                    // // const clean = this.cleanButton
                    // // if (clean) clean.classList.remove('_tgl-hide')
                    //});


                    window.body.appendChild(new InputElement({
                        title: 'ident',
                        clean: true,
                        content: elTitle
                    }))
                    const focusBtn = new Button({ title: "focus", addclass: "btn-def blue" })
                    window.body.appendChild(focusBtn)
                    focusBtn.addEventListener('click', (e) => {
                        this.focus = elIdent
                        this.loadData().then((orga) => {
                            this.innerHTML = ''
                            const { tree, people } = orga.data
                            this.orgaChart(tree)
                            this.peopleChart(people)
                            this.adjust()
                            this.orgaClick()
                        })
                    })
                    window.body.appendChild(new Button({ title: "create Child Element", addclass: "btn-def blue" }))
                    window.body.appendChild(new Button({ title: "add people", addclass: "btn-def pink" }))
                    window.body.appendChild(new Button({ title: "save", addclass: "btn-def blue" }))
                    break;
            }
        })
    }

    boxFocusOff = () => {
        this.click = true
        this.classList.remove('orga-box-focused')
        // const el = target.closest('.orga-box_upper')
        // el.classList.remove('orga-box_upper-focus')
    }

    focusBoxInput = (target) => {
        this.click = false
        this.classList.add('orga-box-focused')
        const el = target.closest('.orga-box_upper')
        el.classList.add('orga-box_upper-focus')
        target.focus()
        target.readOnly = false;
        const parnt = target.parentNode
        parnt.classList.add('ou-input')
        parnt.querySelector('.orga-img').style.display = 'none'
    }

    focusBoxInputOut = (target) => {
        this.click = true
        this.classList.remove('orga-box-focused')
        const el = target.closest('.orga-box_upper')
        el.classList.remove('orga-box_upper-focus')
        target.readOnly = true;
        const parnt = target.parentNode
        parnt.classList.remove('ou-input')
        parnt.querySelector('.orga-img').style.display = 'unset'
    }

    boxFocusNewElement = (createAtParent) => {
        const { tree } = this.orga.data
        this.editmode = true
        this.innerHTML = ''
        this.orgaChart(tree)

        const target = this.querySelector('[data-openorga="new"]')
        this.focusBoxInput(target)
        target.readOnly = false;
        const parnt = target.parentNode
        parnt.classList.add('ou-input')
        parnt.querySelector('.orga-img').style.display = 'none'
        const ounewbtn = new Button({ title: "checkInputOU", type: "form_add", addclass: "b-round" })
        parnt.appendChild(ounewbtn)
        ounewbtn.addEventListener('click', async (e) => {
            const drawer = ounewbtn.querySelector('.c-i-svg-c')
            drawer.classList.add('draw-input-btn')
            const content = target.value
            console.log(content)
            //if content empty
            const ret = await this.createElement({ createAtParent, content, _id: target.dataset.openorga })
            //  if (status !== 200 || status !== 201) //exit
            console.log(ret)
            if (ret?.create) {
                const checker = ounewbtn.querySelector('.check-input-svg')
                checker.classList.add('checked-input-svg')
                target.setAttribute('data-openorga', ret.create._id);
            }
            setTimeout(function () {
                drawer.classList.remove('draw-input-btn')
            }, 400);
        })
    }

    changeParent = () => {
        this.inputChange
    }

    dragAndDropEvent = (elIdent) => {
        let hoveredElement = null;
        const { sortable } = this.sortEvents.find(a => a.elIdent === elIdent)
        if (!sortable) return
        sortable.on('drag:start', (evt) => {
            const draggedItem = evt.data.source
            const orgaBoxUpper = draggedItem.closest('.orga-box_upper')
            const { width } = orgaBoxUpper.getBoundingClientRect()
            draggedItem.style.width = `${width}px`
            document.addEventListener('mousemove', function (event) {
                orgaBoxUpper.classList.add('orga-box-upper-mirror')
                hoveredElement = document.elementFromPoint(event.clientX, event.clientY);
            });
        });

        sortable.on('drag:stop', (evt) => {
            if (!hoveredElement || hoveredElement === null) return
            const fromElement = evt.data.originalSource.closest('ou-element')
            const from = fromElement.dataset.element
            const box = hoveredElement.closest('.orga-box_upper')
            box.classList.add('slider-box-flicker')
            const draggedElement = hoveredElement.closest('ou-element')
            const to = draggedElement.dataset.element
            if (from === to) return
            setTimeout(() => {
                box.classList.remove('slider-box-flicker')
                evt.data.originalSource.closest('.orga-box_upper').classList.remove('orga-box-upper-mirror')
                this.parentChange(from, to)
            }, 200);
        })
    }

    dragAndDropContainer = () => {
        const draggableContainers = this.querySelectorAll('.drag-org');
        this.sortEvents = []
        draggableContainers.forEach(container => {
            const sortable = new Sortable(container, {
                draggable: '.drag-org',
            });
            const elIdent = container.closest('[data-element]').dataset.element
            this.sortEvents.push({ elIdent, sortable })
        })
    }

    parentChange = async (from, to) => {
        await this.changeParentOU({ from, to })
        this.renderData()
    }
}; customElements.define('ou-chart', ORGA);

export class LinkDocument extends COMPONENTS {

    constructor(joins) {
        super();
        console.log('here')
        const { title, subtitle, _id, extension, thumbnail } = joins
        this.title = title
        this.extension = extension
        this.thumbnail = thumbnail
        this.buildDoc()
    }

    buildDoc = () => {
        switch (true) {
            case this.thumbnail !== undefined:
                const contentType = this.thumbnail.contentType
                const thumbnailData = this.thumbnail.data;
                const base64String = thumbnailData;
                const thumbnailImg = `data:${contentType};base64,${base64String}`
                this.data = `<img class="ou-thumbnail" src="${thumbnailImg}" alt="${this.title}"></img>`
                break;
            case this.extension === ".jpeg" || this.extension === ".png":
                this.data = this.divc({ class: 'person-tag-circle', content: _svg.linkTab('image') })
                break;
            default:
                this.data = docSvg
                break;
        }
        this.render()
    }

    render() {
        this.innerHTML = this.data
    }

} customElements.define('link-orga-link-element-document', LinkDocument);

export class PlusButton extends COMPONENTS {

    constructor() {
        super();
        this.data = 'Add Child'
        this.render()
    }

    render() {
        this.innerHTML = this.data
    }

} customElements.define('link-orga-plus', PlusButton);

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

} customElements.define('link-orga-link-element-persons', LinkPersons);

export class LinkSites extends COMPONENTS {

    constructor(joins) {
        super();
        const { title, id } = joins
        this.data = siteSvg
        this.render()
    }

    render() {
        this.innerHTML = this.data
    }

} customElements.define('link-orga-link-element-sites', LinkSites);

export class LinkActions extends COMPONENTS {

    constructor(joins) {
        super();
        const { title, id } = joins
        this.data = actionSvg
        this.render()
    }

    render() {
        this.innerHTML = this.data
    }

} customElements.define('link-orga-link-element-actions', LinkActions);

export class LinkRisks extends COMPONENTS {

    constructor(joins) {
        super();
        const { title, id } = joins
        this.data = riskSvg
        this.render()
    }

    render() {
        this.innerHTML = this.data
    }

} customElements.define('link-orga-link-element-risks', LinkRisks);

export class LinkElement extends COMPONENTS {

    constructor(node) {
        super();
        this.data = this.divo({ class: 'ppl-box' })
        const dep = Object.keys(node)
        const ident = dep[0]
        const ppl = node[ident]
        ppl.map(p => {
            this.data += this.linkCircle({})
        })
        this.data += this.end(1)
        this.render()
    }

    linkCircle = () => {
        let c = this.divo({ class: 'link-circle' })
        c += man
        c += this.end(1)
        return c
    }

    render() {
        this.innerHTML = this.data
    }

} customElements.define('link-orga-link-element', LinkElement);