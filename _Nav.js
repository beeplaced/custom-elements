import { COMPONENTS } from './_Base.js';
import { SVG } from './_svg.js'; const __svg = new SVG();
import API from '../_api.js';
const _api = new API();
const d = document;
const mobile = true
import { routes } from '../mobile/routes.js'


export class NAV extends COMPONENTS {

    constructor(params) {
        super();
        this.subs = {}
        if (params?.route) this.route = params.route
        this.open = null
        this.classList.add('nav-body-scroll');
        this.navElements = {
            root: (el, rootIdent) => {
                let nav = this.divorow({ class: `nav-inner-section __b`, atrs: `data-open="${rootIdent}" data-chapter=true` })
                nav += this.divc({ class: 'nav-clr', style: `background-color: ${this.color};` })
                nav += __svg.nav({ el: rootIdent })
                nav += this.divc({ class: '_t nav-txt', content: el })
                nav += this.divc({ class: '_mdl' })
                nav += this.divc({ class: 'nav-opener', content: __svg.dropdownInput() })
                nav += this.end(1)
                return nav
            },
            sub: (content) => {
                const { ident, el, amount = false } = content
                let nav = this.divorow({ class: `nav-inner-section`, atrs: `data-open="${ident}"` })
                nav += this.divc({ class: 'nav-clr', style: `background-color: ${this.color};` })
                nav += __svg.nav({ el: ident })
                nav += this.divc({ class: '_t nav-txt', content: el })
                if (amount) nav += this.tag({ class: 'tag-nav-amount', content: amount })
                nav += this.end(1)
                return nav
            },
            add: (content) => {
                const { ident, el } = content
                let nav = this.divorow({ class: `nav-inner-section`, atrs: `data-open="${ident}"` })
                nav += this.divc({ class: 'nav-clr', style: `background-color: ${this.color};` })
                nav += __svg.addItemNav()
                nav += this.divc({ class: '_t nav-txt', content: el })
                nav += this.end(1)
                return nav
            }
        }
    }

    async loadData() {
        const orga = await _api.CALL({
            api: 'nav', body: JSON.stringify({})
        })
        return orga
    }

    async loadSpecific(segment) {
        const specifics = await _api.CALL({
            api: 'navspecicifs', body: JSON.stringify({ segment: this.route })
        })
        return specifics
    }

    addSpecific = (specifics) => {

        if (!specifics) return
        const current = this.querySelector(`[data-open="${this.route}"`)
        let add = this.divocol({})
        specifics.data.map(a => {
            add += this.navElements.add({ ident: 'risks', el: a.title, parentId: 'riskassessment' })
        })
        add += this.end(1)
        current.insertAdjacentHTML('afterend', add);
    }

    openAll = () => {
        this.querySelectorAll('[data-active="false"]').forEach(navEl => {
            navEl.setAttribute('data-active', 'true');
            navEl.classList.add('active');
            navEl.classList.remove('passive');
        })
    }

    closeAll = () => {
        this.querySelectorAll('[data-active="true"]').forEach(navEl => {
            navEl.setAttribute('data-active', 'false');
            navEl.classList.add('passive');
            navEl.classList.remove('active');
        })
    }

    openSegment = (open) => {
        const navEl = this.querySelector(`[data-navsub="${open}"`)
        if (navEl) {
            const { active } = navEl.dataset
            switch (active) {
                case 'true':
                    navEl.setAttribute('data-active', 'false');
                    navEl.classList.add('passive');
                    navEl.classList.remove('active');
                    break;
                default:
                    navEl.setAttribute('data-active', 'true');
                    navEl.classList.add('active');
                    navEl.classList.remove('passive');
                    break;
            }
        }
    }

    updateUrl = (path) => {
        const newPath = `${window.location.origin}/${path}`;
        history.pushState({}, "", newPath);
    }

    buildNav = (orga) => {
        const { nav, meta } = orga.data
        this.data = ''
        Object.keys(nav).map(el => {
            this.color = meta[el] || 'lightgrey'
            const rootIdent = el.replace(/ /g, '').toLowerCase()
            this.data += this.navElements['root'](el, rootIdent)
            const subs = nav[el]
            if (subs.length === 0) return
            this.subs[rootIdent] = 1
            this.data += this.divocol({ class: `nav-tgl${subs[0].ident === this.route ? ' active' : ''}`, atrs: `data-navsub="${rootIdent}" data-active="false"` })
            subs.map(elSub => {
                if (elSub.ident === this.route) this.open = elSub.parentId
                this.data += this.navElements['sub'](elSub)
            })
            this.data += this.end(1)
        })
        this.render()
    }

    buildNavMobile = (orga) => {
        const { nav, meta } = orga.data
        this.data = `<div class="menu-inner-nav-ul"><ul class="_m_click">`
        Object.keys(nav).map(el => {
            const rootIdent = el.replace(/ /g, '').toLowerCase()
            this.data += `<li class="nav-headline" data-open="${rootIdent}">${__svg.nav({ el: rootIdent, usage: 'mobile' })}${el}</li>`
            const subs = nav[el]
            // if (subs.length === 0) return
            // this.subs[rootIdent] = 1
            // this.data += this.divocol({ class: `nav-tgl${subs[0].ident === this.route ? ' active' : ''}`, atrs: `data-navsub="${rootIdent}" data-active="false"` })
            subs.map(elSub => {
                this.data += `<li data-open="${elSub.ident}">${__svg.nav({ el: elSub.ident, usage: 'mobile' })}${elSub.el}</li>`
            })
        })
        this.data += `</ul></div>`
        this.innerHTML = this.data
        this._mobileClick()
    }

    _mobileClick = () => {
        const clicker = this.querySelector('._m_click')
        console.log(clicker)
        clicker.addEventListener('touchstart', (e) => {
            if (e?.target?.tagName !== 'LI') return
            const open = e?.target?.dataset?.open
            if (!open) return
            routes[open] ? routes[open]() : routes.def(open)
            console.log(e.target.dataset)
            this.updateUrl(open)
            const mobileMenu = d.querySelector('.menu')
            if (mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                mobileMenu.classList.add('close');
            }
        })
    }

    render() {
        this.innerHTML = this.data
        if (this.open !== null) this.openSegment(this.open)
        const current = this.querySelector(`[data-open="${this.route}"]`)
        if (current) current.classList.add('nav-selected')
    }
}; customElements.define('fusion-nav', NAV);