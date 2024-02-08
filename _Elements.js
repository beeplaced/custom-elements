const d = document

const condBuilder = {
  like: (term) => { return { $regex: new RegExp(mainSearchEscape(term.toLowerCase()), 'im') } },
  $lt: (term) => { return { $lt: dateSelector[term] ? dateSelector[term]() : new Date() } },
  $gt: (term) => { return { $gt: dateSelector[term] ? dateSelector[term]() : new Date() } },
  $eq: (term) => { return { $eq: dateSelector[term] ? dateSelector[term]() : new Date() } }
}

const mainSearchEscape = term => term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

const dateSelector = {
  tommorow: () => {
    const currentDate = new Date();
    const tomorrowDate = new Date(currentDate);
    tomorrowDate.setDate(currentDate.getDate() + 1);
    return tomorrowDate
  }
}

export class COMPONENTS extends HTMLElement {

  divc = d => { return `<div${d.class ? ` class="${d.class}"` : ''}${d.atrs ? ` ${d.atrs}` : ''}${d.title ? ` title="${d.title}"` : ''}${d.style ? ` style="${d.style}"` : ''}>${d.content ? d.content : ''}</div>` }
  divo = d => { return `<div${d.class ? ` class="${d.class}"` : ''}${d.atrs ? ` ${d.atrs}` : ''}${d.title ? ` title="${d.title}"` : ''}${d.style ? ` style="${d.style}"` : ''}>${d.content ? d.content : ''}` }
  divorow = d => { return `<div class="_f-b-r${d.class ? ` ${d.class}` : ''}"${d.atrs ? ` ${d.atrs}` : ''}${d.title ? ` title="${d.title}"` : ''}${d.style ? ` style="${d.style}"` : ''}>${d.content ? d.content : ''}` }
  divocol = d => { return `<div class="_f-b-c${d.class ? ` ${d.class}` : ''}"${d.atrs ? ` ${d.atrs}` : ''}${d.title ? ` title="${d.title}"` : ''}${d.style ? ` style="${d.style}"` : ''}>${d.content ? d.content : ''}` }
  divatrs = atrs => { return `<div ${atrs}></div>` }
  txtArea = d => { return `<textarea class="${d.class}"${d.atrs ? d.atrs : ''} style="${d.style}" : '' } maxlength="${d.maxlength ? d.maxlength : 10}" type="text" placeholder="${d.placeholder ? d.placeholder : '...'}" spellcheck="false">${d.value ? d.value : ''}</textarea>` }
  span = d => { return `<span ${d.class ? ` class="${d.class}"` : ''} ${d.atrs ? d.atrs : ''} ${d.title ? `title="${d.title}"` : ''} ${d.style ? `style="${d.style}"` : ''}>${d.content ? d.content : ''}</span>` }
  img = d => { return `<img ${d.class ? ` class="${d.class}"` : ''} ${d.atrs ? d.atrs : ''} ${d.title ? `title="${d.title}"` : ''} ${d.style ? `style="${d.style}"` : ''} alt="img" src="../images/${d.img}.svg">` }
  flag = d => { return `<img ${d.class ? ` class="${d.class}"` : ''} ${d.atrs ? d.atrs : ''} ${d.title ? `title="${d.title}"` : ''} ${d.style ? `style="${d.style}"` : ''} alt="flag" src="../flags/${d.img}.svg">` }
  input = d => { return `<input ${d.class ? ` class="${d.class}"` : ''} ${d.atrs ? d.atrs : ''} maxlength="${d.maxlength ? d.maxlength : 10}" type="text" placeholder="${d.placeholder ? d.placeholder : '...'}" spellcheck="false" value="${d.value ? d.value : ''}"${d.readonly ? ' readonly' : ''}>` }
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

  btnWaves = (target) => {
    const coords = target.getBoundingClientRect()
    let overlay = d.createElement('div');
    overlay.id = 'overlay';
    target.appendChild(overlay);
    /** @type {datarow} */ const divOverlay = d.querySelector('#overlay')
    if (!divOverlay) return
    divOverlay.style.maxWidth = `${coords.width}px`
    divOverlay.style.maxHeight = `${coords.height}px`
    setTimeout(function () {
      const overlay = d.querySelector('#overlay');
      if (overlay) {
        overlay.remove();
      }
    }, 100);
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
    const _window = d.querySelector('[__window]');
    _window.appendChild(content)
  }

  insertBetween = (div1, content, div2) => {
   div1.parentElement.insertBefore(content, div2);
  }

}