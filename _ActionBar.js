import { COMPONENTS } from './_Base.js';
import { SVG } from './_svg.js'; const _svg = new SVG();
const man = _svg.man()
const d = document
const main = d.querySelector(`main`)

export class OrgaBar extends COMPONENTS {

    constructor({ renderedFrom }) {
        super();
        this.data = ""
        console.log(renderedFrom)
        const { width, top, left, height } = renderedFrom.getBoundingClientRect();
        this.style.width = `${width}px`
        this.style.top = `${top - 3}px`
        this.style.left = `${left + width + 16}px`
        this.render()
    }

    render() {
        this.innerHTML = this.data
        const _actionbar = d.querySelector('[actionbar]');
        _actionbar.appendChild(this)
    }
}; customElements.define('orga-action-bar', OrgaBar);
