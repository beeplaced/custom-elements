const d = document
import { SVG } from './_svg.js'; const _svg = new SVG();
//import { Confirmation } from './_Confirmation.js'

const condBuilder = {
  like: (term) => { return { $regex: new RegExp(mainSearchEscape(term.toLowerCase()), 'im') } },
  $lt: (term) => { return { $lt: dateSelector[term] ? dateSelector[term]() : new Date() } },
  $gt: (term) => { return { $gt: dateSelector[term] ? dateSelector[term]() : new Date() } },
  $eq: (term) => { return { $eq: dateSelector[term] ? dateSelector[term]() : new Date() } }
}

const mainSearchEscape = term => term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

const validatedContent = {
  number: (val) => {
    return parseFloat(val.replace(/[="'<>]/g, '').trim())
  },
  def: (val) => {
    return val.replace(/[="'<>]/g, '').trim()
  }
}

const dateSelector = {
  tommorow: () => {
    const currentDate = new Date();
    const tomorrowDate = new Date(currentDate);
    tomorrowDate.setDate(currentDate.getDate() + 1);
    return tomorrowDate
  }
}

export class COMPONENTS extends HTMLElement {

  constructor() {
    super();
  }

  divc = d => { return `<div${d.class ? ` class="${d.class}"` : ''}${d.atrs ? ` ${d.atrs}` : ''}${d.title ? ` title="${d.title}"` : ''}${d.style ? ` style="${d.style}"` : ''}>${d.content ? d.content : ''}</div>` }
  divo = d => { return `<div${d.class ? ` class="${d.class}"` : ''}${d.atrs ? ` ${d.atrs}` : ''}${d.title ? ` title="${d.title}"` : ''}${d.style ? ` style="${d.style}"` : ''}>${d.content ? d.content : ''}` }
  divorow = d => { return `<div class="_f-b-r${d.class ? ` ${d.class}` : ''}"${d.atrs ? ` ${d.atrs}` : ''}${d.title ? ` title="${d.title}"` : ''}${d.style ? ` style="${d.style}"` : ''}>${d.content ? d.content : ''}` }
  divocol = d => { return `<div class="_f-b-c${d.class ? ` ${d.class}` : ''}"${d.atrs ? ` ${d.atrs}` : ''}${d.title ? ` title="${d.title}"` : ''}${d.style ? ` style="${d.style}"` : ''}>${d.content ? d.content : ''}` }
  divatrs = atrs => { return `<div ${atrs}></div>` }
  txtArea = d => {
    return `<textarea 
  class="${d.class}"${d.atrs ? d.atrs : ''} 
  style="${d.style}" : '' } 
  maxlength="${d.maxlength ? d.maxlength : 10}" 
  type="text" 
  placeholder="${d.placeholder ? d.placeholder : '...'}" 
  spellcheck="false"
  ${d.readonly ? ' readonly' : ''}
  >${d.value ? d.value : ''}</textarea>`
  }
  span = d => { return `<span ${d.class ? ` class="${d.class}"` : ''} ${d.atrs ? d.atrs : ''} ${d.title ? `title="${d.title}"` : ''} ${d.style ? `style="${d.style}"` : ''}>${d.content ? d.content : ''}</span>` }
  img = d => { return `<img ${d.class ? ` class="${d.class}"` : ''} ${d.atrs ? d.atrs : ''} ${d.title ? `title="${d.title}"` : ''} ${d.style ? `style="${d.style}"` : ''} alt="img" src="../images/${d.img}.svg">` }
  flag = d => { return `<img ${d.class ? ` class="${d.class}"` : ''} ${d.atrs ? d.atrs : ''} ${d.title ? `title="${d.title}"` : ''} ${d.style ? `style="${d.style}"` : ''} alt="flag" src="../flags/${d.img}.svg">` }
  input = d => {
    return `<input 
  ${d.class ? ` class="${d.class}"` : ''} 
  ${d.atrs ? d.atrs : ''} 
  maxlength="${d.maxlength ? d.maxlength : 10}" 
  type="${d.type ? d.type : 'text'}" 
  placeholder="${d.placeholder ? d.placeholder : '...'}" 
  spellcheck="false"
  autocomplete="${d.autocomplete ? d.autocomplete : 'off'}" 
  value="${d.value ? d.value : ''}"
  ${d.readonly ? ' readonly' : ''}>`
  }

  simpleInput = () => {
    return `<input class="simple-input" maxlength="25" type="text" placeholder="..." spellcheck="false"
  autocomplete="off" value="">`
  }

  end = (co) => {
    let e = ''
    for (let c = 1; c <= co; c++) { e += '</div>' }
    return e
  }

  html = ins => d.querySelector(ins.tag).innerHTML = ins.content

  selectorexists = tag => { if (d.querySelectorAll(tag).length === 0) return false; return true; }

  gatherAttributes() {
    const attributesObj = {};
    Array.from(this.attributes).forEach(attribute => {
      attributesObj[attribute.name] = attribute.value;
    });
    return attributesObj;
  }

  validatedContent({ type, val }) {
    return validatedContent[type]
      ? validatedContent[type](val)
      : validatedContent['def'](val)
  }

  fadeOutAndRemove(element) {
    element.classList.add('fadeOut')
    element.style.opacity = '0';
    setTimeout(function () {
      element.remove()
    }, 500);
  }

  feedback = (entry) => {
    const box = d.querySelector('.feedback');
    const { content, type } = entry;
    const feedbackInner = this.divc({ class: 'feedback-inner', content });

    // Convert the HTML string to a DOM element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = feedbackInner;
    const feedbackElement = tempDiv.firstChild;

    // Append the feedback to the box
    box.appendChild(feedbackElement);

    // Set a timeout to add a fade-out class and remove the feedback after 4 seconds
    setTimeout(() => {
      // Add a fade-out class
      feedbackElement.classList.add('fade-out');

      // Set another timeout to remove the feedback after the fade-out duration
      setTimeout(() => {
        // Remove the feedback
        feedbackElement.remove();
      }, 500); // Adjust the duration based on your CSS transition duration
    }, 4000);
  }

  floatTagExpand = (tags) => {
    const { title, vals } = tags
    let h = ''
    h += this.divorow({ class: 'tab-join-tag-float _t', atrs: `data-joinid=""` })
    let content = title
    if (vals.length > 0) content += `: ${vals.join(' | ')}`
    h += this.divc({ class: '_t', content })
    h += this.end(1)
    return h
  }

  linkDocs = (input) => {
    const { title, subtitle, _id, extension, thumbnail } = input

    let h = ''
    h += this.divorow({ class: `link-tag`, atrs: `data-joinid="${_id}"` })
    switch (true) {
      case thumbnail !== undefined:
        const contentType = thumbnail.contentType
        const thumbnailData = thumbnail.data;
        const base64String = thumbnailData;
        const thumbnailImg = `data:${contentType};base64,${base64String}`
        h += `<img class="thumbnail" src="${thumbnailImg}" alt="Thumbnail"></img>`
        break;
      case extension === ".jpeg" || extension === ".png":
        h += this.divc({ class: 'person-tag-circle', content: _svg.linkTab('image') })
        break;
      default:
        h += this.divc({ class: 'person-tag-circle', content: _svg.linkTab('doc') })
        break;
    }
    h += this.divocol({ class: 'link-wrapper' })
    h += this.divc({ class: '_t', content: title })
    if (subtitle) h += this.divc({ class: 'link-sub-txt _t', content: subtitle })
    h += this.end(2)
    return h
  }

  linkTag = (input) => {
    console.log(input)
    const { title, subtitle, _id, segment } = input

    let h = ''
    h += this.divorow({ class: `link-tag`, atrs: `data-joinid="${_id}"` })
    h += this.divc({ class: 'person-tag-circle', content: _svg.linkTab(segment) })
    h += this.divocol({ class: 'link-wrapper' })
    h += this.divc({ class: '_t', content: title })
    if (subtitle) h += this.divc({ class: 'link-sub-txt _t', content: subtitle })
    h += this.end(2)
    return h
  }

  btnWaves = (target, action = "overlay") => {
    const coords = target.getBoundingClientRect()
    let overlay = d.createElement('div');
    overlay.id = action;
    target.appendChild(overlay);
    /** @type {datarow} */ const divOverlay = d.querySelector(`#${action}`)
    if (!divOverlay) return
    divOverlay.style.maxWidth = `${coords.width}px`
    divOverlay.style.maxHeight = `${coords.height}px`
    setTimeout(function () {
      const overlay = d.querySelector(`#${action}`);
      if (overlay) {
        overlay.remove();
      }
    }, 100);
  }

  btnRipple = (e, target) => {
    const ripple = document.createElement("div");
    const rect = target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    ripple.style.left = offsetX - ripple.offsetWidth / 2 + "px";
    const rightSide = rect.width - offsetX;

    ripple.style.top = rect.top + "px";
    target.appendChild(ripple);
    const rippleSize = Math.min(rightSide, rect.height);
    ripple.classList.add("ripple-effect");
    ripple.style.width = ripple.style.height = rippleSize + "px";
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  queryBuilder = (params) => {
    const { fields, conditions, value } = params
    const pre = '$and'
    const matches = []
    fields.forEach((f, i) => {
      const term = condBuilder[conditions[i]](value[i])
      matches.push({ [f]: term })
    })
    const query = { [pre]: matches }
    console.log(query)
    return query
  }

  buildWindow = (content) => {
    this.cleanDropdown()
    const _window = d.querySelector('[dropdown]');
    _window.appendChild(content)
  }

  insertBetween = (div1, content, div2) => {
    div1.parentElement.insertBefore(content, div2);
  }

  cleanDropdown = () => {
    const dropdowns = d.querySelector('[dropdown]')
    dropdowns.innerHTML = ''
  }

  toggleTableRow = (row, selected) => {
    const radioBox = row.querySelector('._radio-box')
    const target = row?.parentNode?.parentNode

    switch (true) {
      case selected === 1:
        row.selected = 0
        radioBox.classList.remove('rdo-selected')
        row.setAttribute('selected', 0);
        if (target?.tagName === 'TR') target.classList.remove('selected')
        break;
      default:
        radioBox.classList.add('rdo-selected')
        row.selected = 1
        row.setAttribute('selected', 1);
        if (target?.tagName === 'TR') target.classList.add('selected')
        break;
    }
  }
}

export class EditableFields extends COMPONENTS {
  constructor() {
    super();
  }

  connectedCallback() {
    const html = this.buildInput()
    this.render(html);
  }

  buildInput = () => {
    let html = this.divorow({ class: 'input-head' })
    html += this.end(1)
    html += this.divorow({ class: 'form-row-wrapper' })
    html += this.inner()
    html += this.end(1)
    return html
  }

  inputHeadRaw = () => {
    return this.divc({ class: `ext-input-w-title`, content: this.title || '...' })
  }

  inputHeadEditable = () => {//also used in documents, build via class later
    let h = this.divc({ class: 'input-head-edit', style: 'padding: 5px', atrs: 'move-field' })
    h += this.divorow({ class: 'input-head-edit move' })
    const content = this.grabTitle()
    h += this.input({
      type: 'text',
      class: 'input-head-input',
      autocomplete: false,
      maxlength: '50',
      placeholder: 'rename field',
      value: content
    })
    h += this.divc({ class: 'rename-field', style: 'padding: 5px', content: 'rename' })
    h += this.end(1)
    h += this.divc({ class: 'rename-check' })
    h += this.divc({ class: 'input-head-edit', style: 'padding: 5px', atrs: 'remove-field', title: 'remove element' })
    return h
  }

  useEditable = () => {
    this.highlight = this.querySelector('.input-head-edit.move')
    const renameCheckField = this.querySelector('.rename-check')
    const moveBtn = document.createRange().createContextualFragment(_svg.dragHorizontal());
    const moveField = this.querySelector('[move-field]')
    moveField.appendChild(moveBtn)
    const renameCheck = document.createRange().createContextualFragment(_svg.inputSave());
    const trashSmallBtn = document.createRange().createContextualFragment(_svg.trashSmall());
    this.renameInput = this.querySelector('.input-head-input')
    const removeField = this.querySelector('[remove-field]')

    removeField.appendChild(trashSmallBtn)
    renameCheckField.appendChild(renameCheck)
    this.drawer = renameCheckField.querySelector('.c-i-svg-cxxx')
    this.classList.add('form-input-editable')
    this.querySelector('[remove-field]').addEventListener('click', () => {
      this.feedback({ content: `field "${this.title}" removed` })
      this.fadeOutAndRemove(this)
    })
    this.querySelector('.rename-field').addEventListener('click', (e) => {
      const val = this.validatedContent({ type: 'def', val: this.renameInput.value })
      if (val === '') {
        new Confirmation({ x: e.clientX, y: e.clientY, title: `please add a title`, highlight: this.highlight })
        return
      }
      this.feedback({ content: `field "${this.title}" renamed to "${val}"` })
      this.title = val
      const drawer = this.drawer
      drawer.classList.add('draw-input-btn')
      setTimeout(() => {
        drawer.classList.remove('draw-input-btn')
      }, 400);
    })
  }

}