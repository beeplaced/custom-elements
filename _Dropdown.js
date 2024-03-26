import { COMPONENTS } from './_Base.js';
import { SVG } from './_svg.js'; const _svg = new SVG();
const d = document;
import { months, currentMonth, currentYear, startYear, endYear } from './__params.js';
import API from '../_api.js';
const _api = new API();

export class DropDown extends COMPONENTS {

    constructor(params) {
        super();
        console.log(params)
        const { width, top, left, height, dropdown } = params
        this.window = "moreoumenu"//params?.dropdown || "def"//'getParentOU' //type
        this.style.width = `${width}px`
        this.style.top = `${top + height + 1}px`
        this.style.left = `${left}px`
        this.dropDown = dropdown
        this.style.maxHeight = '700px'
        this.examples = [
            'Lorem ipsum dolor sit amet',
            'Consectetur adipiscing elit',
            'Sed do eiusmod tempor incididunt',
            'Ut labore et dolore magna aliqua',
            'Ut enim ad minim veniam',
            'Quis nostrud exercitation ullamco',
            'Laboris nisi ut aliquip ex ea commodo consequat',
            'Duis aute irure dolor in reprehenderit',
            'Voluptate velit esse cillum dolore',
            'Fugiat nulla pariatur',
            'Excepteur sint occaecat cupidatat non proident',
            'Sunt in culpa qui officia deserunt mollit anim id est laborum',
            'Proin gravida nibh vel velit auctor aliquet',
            'Aenean sollicitudin, lorem quis bibendum auctor',
            'Nisi elit consequat ipsum, nec sagittis sem nibh id elit',
            'Duis sed odio sit amet nibh vulputate cursus',
            'Morbi accumsan ipsum velit',
            'Nam nec tellus a odio tincidunt auctor a ornare odio',
            'Sed non mauris vitae erat consequat auctor eu in elit',
            'Class aptent taciti sociosqu ad litora torquent per conubia nostra'
        ];
    }

    update = (entry) => {
        console.log(entry)
        //this.body.innerHTML = `Filter by ${entry.filter}`
        const tag = entry.filter.split(' ')[0]
        this.body.innerHTML = ''
        let count = 0
        this.examples
            .filter(content => content.toLowerCase().includes(tag))
            .some((content, i) => {
                count = i +1
                this.body.innerHTML += this.divc({ class: '_t rec-tag', atrs: `data-contentback="${content}"`, content });
            });
        this.header.innerHTML = `${count} entries`
    }

    dropdownContent = {
        year_month_select: () => {
            let w_body = ''
            w_body += this.divorow({ class: 'dropdown-body', atrs: '_dropdown_body', style: 'align-items: baseline;' })
            w_body += this.divocol({ class: 'dropdown-body', atrs: 'data-dropdown-month' })
            months['en'].some((month, i) => {
                w_body += this.divc({
                    class: `_t _rec_tag ${i === currentMonth ? '_rec_tag_selected' : ''}`,
                    atrs: `content_back="${i}" type="month"`,
                    content: month
                })
            })
            w_body += this.end(1)
            w_body += this.divocol({ class: 'dropdown-body', atrs: 'data-dropdown-year', style: 'max-height: 315px; overflow: auto' })
            w_body += this.divocol({ class: 'dropdown-body_xxx' })
            for (let year = startYear; year <= endYear; year++) {
                w_body += this.divc({
                    class: `_t _rec_tag ${year === currentYear ? '_rec_tag_selected' : ''}`,
                    atrs: `content_back="${year}" type="year"`,
                    content: year
                })
            }
            w_body += this.end(1)
            w_body += this.end(1)
            w_body += this.end(1)
            return w_body
        },
        question_autocomplete: () => {
            const hazChemQuestions = [
                "Show me everything you have to henkel",
                "What is the chemical name and CAS (Chemical Abstracts Service) number of the hazardous substance?",
                "How is the hazardous chemical stored to ensure safety?",
                "Are there specific storage requirements, such as temperature or ventilation?",
                "What is the emergency response plan in case of spills, leaks, or exposure incidents?",
                "Are there emergency contact details readily available?",
                "How are hazardous chemicals transported, and what precautions are taken during transit?",
                "Are transportation documents and labeling compliant with regulations?",
                "What PPE is required for handling or working with the hazardous chemical?",
                "Is there a system for providing and maintaining PPE?",
                "Are employees trained in the safe handling and emergency procedures related to hazardous chemicals?",
                "Do employees have the necessary certifications for handling specific hazardous substances?",
            ];

            let w_body = ''
            w_body += this.divocol({ class: 'dropdown-body', atrs: 'question_autocomplete' })
            hazChemQuestions.some(q => {
                w_body += this.divc({
                    class: '_t _rec_tag',
                    atrs: `content_back="${q}" type="question"`,
                    content: q
                })
            })
            w_body += this.end(1)
            return w_body
        },
        def: () => {
            const examples = this.examples
            let w_body = ''
            w_body += this.divc({ class: 'dropdown-header _t', content: `${examples.length} entries` })
            w_body += this.divocol({ class: 'dropdown-content d-c-grow' })
            examples.some(content => {
                w_body += this.divc({ class: '_t rec-tag', atrs: `data-contentback="${content}"`, content })
            })
            w_body += this.end(1)
            return w_body
        },
        moreoumenu: () => {
            const actions = [
                {ident: 'focus', title: 'Focus Element'}, 
                {ident: 'child', title: 'create Child Element'}, 
                {ident: 'linkelements', title: 'Link Elements'},
                {ident: 'delete', title: 'Delete Element (Block)'},
            ]
            let w_body = this.divocol({ class: 'dropdown-content d-c-grow' })
            actions.some(c => { w_body += this.divc({ class: '_t rec-tag big', atrs: `data-action="${c.ident}"`, content: c.title }) })
            w_body += this.end(1)
            return w_body
        },
        getParentOU: async () => {
            const svg = _svg.nav({ el: 'ou', usage: 'dropdown' })
            const orga = await _api.CALL({
                api: 'getparentou', body: JSON.stringify({
                    element: this.dropDown._id,
                    parentId: this.dropDown.parentId,
                    ident: this.dropDown.ident
                })
            })
            console.log(orga)
            let w_body = ''
            let parent = ''
            w_body += this.divc({ class: 'dropdown-header', content: `${orga.length} entries` })
            orga.some(a => {
                if (parent !== a.parentId) {
                    w_body += this.divorow({ class: 'rec-tag-h-wrapper' })
                    w_body += svg
                    w_body += this.divc({ class: '_t rec-tag-h', content: `${a.parentId}` })
                    w_body += this.end(1)
                    parent = a.parentId
                }
                w_body += this.divc({ class: 'rec-tag', content: a.name, atrs: `data-id="${a.id}"` })
            })

            return w_body
        }
    }

    connectedCallback() {
        this.loadData();
    }

    async loadData() {
        try {
            this.data = this.dropdownContent[this.window] ? await this.dropdownContent[this.window]() : this.dropdownContent.def()
            this.render();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    render() {
        this.innerHTML = this.data
        this.body = this.querySelector('.dropdown-content')
        this.header = this.querySelector('.dropdown-header')
        // setTimeout(() => {
        // this.querySelector('.dropdown-content').classList.remove('d-c-grow')
        // }, 200)
    }
}
customElements.define('custom-dropdown', DropDown);