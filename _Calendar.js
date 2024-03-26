import { COMPONENTS } from './_Base.js';
import { Button, InputButton } from './_Button.js';
import { DropDown } from './_Dropdown.js';
import { months, weekDays, today, currentMonth, currentYear, currentDay } from './__params.js';

Date.prototype.getWeekNumber = function (
    currentMonth,
    currentYear,
    currentDay
) {
    var d = new Date(Date.UTC(currentYear, currentMonth, currentDay));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

export class CALENDAR extends COMPONENTS {

    constructor(params) {
        super();
        const { width, top, left, height } = params
        this.window = '_cal'
        this.style.width = `${width}px`
        this.style.top = `${top + height + 1}px`
        this.style.left = `${left}px`
        this.classList.add('__d');
    }

    connectedCallback() {
        this.ident = "my_calendar"
        this.selfIdent = `win_${this.window}`
        this.headerIdent = `w_header_${this.window}`
        this.bodyIdent = `w_body_${this.window}`
        this.windowCorpus = this.divocol({ class: '__w-wrapper' })
        this.windowCorpus += this.divc({ class: '_t', atrs: this.bodyIdent, content: '---' })
        this.windowCorpus += this.end(1)
        this.execute();
    }

    calHeader = () => {
        const days = weekDays['en']
        let cal = this.divo({ class: "calendar_row" })
        cal += this.divc({ class: "cal-row cal_kw", content: 'KW' });
        for (let day = 0; day <= 6; day++) cal += this.divc({ class: "cal-row cal-header _t", content: days[day] });
        cal += this.end(1)
        return cal
    }

    calcCalendar = (givenYear = today.getFullYear(), givenMonth = today.getMonth(), givenDay = 0) => {
        const isCurrentMonth = givenYear === currentYear && givenMonth === currentMonth ? true : false
        let cal = this.calHeader();
        const init = new Date(givenYear, givenMonth, givenDay).getDay();
        let diff = 0 - (init - 1);

        let s_calWeek = 0;
        let count_weeks_days = 0;

        for (let days = 0; days <= 34; days++) {
            let calWeek = new Date().getWeekNumber(givenMonth, givenYear, diff);

            if (calWeek != s_calWeek) {
                cal += this.divo({ class: "calendar_row" })
                cal += this.divc({ class: "cal-row cal_kw", content: calWeek });
                s_calWeek = calWeek;
            }

            const ThisDate = new Date(givenYear, givenMonth, diff);
            const day = ThisDate.getDate()
            let row_class_add = ThisDate.getMonth() === currentMonth ? "cal-fut" : "cal-pas";
            if (isCurrentMonth && day === currentDay) row_class_add = 'cal-today'
            let mon = ThisDate.getMonth();
            mon++;
            const datereturn = `${ThisDate.getFullYear()}-${("0" + mon).slice(-2)}-${("0" + ThisDate.getDate()).slice(-2)}`
            cal += `<div class="cal-row cal-field _t '${row_class_add}" lbi="1" content_back="${datereturn}" title="${ThisDate}">${ThisDate.getDate()}</div>`
            count_weeks_days++;
            if (count_weeks_days === 7) {
                cal += this.end(1)
                count_weeks_days = 0;
            }
            diff++;
        }
        return cal
    }

    renderCalChange = (currentYear, currentMonth) => {
        this.calSelector.setAttribute('data-cmonth', currentMonth)
        this.calSelector.setAttribute('data-cyear', currentYear)
        this.calSelector.innerHTML = this.calTitle(currentYear, currentMonth)
        this.calSelectorBody.innerHTML = this.calcCalendar(currentYear, currentMonth, 0)
    }

    calTitle = (currentYear = today.getFullYear(), currentMonth = today.getMonth()) => {
        const currentDate = new Date(currentYear, currentMonth);
        const year = currentDate.getFullYear();
        const month = months['en'][currentDate.getMonth()]
        return `${month} ${year}`
    }

    execute() {
        try {
            const today = new Date();
            let currentMonth = today.getMonth();
            let currentYear = today.getFullYear();
            let currentDay = 0;
            this.data = this.divocol({ class: "dialog-output" })
            this.data += this.divorow({})
            this.data += this.divc({
                class: '_t cal-title',
                atrs: `_cal_selector data-cmonth="${currentMonth}" data-cyear="${currentYear}" data-cday="${currentDay}"`,
                content: this.calTitle()
            })
            this.data += this.divc({ class: "_mdl" })
            this.data += this.divorow({ atrs: '_cal_btn', style: 'width: max-content;' })
            this.data += this.end(2)
            this.data += this.divocol({ class: 'dropdown-body', atrs: '_cal_selector_body' })
            this.data += this.calcCalendar()
            this.data += this.end(2)
            this.render();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    prevCal = () => {
        const data = this.calSelector.dataset
        const cmonth = parseInt(data.cmonth)
        const cyear = parseInt(data.cyear)
        const currentYear = cmonth === 0 ? cyear - 1 : cyear;
        const currentMonth = cmonth === 0 ? 11 : cmonth - 1;
        this.renderCalChange(currentYear, currentMonth)
    }

    nextCal = () => {
        const data = this.calSelector.dataset
        const cmonth = parseInt(data.cmonth)
        const cyear = parseInt(data.cyear)
        const currentYear = cmonth === 11 ? cyear + 1 : cyear;
        const currentMonth = (cmonth + 1) % 12;
        this.renderCalChange(currentYear, currentMonth)
    }

    action = {
        next_cal: () => {
            const nextCalBtn = new InputButton({ classAdd: 'btn-prev-next', svg: "calNext" });
            this.calBtn.appendChild(nextCalBtn);
            nextCalBtn.addEventListener('click', () => this.nextCal())
        },
        prev_cal: () => {
            const prevCalBtn = new InputButton({ classAdd: 'btn-prev-next', svg: "calPrev" });
            this.calBtn.appendChild(prevCalBtn);
            prevCalBtn.addEventListener('click', () => this.prevCal())
        },
        year_month_select: () => {
            const ymButton = new InputButton({ classAdd: 'btn-prev-next', svg: "dropdownInput" });
            this.insertBetween(this.calSelector, ymButton, this.querySelector('._mdl'))
            ymButton.addEventListener('click', () => {
                const { width, top, left, height } = ymButton.getBoundingClientRect();
                const dropDown = new DropDown({ width, top, left, height, type: "year_month_select" })
                this.buildWindow(dropDown);
                const monthes = dropDown.querySelector(`[data-dropdown-month]`)
                const years = dropDown.querySelector(`[data-dropdown-year]`)
                const m_mess = monthes.getBoundingClientRect();
                years.style.maxHeight = `${m_mess.height - 10}px`
                years.scrollTop = years.scrollHeight;
                dropDown.querySelector(`[_dropdown_body]`).addEventListener('click', (e) => {
                    const content_back = e.target.getAttribute('content_back')
                    const content_type = e.target.getAttribute('type')
                    if (content_back !== '' && content_back !== null) {
                        let year = this.calSelector.getAttribute('data-cyear')
                        let month = this.calSelector.getAttribute('data-cmonth')
                        switch (true) {
                            case content_type === 'year':
                                year = content_back
                                break;
                            case content_type === 'month':
                                month = content_back
                                break;
                        }
                        this.renderCalChange(year, month)
                    }
                });
            })
        }
    }

    render() {
        this.innerHTML = this.divc({ class: "win-cal", atrs: this.selfIdent, content: this.windowCorpus })
        this.html({ tag: `[${this.bodyIdent}]`, content: this.data })
        this.calSelector = this.querySelector('[_cal_selector]')
        this.calBtn = this.querySelector('[_cal_btn]')
        this.calSelectorBody = this.querySelector(`[_cal_selector_body]`)
        this.action['year_month_select']()
        this.action['prev_cal']()
        this.action['next_cal']()
    }
}; customElements.define('custom-calendar', CALENDAR);