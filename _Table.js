import { COMPONENTS } from './_Base.js';
import { Button } from './_Button.js';
// import { DropDown } from './_Dropdown.js';
// import { CALENDAR } from './_Calendar.js';
import { SVG } from './_svg.js'; const __svg = new SVG();
// import { Radio } from './_Radio.js'
import API from '../_api.js';
const _api = new API()
const d = document;
import Sortable from 'https://cdn.jsdelivr.net/npm/@shopify/draggable/build/esm/Sortable/Sortable.mjs';
const docSvg = __svg.linkOrga('documents')

export class Table extends COMPONENTS {

  static instanceCount = 0;

  constructor(params) {
    super();
    this.init = true
    console.log(params)
    this.ident = `_t_${Table.instanceCount++}`;
    const { segment, dragnDrop } = params
    this.segment = segment || 'default'
    this.searchterm = {}
    this.dragnDrop = dragnDrop
    // this.header = params.header
    // this.tableData = params.data
    // this.pagination = params.pagination
    this.maxPages = 5
    this.currentPage = 1
    this.maxShow = 5
    this.trClass = ""//'odd_even'
    this.sortMeta = {
      _id: -1
    }
    this.chart_sum = []
    // this.tabletypes = {
    //   calc: () => {
    //     console.log((typeof parseFloat(this.input)))
    //     if (typeof parseFloat(this.input) === 'number'){
    //     this.sum = this.sum + parseFloat(this.input)
    //     }
    //   },
    //   chart_sum: () => {
    //     this.input = this.sum
    //     this.sum = 0
    //   }
    // }
    this.tablefields = {
      def: () => this.divc({ class: 'tbl-txt _t', content: this.input }),
      input: () => `<input class="tbl" data-input="${field}" type="text" value="${input}" spellcheck="false">`,
      _folder: () => docSvg,
      _rdo: () => {
        return `<custom-radio ident="${this.ident}" selected="0"></custom-radio>`
      },
      _thumbnail: () => {
        if (!this.input) return ''
        return `<img class="thumbnail" src="${this.input}" alt="Thumbnail"></img>`
      },
    }

    // this.header = [
    //   { title: '_rdo' },
    //   { title: 'userId' },
    //   { title: 'title' },
    //   { title: 'context' },
    //   { title: 'completed' },
    //   { title: 'what else' },
    //   { title: 'nothing more' }
    // ]
    // this.tableData = [
    //   { 'userId': 1, title: 'title', 'context': 'something else', 'completed': true, 'what else': 'nothing', 'nothing more': 'no' },
    //   { 'userId': 2, title: 'title', 'context2': 'something else', 'completed': false, 'what else': 'nothing', 'nothing more': 'no' },
    //   { 'userId': 3, title: 'title', 'context3': 'something else', 'completed': true, 'what else': 'nothing', 'nothing more': 'no' },
    //   { 'userId': 4, title: 'new title', 'context': 'new something else', 'completed': true, 'what else': 'another thing', 'nothing more': 'yes' },
    //   { 'userId': 5, title: 'different title', 'context': 'different something else', 'completed': false, 'what else': 'something different', 'nothing more': 'no' },
    //   { 'userId': 6, title: 'unique title', 'context': 'unique something else', 'completed': true, 'what else': 'something unique', 'nothing more': 'yes' },
    //   { 'userId': 7, title: 'new title', 'context': 'new something else', 'completed': true, 'what else': 'another thing', 'nothing more': 'yes' },
    //   { 'userId': 8, title: 'different title', 'context': 'different something else', 'completed': false, 'what else': 'something different', 'nothing more': 'no' },
    //   { 'userId': 9, title: 'unique title', 'context': 'unique something else', 'completed': true, 'what else': 'something unique', 'nothing more': 'yes' },
    //   { 'userId': 1, title: 'title', 'context': 'something else', 'completed': true, 'what else': 'nothing', 'nothing more': 'no' },
    //   { 'userId': 2, title: 'title', 'context2': 'something else', 'completed': false, 'what else': 'nothing', 'nothing more': 'no' },
    //   { 'userId': 3, title: 'title', 'context3': 'something else', 'completed': true, 'what else': 'nothing', 'nothing more': 'no' },
    //   { 'userId': 4, title: 'new title', 'context': 'new something else', 'completed': true, 'what else': 'another thing', 'nothing more': 'yes' },
    //   { 'userId': 5, title: 'different title', 'context': 'different something else', 'completed': false, 'what else': 'something different', 'nothing more': 'no' },
    //   { 'userId': 6, title: 'unique title', 'context': 'unique something else', 'completed': true, 'what else': 'something unique', 'nothing more': 'yes' },
    //   { 'userId': 7, title: 'new title', 'context': 'new something else', 'completed': true, 'what else': 'another thing', 'nothing more': 'yes' },
    //   { 'userId': 8, title: 'different title', 'context': 'different something else', 'completed': false, 'what else': 'something different', 'nothing more': 'no' },
    //   { 'userId': 9, title: 'unique title', 'context': 'unique something else', 'completed': true, 'what else': 'something unique', 'nothing more': 'yes' },
    //   { 'userId': 9, title: 'unique title', 'context': 'unique something else', 'completed': true, 'what else': 'something unique', 'nothing more': 'yes' },
    //   { 'userId': 1, title: 'title', 'context': 'something else', 'completed': true, 'what else': 'nothing', 'nothing more': 'no' },
    //   { 'userId': 2, title: 'title', 'context2': 'something else', 'completed': false, 'what else': 'nothing', 'nothing more': 'no' },
    //   { 'userId': 3, title: 'title', 'context3': 'something else', 'completed': true, 'what else': 'nothing', 'nothing more': 'no' },
    //   { 'userId': 4, title: 'new title', 'context': 'new something else', 'completed': true, 'what else': 'another thing', 'nothing more': 'yes' },
    //   { 'userId': 5, title: 'different title', 'context': 'different something else', 'completed': false, 'what else': 'something different', 'nothing more': 'no' },
    //   { 'userId': 6, title: 'unique title', 'context': 'unique something else', 'completed': true, 'what else': 'something unique', 'nothing more': 'yes' },
    //   { 'userId': 7, title: 'new title', 'context': 'new something else', 'completed': true, 'what else': 'another thing', 'nothing more': 'yes' },
    //   { 'userId': 8, title: 'different title', 'context': 'different something else', 'completed': false, 'what else': 'something different', 'nothing more': 'no' },
    //   { 'userId': 9, title: 'unique title', 'context': 'unique something else', 'completed': true, 'what else': 'something unique', 'nothing more': 'yes' }

    // ]
  }

  params = (params) => {
    const { segment } = params
    this.segment = segment
  }

  connectedCallback() {
    // console.log('connectedCallback Table')
  }

  async loadData() {
    const res = await _api.CALL({
      api: 'datatable', body: JSON.stringify({
        searchterm: this.searchterm,
        segment: this.segment,
        sortterm: this.sortMeta,
        page: this.currentPage
      })
    })
    this.buildTable(res)
  }

  dragAndDrop = (segment) => {

    const table = true

    // const sortable = new Sortable(this.querySelector(segment), {
    //   draggable: '.draggable',
    //   mirror: {
    //     appendTo: segment,
    //     constrainDimensions: true,
    //   },
    // });

    const sortable = new Sortable(this.querySelector('thead tr'), {
      draggable: 'th',
      mirror: {
        appendTo: 'body',
        constrainDimensions: true,
      }
    });

    sortable.on('drag:start', (evt) => {
      const { width } = evt.data.source.getBoundingClientRect()
      const draggedItem = evt.data.source
      if (!table) draggedItem.style.width = `${width}px`
      draggedItem.classList.add('dnd-dragged');
    });

    sortable.on('drag:stop', (evt) => {
      const draggedItem = evt.data.source
      draggedItem.classList.add('slider-box-flicker')
      setTimeout(() => {
        draggedItem.classList.remove('slider-box-flicker')
        draggedItem.classList.remove('dnd-dragged');
        if (table) {
          this.reBuildTable()
        }
      }, 200);
    });
  }

  reBuildTable = () => {
    const order = []
    this.querySelectorAll('._chead').forEach(t => {
      order.push(t.dataset.title)
    })
    this.header = order.map(a => {
      return this.header.find(h => h.title === a)
    })
    this.data = this.tableHead()
    this.data += this.tableBody()
    this.render();
  }

  buildTable = (res) => {
    this.header = res.header
    this.tableData = res.data
    this.meta = res.meta
    this.sort = res.meta.sort
    this.sortby = res.meta.sortby
    this.data = this.tableHead()
    this.data += this.tableBody()
    this.render();
  }

  tablePagination = () => {
    const { rows, minResult, maxResults, maxPages, currentPage } = this.meta
    this.maxPages = maxPages
    this.currentPage = currentPage
    let h = this.divorow({ class: 'pagination-wrapper' })
    h += this.divc({ content: `<strong>${minResult} - ${rows}</strong> of ${maxResults} results`, style: 'white-space: nowrap;' })
    h += this.divc({ class: '_mdl' })
    h += this.divc({ class: 'pagination-button', atrs: `pag_buttons data-max-page="${maxPages}" data-current-page="${currentPage}"` })
    h += this.end(1)
    return h
  }

  usePagination = () => {
    if (this.maxPages <= 1) return
    this.paginationButtons = this.querySelector(`[pag_buttons]`);
    const prevButton = new Button({ title: "previous", type: "pagination_number", addclass: "btn-pag-pn" })
    this.paginationButtons.appendChild(prevButton);

    let page = this.currentPage === 1 ? this.currentPage : this.currentPage - 1
    let first = false
    if (page > 1) first = true
    if (first) {
      this.paginationButtons.appendChild(new Button({ title: 1, type: "pagination_number", addclass: "btn-pagination" }))
      this.paginationButtons.appendChild(new Button({ title: '···', type: "pagination_number", addclass: "btn-pagination-dot" }))
    }
    let last = true
    for (let i = 0; i < this.maxShow; i++) {
      if (page > this.maxPages) {
        last = false;
        continue
      }
      const addClass = page === this.currentPage ? ' active' : ''
      this.paginationButtons.appendChild(new Button({ title: page, type: "pagination_number", addclass: `btn-pagination${addClass}` }));
      page++;
    }
    if (last) {
      this.paginationButtons.appendChild(new Button({ title: '···', type: "pagination_number", addclass: "btn-pagination-dot" }))
      this.paginationButtons.appendChild(new Button({ title: this.maxPages, type: "pagination_number", addclass: "btn-pagination" }))
      this.paginationButtons.appendChild(new Button({ title: "next", type: "pagination_number", addclass: "btn-pag-pn" }));
    }

    this.paginationButtons.addEventListener('click', e => {
      const { maxPage, currentPage } = this.paginationButtons.dataset
      const { page } = e.target.dataset
      const maxPageP = parseInt(maxPage)
      const currentPageP = this.currentPage
      let setPage = ''
      switch (true) {
        case page === 'next':
          if (maxPageP > currentPageP) {
            setPage = currentPageP + 1
          }
          break;
        case page === 'previous':
          if (currentPageP >= 1) {
            setPage = currentPageP - 1
          }
          break;
        case page === 'last':
          setPage = this.maxPages
          this.paginationButtons
            .querySelectorAll('.__b, .btn-pagination, .hide')
            .forEach(h => h.classList.remove('hide'))
          break;
        default:
          setPage = parseInt(page)
          break;
      }
      if (setPage === '' || setPage === 0) return
      const currentButton = this.querySelector(`[data-page="${currentPage}"]`);
      currentButton.classList.remove('active');
      const setPageButton = this.querySelector(`[data-page="${setPage}"]`);
      if (setPageButton) setPageButton.classList.add('active');
      this.paginationButtons.setAttribute('data-current-page', setPage);
      this.currentPage = setPage
      this.loadData().then(() => {
        this.paginationClick()
      })
    })
  }

  tableSort = () => {
    const direction = this.sortby === -1 ? 'up' : 'down'
    return __svg.sortArrow(direction)
  }

  tableHead = () => {
    //const { sort, order, fields } = data
    //const { fields } = data
    let h = `<table><thead><tr>`
    //const fields = __cache.readTableFields()
    let colspan = false
    this.header.map(({ title, meta }) => {
      const ident = title.toLowerCase()
      let content = title
      let thClassAdd = ''
      switch (true) {
        case title === '_rdo':
          h += `<th class="rdo"><div class="_rdo_selall"></div></th>`
          break;
        default:
          h += `<th>`
          h += this.divorow({ class: '_chead', atrs: `data-title="${title}"` })
          if (title === this.sort) h += this.tableSort()
          h += this.divc({ class: '_t', content })
          h += this.end(1)
          h += '</th>'
          break;
      }
      //   const sort = 'remark'
      //   const order = 1
      //   switch (colspan) {
      //     case true:
      //       colspan = 'next'
      //       break;
      //     case 'next':
      //       h += `colspan="2" class="b-l" style="padding-left: 10px">`
      //       colspan = false
      //       break;
      //     default:
      //       h += `class="b-l" ${this.ident}_${ident} >`
      //       colspan = false
      //       break;
      //   }

      //   h += this.divorow({ class: '_no_click _chead _t' })
      //   if (title === sort) {
      //     const arrow = order === -1 ? 'up' : 'down'
      //     // settings.headsort = __svg.sortArrow(direction)
      //     // settings.atrs = `data-tab_head="${title}" data-tab_sort="${order}"`
      //     //   h += __svg.sort(arrow)
      //   }
      //   h += this.divc({ class: '_no_click _t', content })
      //   //if (title === sort) h += __h.unit({ unit: '€' })
      //   h += this.end(1)
      //   h += '</th>'
    })
    h += `</tr></thead>`
    return h
  }

  tableBody = () => {
    let h = ``
    this.tableData.map((col, i) => {
      //ROW
      //tr-read-only
      let addClass = (i === 0) ? ' active' : ''
      h += `<tr class="${this.trClass}${addClass}" data-ident="${i}">`
      h += this.outputTablefields({ col, i }) //FIELDS
      h += `</tr>`
    })
    h += `</table>`
    return h
  }

  outputTablefields = ({ col, i }) => {
    //this.chart_sum.push({ sum: parseFloat(col.sum.toFixed(2)), date: col.date })
    if (!col) return
    this.ident = i
    let h = ''
    this.header.map(({ title, type, meta }) => {
      this.input = ''
      this.field = title
      const headline = false
      let tdClass = ''
      let tdStyle = ''
      switch (true) {
        case title === '_thumbnail':
          if ('thumbnail' in col) {
            this.contentType = col.thumbnail.contentType
            const thumbnailData = col.thumbnail.data;
            const base64String = thumbnailData;
            this.input = `data:${this.contentType};base64,${base64String}`;
          }
          break;
        case meta?.type === 'folder':
          this.field = '_folder'
          break;
        default:
          this.input = col[title]
          if (type) this.tabletypes[type] ? this.tabletypes[type]() : ''
          break;
      }
      let atrs = ''
      h += `<td ${tdClass ? tdClass : ''} ${atrs ? atrs : ''} ${tdStyle ? tdStyle : ''}>`
      h += this.tablefields[this.field] 
      ? this.tablefields[this.field]() 
      : this.tablefields['def']()
      h += `</td>`
    })
    return h
  }

  selectAll = () => {
    //off for list - this.querySelector(`._rdo_selall`).appendChild(new Radio({ selectall: true }))
  }

  // #Do After render on click - change in extended class
  rowClick = (ident) => {
    console.log(`ROW ${ident} CLICKED`)
  }

  listRowClick = (ident) => {
    console.log(`ROW ${ident} CLICKED`)
  }

  listBtnClick = () => {
    console.log(`Bnt CLICKED`)
  }

  headClick = () => {
    console.log('HEAD CLICKED')
  }

  paginationClick = () => {
    console.log('PAGINATION CLICKED')
  }

  tableClick = () => {
    this.addEventListener('click', (e) => {
      let target = e.target
      switch (true) {
        case target.tagName === 'TD' && target.parentNode.tagName === 'TR':
          target = target.parentNode
          const activeRow = this.querySelector('tr.active');
          activeRow.classList.remove('active')
          target.classList.add('active')
          const ident = target.dataset.ident
          this.rowClick(ident)
          // if (this.postRender) {
          //   this.postRender.map(fn => {
          //     this[fn](ident)
          //   })
          // }
          break;
        case target.tagName === 'DIV' && target.parentNode.tagName === 'TH':
          const dataset = target.dataset
          if (dataset.title) {
            let sortby = 1
            const title = dataset.title
            if (title === this.sort) sortby = this.sortby === 1 ? -1 : 1
            this.sortMeta = { [title]: sortby }
            this.loadData().then(() => {
              this.headClick()
              // if (this.postRender) {
              //   console.log('re')
              //   this.postRender.map(fn => {
              //     this[fn]()
              //   })
              // }
            })
          }
          break;
        case e.target.tagName === 'CUSTOM-RADIO':
          if (target.getAttribute('selectall')) {
            const self = parseInt(target.getAttribute('selected'))
            const customElements = this.querySelectorAll('custom-radio')
            customElements.forEach(row => {
              this.toggleTableRow(row, self)
            });
          }
          break;
        case target.tagName === 'DIV' && target.classList.contains('list-row'):
          this.listRowClick(target.dataset.ident)
          break;
        case target.tagName === 'DIV' && target.classList.contains('list-btn'):
          this.listBtnClick()
          break;
        default:
          console.log('Nothing important CLICKED', target.tagName, target.parentNode.tagName, target.classList)
          break;
      }
    })
  }

  adjustBottom = () => {
    const { top } = this.getBoundingClientRect()
    var screenHeight = window.innerHeight || document.documentElement.clientHeight;
    // console.log('top', top)
    // console.log('screenHeight', screenHeight)
    const { height } = this.pagination_wrapper.getBoundingClientRect()
    const calculatedMaxHeight = parseInt(screenHeight - top - height).toFixed(1);
    // console.log('height', height)
    // console.log('calculatedMaxHeight', calculatedMaxHeight)
    this.box.style.maxHeight = `${calculatedMaxHeight}px`
    this.box.style.height = `${calculatedMaxHeight}px`;
  }

  render() {
    let build = this.divocol({ class: 'table-box' })
    build += this.data
    build += this.end(1)
    build += this.tablePagination()
    this.innerHTML = build
    this.pagination_wrapper = this.querySelector('.pagination-wrapper')
    this.box = this.querySelector('.table-box')
    this.usePagination()
    if (this.init) { //only trigger at the start
      this.tableClick()
      this.selectAll()
    }
    this.init = false
    this.adjustBottom()
    if (this.dragnDrop) this.dragAndDrop()
  }
}; customElements.define('base-table', Table);