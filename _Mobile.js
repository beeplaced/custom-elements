import { COMPONENTS } from './_Base.js';
import { SVG } from '../mobile/svg.js'; const _svg = new SVG();

export class ActionBar extends COMPONENTS {

    constructor() {
        super();
        this.render()
    }

    render() {
        this.innerHTML = ''
    }
}; customElements.define('action-bar', ActionBar);

export class AnswerBox extends COMPONENTS {

    constructor(route) {
        super();
        this.render(route)
    }

    render(route) {
        let c = this.divc({ class: 'bubble-box-logo' })
        c += this.divc({ class: '_t bubble-box-headline', content: "How many chemicals do you have in your repository?" })
        c += this.divc({
            class: '_t bubble-box-txt', content: "If you say there is an explanation for something, you mean that there is a reason for it. The deputy airport manager said there was no apparent explanation for the crash. [+ for] Scientific explanations for natural phenomena are widely accepted. It's the only explanation for these results. "
        })
        this.innerHTML = c
        this.logo = this.querySelector('.bubble-box-logo')
        this.logo.appendChild(document.createRange().createContextualFragment(_svg.idea()))
    }
}; customElements.define('answer-box', AnswerBox);

export class BubbleBox extends COMPONENTS {

    constructor(route) {
        super();
        this.render(route)
    }

    render(route) {
        let c = this.divc({ class: 'bubble-box-logo' })
        c += this.divc({ class: '_t bubble-box-headline', content: route })
        c += this.divc({
            class: '_t bubble-box-txt', content: "Mountains virtues dead philosophy horror justice evil enlightenment hatred moral will. Reason faith love spirit superiority truth sea war. Truth endless superiority virtues burying dead burying. Hatred ubermensch transvaluation derive transvaluation. Value good prejudice free against dead. Noble snare ultimate law disgust joy ascetic fearful christianity value.Christianity zarathustra prejudice derive overcome horror intentions.Reason dead society right moral.Ascetic deceptions endless madness dead contradict."
        })
        this.innerHTML = c
        this.logo = this.querySelector('.bubble-box-logo')
        this.logo.appendChild(document.createRange().createContextualFragment(_svg.headLogo()))
    }
}; customElements.define('bubble-box', BubbleBox);