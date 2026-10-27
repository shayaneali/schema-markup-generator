/* Schema Markup Generator: vanilla JS, no dependencies. Runs entirely in the browser. */
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const CTX = 'https://schema.org';
const S = 'https://schema.org/';
const num = x => (x === '' || x == null || isNaN(+x)) ? x : +x;
const F = (id, label, level, o = {}) => ({ id, label, level, type: 'text', ...o });

// Inline icons (24x24, stroke-based) for the type buttons.
const ICON = {
  store: '<path d="M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9h16M9 20v-6h6v6"/>',
  article: '<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7"/>',
  product: '<path d="M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7M12 11v10"/>',
  faq: '<path d="M4 5h16v11H10l-5 4v-4H4zM9.5 9.5a2.5 2.5 0 115 0c0 1.5-2.5 2-2.5 3.5M12 14.5v.01"/>'
};

/* Each schema: form fields (level: req = required, rec = recommended, opt = optional)
   plus build(values) that returns the JSON-LD object. Empty values are stripped by clean(). */
const SCHEMAS = {
  LocalBusiness: { label: 'Local business', icon: 'store', fields: [
    F('bizType', 'Business type', 'opt', { type: 'select', options: [['LocalBusiness','Local business'],['Restaurant','Restaurant'],['Store','Store'],['Dentist','Dentist'],['HealthClub','Gym'],['HairSalon','Hair salon'],['AutoRepair','Auto repair']] }),
    F('name', 'Business name', 'req', { ph: 'Sunrise Bakery' }),
    F('url', 'Website', 'rec', { type: 'url', ph: 'https://example.com' }),
    F('image', 'Image URL', 'rec', { type: 'url', ph: 'https://example.com/shop.jpg' }),
    F('telephone', 'Phone', 'rec', { type: 'tel', ph: '+92 300 1234567' }),
    F('priceRange', 'Price range', 'opt', { ph: '$$' }),
    F('street', 'Street address', 'rec', { ph: '12 Main Boulevard', full: 1 }),
    F('city', 'City', 'rec', { ph: 'Lahore' }),
    F('region', 'Region', 'opt', { ph: 'Punjab' }),
    F('zip', 'Postal code', 'opt', { ph: '54000' }),
    F('country', 'Country code', 'rec', { ph: 'PK' }),
    F('hours', 'Opening hours', 'opt', { ph: 'Mo-Sa 09:00-18:00', full: 1, hint: 'Format: Mo-Fr 09:00-17:00. Separate several ranges with a comma.' })
  ], build: v => ({ '@context': CTX, '@type': v.bizType || 'LocalBusiness', name: v.name, image: v.image, url: v.url, telephone: v.telephone, priceRange: v.priceRange,
      address: { '@type': 'PostalAddress', streetAddress: v.street, addressLocality: v.city, addressRegion: v.region, postalCode: v.zip, addressCountry: v.country },
      openingHours: v.hours }) },

  Article: { label: 'Article', icon: 'article', fields: [
    F('kind', 'Article type', 'opt', { type: 'select', options: [['Article','Article'],['BlogPosting','Blog post'],['NewsArticle','News article']] }),
    F('headline', 'Headline', 'req', { full: 1, max: 110, ph: 'How to add schema markup to any website' }),
    F('description', 'Summary', 'rec', { type: 'textarea', full: 1 }),
    F('url', 'Article URL', 'rec', { type: 'url', ph: 'https://example.com/blog/post' }),
    F('image', 'Image URL', 'rec', { type: 'url', ph: 'https://example.com/cover.jpg' }),
    F('authorName', 'Author name', 'rec', { ph: 'Shayan E Ali' }),
    F('authorUrl', 'Author page', 'opt', { type: 'url' }),
    F('datePublished', 'Date published', 'rec', { type: 'date' }),
    F('dateModified', 'Date modified', 'opt', { type: 'date' }),
    F('publisher', 'Publisher name', 'opt'),
    F('publisherLogo', 'Publisher logo URL', 'opt', { type: 'url' })
  ], build: v => ({ '@context': CTX, '@type': v.kind || 'Article', headline: v.headline, description: v.description, image: v.image,
      datePublished: v.datePublished, dateModified: v.dateModified,
      author: { '@type': 'Person', name: v.authorName, url: v.authorUrl },
      publisher: { '@type': 'Organization', name: v.publisher, logo: { '@type': 'ImageObject', url: v.publisherLogo } },
      mainEntityOfPage: v.url ? { '@type': 'WebPage', '@id': v.url } : undefined }) },

  Product: { label: 'Product', icon: 'product', fields: [
    F('name', 'Product name', 'req', { full: 1, ph: 'Cold-brew coffee, 500 ml' }),
    F('image', 'Image URL', 'req', { type: 'url', ph: 'https://example.com/product.jpg' }),
    F('url', 'Product page', 'rec', { type: 'url' }),
    F('description', 'Description', 'rec', { type: 'textarea', full: 1 }),
    F('sku', 'SKU', 'opt'),
    F('brand', 'Brand', 'rec'),
    F('price', 'Price', 'req', { type: 'number', ph: '24.99' }),
    F('currency', 'Currency code', 'req', { ph: 'USD' }),
    F('availability', 'Availability', 'rec', { type: 'select', options: [[S + 'InStock','In stock'],[S + 'OutOfStock','Out of stock'],[S + 'PreOrder','Pre-order']] }),
    F('rating', 'Rating (0 to 5)', 'opt', { type: 'number', ph: '4.6' }),
    F('reviews', 'Review count', 'opt', { type: 'number', ph: '128' })
  ], build: v => ({ '@context': CTX, '@type': 'Product', name: v.name, image: v.image, description: v.description, sku: v.sku,
      brand: { '@type': 'Brand', name: v.brand },
      offers: v.price ? { '@type': 'Offer', price: num(v.price), priceCurrency: v.currency, availability: v.availability, url: v.url } : undefined,
      aggregateRating: v.rating ? { '@type': 'AggregateRating', ratingValue: num(v.rating), reviewCount: num(v.reviews) } : undefined }) },

  FAQ: { label: 'FAQ page', icon: 'faq', faq: true, fields: [],
    build: v => ({ '@context': CTX, '@type': 'FAQPage',
      mainEntity: v.faq.filter(x => x.q.trim() && x.a.trim()).map(x => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } })) }) }
};

/* ---------- Helpers ---------- */
// Remove empty values (and objects that only hold an @type) so the output stays tidy.
function clean(o) {
  if (Array.isArray(o)) { const a = o.map(clean).filter(x => x !== undefined); return a.length ? a : undefined; }
  if (o && typeof o === 'object') {
    const r = {}; for (const k in o) { const c = clean(o[k]); if (c !== undefined) r[k] = c; }
    return Object.keys(r).some(k => k !== '@type') ? r : undefined;
  }
  return (o === '' || o == null) ? undefined : (typeof o === 'string' ? o.trim() : o);
}
const V = { url: s => { try { return /^https?:$/.test(new URL(s).protocol); } catch { return false; } },
  tel: s => /^\+?[\d\s().-]{7,}$/.test(s), number: s => isFinite(+s) && +s >= 0, date: s => /^\d{4}-\d{2}-\d{2}$/.test(s) };
const MSG = { url: 'Enter a full URL starting with https://', tel: 'Use digits, spaces and + only (7 digits or more)', number: 'Enter a number such as 24.99', date: 'Pick a valid date' };
const fmt = (f, val) => (val && V[f.type] && !V[f.type](val.trim())) ? MSG[f.type] : '';

// Score = share of required + recommended checks that pass. Errors come first in the list.
function check(s, v) {
  const issues = []; let total = 0, ok = 0;
  if (s.faq) {
    total = v.faq.length;
    v.faq.forEach((it, i) => { if (it.q.trim() && it.a.trim()) ok++; else issues.push({ l: 'error', m: `Question ${i + 1} needs both a question and an answer` }); });
  } else s.fields.forEach(f => {
    const val = (v[f.id] || '').trim(), bad = fmt(f, val), req = f.level === 'req';
    if (f.level !== 'opt') {
      total++;
      if (!val) issues.push({ l: req ? 'error' : 'warn', m: `${f.label} is ${req ? 'required' : 'recommended'}` });
      else if (bad) issues.push({ l: 'error', m: `${f.label}: ${bad}` });
      else ok++;
    } else if (bad) issues.push({ l: 'error', m: `${f.label}: ${bad}` });
    if (f.max && val.length > f.max) issues.push({ l: 'warn', m: `${f.label} is ${val.length} characters; Google may cut it after ${f.max}` });
  });
  issues.sort((a, b) => (a.l === 'error' ? 0 : 1) - (b.l === 'error' ? 0 : 1));
  return { issues, score: total ? Math.round(ok / total * 100) : 0 };
}

/* ---------- State ---------- */
function fresh() {
  const d = {};
  for (const k in SCHEMAS) {
    d[k] = {}; SCHEMAS[k].fields.forEach(f => { if (f.type === 'select') d[k][f.id] = f.options[0][0]; });
    if (SCHEMAS[k].faq) d[k].faq = [{ q: '', a: '' }];
  }
  return d;
}
const state = { type: 'LocalBusiness', data: fresh() };
try { // restore the last session (browser storage can be unavailable, so this is optional)
  const saved = JSON.parse(localStorage.getItem('sg1'));
  if (saved && SCHEMAS[saved.type]) { state.type = saved.type; state.data = { ...state.data, ...saved.data }; }
} catch {}

/* ---------- Rendering: form ---------- */
function fieldHTML(f, val) {
  const id = 'f-' + f.id, lvl = { req: 'required', rec: 'recommended', opt: 'optional' }[f.level];
  const common = `id="${id}" data-k="${f.id}" aria-describedby="e-${f.id}"`;
  let el;
  if (f.type === 'select') el = `<select ${common}>${f.options.map(o => `<option value="${esc(o[0])}"${o[0] === val ? ' selected' : ''}>${esc(o[1])}</option>`).join('')}</select>`;
  else if (f.type === 'textarea') el = `<textarea ${common} rows="3">${esc(val)}</textarea>`;
  else el = `<input ${common} type="${{ url: 'url', tel: 'tel', date: 'date' }[f.type] || 'text'}"${f.type === 'number' ? ' inputmode="decimal"' : ''} value="${esc(val)}" placeholder="${esc(f.ph || '')}" autocomplete="off">`;
  return `<div class="${f.full ? 'full' : ''}"><label for="${id}">${f.label}<span class="lvl">${lvl}</span></label>${el}${f.hint ? `<small class="hint">${f.hint}</small>` : ''}<p class="err" id="e-${f.id}"></p></div>`;
}
function faqHTML(items) {
  return `<div id="faq">${items.map((it, i) => `<fieldset class="faq-item"><legend>Question ${i + 1}</legend>
    <div><label for="q${i}">Question</label><input id="q${i}" data-i="${i}" data-k="q" value="${esc(it.q)}" placeholder="Do you offer delivery?" autocomplete="off"></div>
    <div><label for="a${i}">Answer</label><textarea id="a${i}" rows="3" data-i="${i}" data-k="a" placeholder="Yes, within 5 km of our shop.">${esc(it.a)}</textarea></div>
    ${items.length > 1 ? `<div><button type="button" class="btn" data-rm="${i}">Remove question ${i + 1}</button></div>` : ''}</fieldset>`).join('')}</div>
    <button type="button" class="btn pri" id="add">Add question</button>`;
}
function renderTabs() {
  $('#types').innerHTML = Object.entries(SCHEMAS).map(([k, s]) =>
    `<button type="button" class="tab" data-t="${k}" aria-pressed="${k === state.type}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[s.icon]}</svg>${s.label}</button>`).join('');
}
function renderForm() {
  const s = SCHEMAS[state.type], v = state.data[state.type];
  $('#form').innerHTML = (s.fields.length ? `<div class="grid">${s.fields.map(f => fieldHTML(f, v[f.id] || '')).join('')}</div>` : '') + (s.faq ? faqHTML(v.faq) : '');
}

/* ---------- Rendering: code, score, preview ---------- */
let prevLines = [], out = '';
// Tiny JSON syntax highlighter: strings, keys, numbers and punctuation.
const hl = l => l.replace(/("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+\.?\d*)|([{}\[\],])/g,
  (m, str, colon, n, p) => str ? `<i class="${colon ? 'k' : 's'}">${esc(str)}</i>${colon || ''}` : n ? `<i class="n">${n}</i>` : `<span class="p">${p}</span>`);
function showCode(json) {
  const wrap = $('#wrap').checked, lines = json.split('\n'), seen = new Set(prevLines);
  const body = lines.map(l => `<span class="ln${prevLines.length && !seen.has(l) ? ' flash' : ''}">${hl(l)}</span>`).join('');
  $('#code').innerHTML = (wrap ? '<span class="ln p">&lt;script type="application/ld+json"&gt;</span>' : '') + body + (wrap ? '<span class="ln p">&lt;/script&gt;</span>' : '');
  prevLines = lines;
  out = wrap ? `<script type="application/ld+json">\n${json}\n<\/script>` : json;
}
let liveTimer;
function showScore({ issues, score }) {
  const errs = issues.filter(i => i.l === 'error').length;
  $('#ring').style.strokeDashoffset = 264 * (1 - score / 100);
  $('.ring').style.setProperty('--sc', score >= 80 ? 'var(--ok)' : score >= 50 ? 'var(--hl)' : 'var(--bad)');
  $('#sc-n').textContent = score;
  const title = !issues.length ? 'Ready to paste' : errs ? `${errs} ${errs === 1 ? 'problem' : 'problems'} to fix` : `${issues.length} ${issues.length === 1 ? 'suggestion' : 'suggestions'}`;
  $('#sc-t').textContent = title;
  $('#sc-s').textContent = 'Completeness score';
  $('#issues').innerHTML = issues.length ? issues.map(i => `<li><span class="dot ${i.l}"></span><span>${esc(i.m)}</span></li>`).join('')
    : '<li><span class="dot ok"></span><span>All checks passed. Paste the code into your page.</span></li>';
  clearTimeout(liveTimer); liveTimer = setTimeout(() => { $('#live').textContent = `${title}. Score ${score} out of 100.`; }, 900);
}
const ph = (x, fb) => x ? esc(x) : `<span class="muted">${fb}</span>`;
const host = u => { try { return new URL(u).hostname; } catch { return 'example.com'; } };
const serp = (url, title, body) => `<div class="serp"><div class="crumb">${esc(host(url))}</div><div class="t">${title}</div>${body}</div>`;
const AV = Object.fromEntries(SCHEMAS.Product.fields.find(f => f.id === 'availability').options);
// Approximate Google result cards: what the markup can unlock in search.
const PREV = {
  LocalBusiness: v => serp(v.url, ph(v.name, 'Your business name'), `<p class="d">${ph([v.street, v.city].filter(Boolean).join(', '), 'Street, City')} · ${ph(v.telephone, 'Phone')}</p><p class="d">${ph(v.hours, 'Opening hours')}</p>`),
  Article: v => serp(v.url, ph(v.headline, 'Your article headline'), `<p class="d">${ph(v.authorName, 'Author')} · ${ph(v.datePublished, 'Publish date')}</p><p class="d">${ph(v.description, 'A short summary of the article.')}</p>`),
  Product: v => { const p = Math.min(100, Math.max(0, (+v.rating || 0) * 20));
    return serp(v.url, ph(v.name, 'Your product name'), `<p class="d">${v.rating ? `<span class="stars" style="--p:${p}%">★★★★★</span> ${esc(v.rating)}${v.reviews ? ` (${esc(v.reviews)})` : ''} · ` : ''}${ph(v.price ? `${v.currency || ''} ${v.price}`.trim() : '', 'Price')} · ${esc(AV[v.availability] || '')}</p><p class="d">${ph(v.description, 'Product description.')}</p>`); },
  FAQ: v => serp('', 'Your page title', (v.faq.some(x => x.q) ? v.faq.filter(x => x.q) : [{ q: '', a: '' }]).map(x =>
    `<button type="button" class="q" aria-expanded="false"><span>${ph(x.q, 'Your first question')}</span><span aria-hidden="true">▾</span></button><div class="a"><p>${ph(x.a, 'Your answer appears here.')}</p></div>`).join(''))
};

function update() {
  const s = SCHEMAS[state.type], v = state.data[state.type];
  showCode(JSON.stringify(clean(s.build(v)) || { '@context': CTX }, null, 2));
  $('#p-prev').innerHTML = PREV[state.type](v);
  showScore(check(s, v));
  s.fields.forEach(f => { const el = $('#f-' + f.id); if (!el) return; const m = fmt(f, v[f.id] || ''); el.setAttribute('aria-invalid', !!m); $('#e-' + f.id).textContent = m; });
  try { localStorage.setItem('sg1', JSON.stringify({ type: state.type, data: state.data })); } catch {}
}

/* ---------- Events ---------- */
$('#types').addEventListener('click', e => {
  const b = e.target.closest('[data-t]'); if (!b) return;
  state.type = b.dataset.t; prevLines = []; renderTabs(); renderForm(); update(); $(`[data-t="${state.type}"]`).focus();
});
$('#form').addEventListener('input', e => {
  const t = e.target, v = state.data[state.type];
  if (t.dataset.i !== undefined) v.faq[t.dataset.i][t.dataset.k] = t.value; else if (t.dataset.k) v[t.dataset.k] = t.value;
  update();
});
$('#form').addEventListener('click', e => {
  const v = state.data[state.type];
  if (e.target.id === 'add') { v.faq.push({ q: '', a: '' }); renderForm(); update(); $('#q' + (v.faq.length - 1)).focus(); }
  const rm = e.target.closest('[data-rm]');
  if (rm) { v.faq.splice(+rm.dataset.rm, 1); renderForm(); update(); }
});
$('#p-prev').addEventListener('click', e => { const q = e.target.closest('.q'); if (q) q.setAttribute('aria-expanded', q.getAttribute('aria-expanded') !== 'true'); });
$('#wrap').addEventListener('change', () => { prevLines = []; update(); });
$('#reset').addEventListener('click', () => { state.data[state.type] = fresh()[state.type]; prevLines = []; renderForm(); update(); });
$('#copy').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(out); }
  catch { const a = document.createElement('textarea'); a.value = out; document.body.append(a); a.select(); document.execCommand('copy'); a.remove(); }
  const b = $('#copy'); b.textContent = 'Copied'; $('#live').textContent = 'Copied to clipboard';
  setTimeout(() => { b.textContent = 'Copy'; }, 1600);
});
document.querySelectorAll('.seg').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.seg').forEach(x => { const on = x === b; x.setAttribute('aria-selected', on); $('#' + x.getAttribute('aria-controls')).hidden = !on; });
}));

renderTabs(); renderForm(); update();
