'use strict';
/* ================= helpers ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const S = { lang: 'en', cat: 'media', item: null, q: '', loc: '' };
const BN = '০১২৩৪৫৬৭৮৯';
const num = n => { const s = n.toLocaleString('en-IN'); return S.lang === 'bn' ? s.replace(/\d/g, d => BN[d]) : s; };
const taka = n => '৳' + num(n);
const iso = d => new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
const addDays = (s, n) => { const d = new Date(s + 'T00:00'); d.setDate(d.getDate() + n); return iso(d); };
const daysBetween = (a, b) => Math.round((new Date(b + 'T00:00') - new Date(a + 'T00:00')) / 864e5);
let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ================= data ================= */
const D = {
  en: { home: 'Home', product: 'Product', verify: 'e-KYC', handover: 'Handover', dash: 'Dashboard',
    escrow: 'How Escrow Works', list: 'List an Item (Earn Cash)', sme: 'SME Merchant Portal',
    tagline: "Don't Buy It, Rent It.", sub: "Bangladesh's trusted marketplace for cameras, wedding wear, camping gear and tools.",
    ph: 'Search items…', go: 'Search', ticker: '৳25,000+ earned by owners this month',
    t1: 'National ID Verified Users', t2: 'Digital Escrow Payment (bKash/Nagad)', t3: 'ICT Act Compliant Digital Contract', t4: '৳100 Damage Protection Plan',
    cats: 'Browse by category', feat: 'Featured listings', book: 'Book Now', day: '/day', items: 'items', none: 'No items found.',
    earn: 'Earn Money from Idle Assets', eitem: 'Item', edays: 'days / week', eout: 'You could earn', mo: '/month' },
  bn: { home: 'হোম', product: 'পণ্য', verify: 'ই-কেওয়াইসি', handover: 'হস্তান্তর', dash: 'ড্যাশবোর্ড',
    escrow: 'এসক্রো কীভাবে কাজ করে', list: 'পণ্য তালিকাভুক্ত করুন (আয় করুন)', sme: 'এসএমই মার্চেন্ট পোর্টাল',
    tagline: 'কিনবেন না, ভাড়া নিন।', sub: 'ক্যামেরা, বিয়ের পোশাক, ক্যাম্পিং গিয়ার ও টুলস ভাড়া নেওয়ার বিশ্বস্ত মার্কেটপ্লেস।',
    ph: 'পণ্য খুঁজুন…', go: 'খুঁজুন', ticker: 'এই মাসে মালিকরা আয় করেছেন ৳২৫,০০০+',
    t1: 'এনআইডি যাচাইকৃত ব্যবহারকারী', t2: 'ডিজিটাল এসক্রো পেমেন্ট (বিকাশ/নগদ)', t3: 'আইসিটি আইন অনুযায়ী ডিজিটাল চুক্তি', t4: '৳১০০ ক্ষতি সুরক্ষা প্ল্যান',
    cats: 'ক্যাটাগরি অনুযায়ী দেখুন', feat: 'বিশেষ তালিকা', book: 'এখনই বুক করুন', day: '/দিন', items: 'পণ্য', none: 'কোনো পণ্য পাওয়া যায়নি।',
    earn: 'অলস সম্পদ থেকে আয় করুন', eitem: 'পণ্য', edays: 'দিন / সপ্তাহ', eout: 'আপনি আয় করতে পারেন', mo: '/মাস' }
};
const CATS = [
  { id: 'media', ic: '📷', en: 'Media &amp; Electronics', bn: 'মিডিয়া ও ইলেকট্রনিক্স', n: 1240 },
  { id: 'apparel', ic: '👘', en: 'Apparel &amp; Events', bn: 'পোশাক ও ইভেন্ট', n: 860 },
  { id: 'travel', ic: '⛺', en: 'Travel &amp; Outdoor', bn: 'ভ্রমণ ও আউটডোর', n: 430 },
  { id: 'tools', ic: '🔧', en: 'Tools &amp; Appliances', bn: 'টুলস ও যন্ত্রপাতি', n: 375 }
];
const ITEMS = [
  { id: 1, cat: 'media', ic: '📷', t: 'Sony A7 III + 28-70mm Lens', loc: 'Gulshan, Dhaka', rate: 2500, dep: 3000, r: 4.9, o: 'Rafiq A.', cond: 'Like New', inc: 'Includes SD Card + 2 Batteries', sp: '24.2MP full-frame sensor|4K 30p video|Strap, charger and camera bag' },
  { id: 2, cat: 'media', ic: '🚁', t: 'DJI Mavic 3 Drone', loc: 'Uttara, Dhaka', rate: 4000, dep: 5000, r: 4.8, o: 'Tanvir H.', cond: 'Excellent', inc: 'Includes 3 batteries + hard case', sp: '4/3 CMOS Hasselblad camera|43 min flight time|Remote controller included' },
  { id: 3, cat: 'apparel', ic: '👘', t: 'Red Bridal Katan Saree', loc: 'Dhanmondi, Dhaka', rate: 3500, dep: 4000, r: 5.0, o: 'Nusrat J.', cond: 'Like New', inc: 'Includes blouse piece + dry-clean', sp: 'Pure katan silk|Zari border work|Free-size blouse' },
  { id: 4, cat: 'apparel', ic: '🤵', t: 'Groom Sherwani (Gold)', loc: 'Banani, Dhaka', rate: 2800, dep: 3000, r: 4.7, o: 'Style Hub', cond: 'Good', inc: 'Includes turban + mojari', sp: 'Size 40 (alterable)|Embroidered fabric|Dry-cleaned after each rental' },
  { id: 5, cat: 'travel', ic: '⛺', t: '4-Person Camping Tent', loc: 'Sylhet', rate: 700, dep: 1000, r: 4.9, o: 'Arif M.', cond: 'Good', inc: 'Includes pegs + rain fly', sp: 'Waterproof 3-season|Sets up in 10 minutes|Weighs 4.2 kg' },
  { id: 6, cat: 'travel', ic: '🎒', t: 'Trekking Kit (Bag + Poles)', loc: 'Chittagong', rate: 600, dep: 800, r: 4.6, o: 'Hill Gear', cond: 'Good', inc: 'Includes rain cover', sp: '50L trekking backpack|Pair of trekking poles|Rain cover included' },
  { id: 7, cat: 'tools', ic: '🔧', t: 'Bosch Power Drill Set', loc: 'Dhanmondi, Dhaka', rate: 500, dep: 1000, r: 4.8, o: 'Kamal S.', cond: 'Like New', inc: 'Includes 40-piece bit set', sp: '18V cordless|2 batteries + fast charger|Carry case' },
  { id: 8, cat: 'tools', ic: '⚡', t: '5kVA Generator', loc: 'Uttara, Dhaka', rate: 3000, dep: 5000, r: 4.7, o: 'PowerRent', cond: 'Good', inc: 'Includes 5L fuel can', sp: '5kVA silent petrol|Electric start|Wheel kit for easy moving' }
];
const EARN = { '📷 Camera': 2500, '🚁 Drone': 3500, '👘 Saree / Sherwani': 2500, '⛺ Camping Tent': 700, '🔧 Power Tools': 500 };
const GB = ['#E2E8F0', '#D1FAE5', '#FEF3C7', '#DBEAFE'];

/* ================= navigation / language ================= */
function show(id) {
  $$('.page').forEach(p => p.classList.toggle('active', p.id === 'p-' + id));
  $$('.pages button').forEach(b => b.classList.toggle('on', b.dataset.go === id));
  if (id === 'product') { if (!S.item) S.item = ITEMS[0]; renderProduct(); }
  window.scrollTo(0, 0);
}
function applyI18n() {
  const t = D[S.lang];
  $$('[data-i]').forEach(e => { if (t[e.dataset.i] !== undefined) e.textContent = t[e.dataset.i]; });
  $$('[data-ph]').forEach(e => { e.placeholder = t[e.dataset.ph]; });
}
function setLang(l) {
  S.lang = l; document.documentElement.lang = l; document.body.classList.toggle('bn', l === 'bn');
  $$('[data-lang]').forEach(b => b.classList.toggle('on', b.dataset.lang === l));
  applyI18n(); renderHome(); if (S.item) renderProduct();
}

/* ================= home ================= */
function renderCats() {
  const active = !S.q && !S.loc;
  $('#cats').innerHTML = CATS.map(c =>
    `<button class="cat ${active && c.id === S.cat ? 'on' : ''}" data-cat="${c.id}"><span>${c.ic}</span><b>${c[S.lang]}</b><small>${num(c.n)}+ ${D[S.lang].items}</small></button>`).join('');
}
function renderListings() {
  const q = S.q.toLowerCase();
  const list = ITEMS.filter(i => (S.q || S.loc) ? (i.t.toLowerCase().includes(q) && i.loc.includes(S.loc)) : i.cat === S.cat);
  $('#listings').innerHTML = list.length ? list.map(i =>
    `<article class="lc"><div class="ph">${i.ic}</div><div class="lb"><h4>${i.t}</h4><small>📍 ${i.loc}</small><small class="ok">✔ ${i.o} · ${num(i.r)} ★</small>
     <div class="lf"><b>${taka(i.rate)}<em>${D[S.lang].day}</em></b><button class="cta sm" data-open="${i.id}">${D[S.lang].book}</button></div></div></article>`).join('')
    : `<p class="muted">${D[S.lang].none}</p>`;
}
function renderEarn() {
  const d = +$('#edays').value, v = EARN[$('#eitem').value];
  $('#edv').textContent = num(d);
  $('#eout').textContent = '~' + taka(v * d * 4);
}
function renderHome() { renderCats(); renderListings(); renderEarn(); }

function runSearch() {
  S.q = $('#q').value.trim(); S.loc = $('#loc').value;
  if ($('#sdate').value) $('#bs').value = $('#sdate').value;
  renderCats(); renderListings();
  $('#listings').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ================= product + booking calculator ================= */
let gi = 0;
function renderProduct() {
  const i = S.item;
  $('#ptitle').textContent = i.t; $('#pcond').textContent = i.cond;
  $('#ploc').textContent = '📍 ' + i.loc; $('#pinc').textContent = '✔ ' + i.inc;
  $('#specs').innerHTML = i.sp.split('|').map(s => `<li>${s}</li>`).join('');
  $('#prate').innerHTML = `${taka(i.rate)}<em>${D[S.lang].day}</em>`;
  $('#gmain').textContent = i.ic; $('#gmain').style.background = GB[gi];
  $('#thumbs').innerHTML = GB.map((c, n) => `<button class="th ${n === gi ? 'on' : ''}" data-g="${n}" style="background:${c}">${i.ic}</button>`).join('');
  calc();
}
function calc() {
  const i = S.item; if (!i) return;
  let s = $('#bs').value, e = $('#be').value;
  if (!s) { s = iso(new Date()); $('#bs').value = s; }
  $('#be').min = addDays(s, 1);
  if (!e || daysBetween(s, e) < 1) { e = addDays(s, 1); $('#be').value = e; }
  const d = daysBetween(s, e), base = i.rate * d, fee = Math.round(base * 0.05);
  const withProt = $('#prot').checked, prot = withProt ? 300 : 0, total = base + fee + prot + i.dep;
  $('#l-base').textContent = `Base Rental Rate (${taka(i.rate)} × ${num(d)} Days)`;
  $('#v-base').textContent = taka(base); $('#v-fee').textContent = taka(fee);
  $('#row-prot').hidden = !withProt; $('#v-prot').textContent = taka(prot);
  $('#v-dep').textContent = taka(i.dep); $('#v-tot').textContent = taka(total); $('#m-tot').textContent = taka(total);
}
function openItem(id) { S.item = ITEMS.find(x => x.id === id); gi = 0; show('product'); }
function bookNow() { toast('✔ Booking request sent to the owner'); setTimeout(() => show('handover'), 900); }

/* ================= e-KYC modal ================= */
const K = { s: 0, f: {} };
const phDigits = v => { let d = v.replace(/\D/g, ''); if (d.startsWith('880') && d.length > 10) d = d.slice(3); else if (d.startsWith('0')) d = d.slice(1); return d.slice(0, 10); };
const phOK = d => /^1[3-9]\d{8}$/.test(d);
const phFmt = d => d.slice(0, 4) + (d.length > 4 ? '-' + d.slice(4) : '');
const nidOK = v => [10, 13, 17].includes(v.length);
const socOK = v => /^https?:\/\/(www\.)?(facebook|fb|linkedin)\.com\/.+/i.test(v);
function mark(el, v, ok) { const f = el.closest('.fld'); f.classList.toggle('good', !!v && ok); f.classList.toggle('bad', !!v && !ok); }
function kUpdate() {
  $$('#ksteps li').forEach((li, i) => { li.className = i < K.s ? 'done' : i === K.s ? 'now' : ''; });
  $$('.kp').forEach(p => { p.hidden = +p.dataset.k !== K.s; });
  const ph = phDigits($('#k-ph').value), nid = $('#k-nid').value, soc = $('#k-soc').value.trim();
  mark($('#k-ph'), ph, phOK(ph)); mark($('#k-nid'), nid, nidOK(nid)); mark($('#k-soc'), soc, socOK(soc));
  const ok = [phOK(ph) && nidOK(nid) && K.f.front && K.f.back, !!K.f.selfie, !soc || socOK(soc), $('#k-consent').checked][K.s];
  $('#knext').disabled = !ok;
  $('#kback').style.visibility = K.s ? 'visible' : 'hidden';
  $('#knext').textContent = K.s === 3 ? 'Submit' : (K.s === 2 && !soc) ? 'Skip' : 'Continue';
}
function kReset() {
  K.s = 0; K.f = {};
  ['#k-ph', '#k-nid', '#k-soc'].forEach(s => { $(s).value = ''; });
  $('#k-consent').checked = false;
  $$('#kyc .up').forEach(l => { l.classList.remove('done'); $('span', l).textContent = $('span', l).dataset.t; });
  $('#kbody').hidden = false; $('#kdone').hidden = true; $('#kfoot').hidden = false; $('#ksteps').hidden = false;
  kUpdate();
}
function kClose() { $('#kyc').hidden = true; kReset(); }

/* ================= handover ================= */
const H = { photos: [null, null, null], video: null, pin: { r: '', o: '' } };
const genPin = () => String((window.crypto && crypto.getRandomValues ? crypto.getRandomValues(new Uint32Array(1))[0] : Math.random() * 1e4 | 0) % 10000).padStart(4, '0');
function newPins() {
  H.pin.r = genPin(); do { H.pin.o = genPin(); } while (H.pin.o === H.pin.r);
  $('#pin-r').innerHTML = [...H.pin.r].map(d => `<i>${d}</i>`).join('');
  $('#pin-o').innerHTML = [...H.pin.o].map(d => `<i>${d}</i>`).join('');
  $('#h-r').value = ''; $('#h-o').value = ''; hCheck();
}
function hReady() {
  const n = H.photos.filter(Boolean).length;
  $('#hcount').textContent = H.video ? 'Video added ✓' : `${n}/3 photos added`;
  $('#hnext').disabled = !(n >= 3 || H.video);
}
function hCheck() {
  const res = {};
  [['r', 'o'], ['o', 'r']].forEach(([who, other]) => {
    const inp = $('#h-' + who), v = inp.value, ok = v.length === 4 && v === H.pin[other], bad = v.length === 4 && !ok;
    res[who] = ok; inp.classList.toggle('bad', bad);
    $('#pc-' + who).classList.toggle('ok', ok);
    const m = $('#m-' + who); m.className = 'msg ' + (ok ? 'good' : bad ? 'bad' : '');
    m.textContent = ok ? '✔ Confirmed' : bad ? "PIN doesn't match. Check it in person." : '';
  });
  const open = res.r && res.o;
  $('#escrow').classList.toggle('open', open);
  $('#e-ic').textContent = open ? '🔓' : '🔒';
  $('#e-t').textContent = open ? 'Escrow unlocked' : 'Escrow locked';
  $('#e-d').textContent = open ? 'Rental fee released to owner. ৳3,000 deposit stays held until return.' : '৳11,175 is held safely until handover is confirmed.';
  $$('#hsteps li').forEach((li, i) => { li.className = open ? 'done' : (i === (H.step2 ? 1 : 0) ? 'now' : (i === 0 && H.step2 ? 'done' : '')); });
}
function hStep(two) { H.step2 = two; $('#h1').hidden = two; $('#h2').hidden = !two; if (two && !H.pin.r) newPins(); hCheck(); }

/* ================= dashboard ================= */
let bal = 18450, method = 'bKash';
function setDash(name) {
  $$('.dp').forEach(p => { p.hidden = p.id !== 'd-' + name; });
  $$('#dtabs button').forEach(b => b.classList.toggle('on', b.dataset.dt === name));
}
function cUpdate() { $('#cbtn').disabled = !($('#cbook').value && $('#ctext').value.trim().length >= 10); }

/* ================= events ================= */
document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]');
  if (g) { e.preventDefault(); if (g.dataset.tab) setDash(g.dataset.tab); show(g.dataset.go); return; }
  const l = e.target.closest('[data-lang]'); if (l) { setLang(l.dataset.lang); return; }
  const c = e.target.closest('[data-cat]');
  if (c) { S.cat = c.dataset.cat; S.q = ''; S.loc = ''; $('#q').value = ''; $('#loc').value = ''; renderCats(); renderListings(); return; }
  const o = e.target.closest('[data-open]'); if (o) { openItem(+o.dataset.open); return; }
  const t = e.target.closest('[data-g]'); if (t) { gi = +t.dataset.g; renderProduct(); return; }
  const dl = e.target.closest('[data-dlv]'); if (dl) { $$('[data-dlv]').forEach(b => b.classList.toggle('on', b === dl)); return; }
  const dt = e.target.closest('[data-dt]'); if (dt) { setDash(dt.dataset.dt); return; }
  const m = e.target.closest('[data-m]');
  if (m) { method = m.dataset.m; $$('[data-m]').forEach(b => b.classList.toggle('on', b === m)); $('#wbtn').textContent = 'Withdraw to ' + method; return; }
  const rq = e.target.closest('[data-req]');
  if (rq) {
    const accepted = rq.classList.contains('ok'); rq.closest('.rq').remove();
    const n = $$('.rq').length; $('#rqn').textContent = n; $('#rqnone').hidden = n > 0;
    toast(accepted ? '✔ Request accepted' : 'Request declined'); return;
  }
});
$('#go').addEventListener('click', runSearch);
$('#q').addEventListener('keydown', e => { if (e.key === 'Enter') runSearch(); });
$('#eitem').addEventListener('change', renderEarn);
$('#edays').addEventListener('input', renderEarn);

$('#gprev').addEventListener('click', () => { gi = (gi + 3) % 4; renderProduct(); });
$('#gnext').addEventListener('click', () => { gi = (gi + 1) % 4; renderProduct(); });
$('#bs').addEventListener('change', () => { const s = $('#bs').value; if (s && $('#be').value && daysBetween(s, $('#be').value) < 1) $('#be').value = addDays(s, 1); calc(); });
$('#be').addEventListener('change', calc);
$('#prot').addEventListener('change', calc);
$('#reqbook').addEventListener('click', bookNow);
$('#mbook').addEventListener('click', bookNow);

/* e-KYC */
$('#openkyc').addEventListener('click', () => { $('#kyc').hidden = false; kUpdate(); });
$('#kx').addEventListener('click', kClose);
$('#kfin').addEventListener('click', kClose);
$('#kyc').addEventListener('click', e => { if (e.target.id === 'kyc') kClose(); });
$('#k-ph').addEventListener('input', e => { e.target.value = phFmt(phDigits(e.target.value)); kUpdate(); });
$('#k-nid').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 17); kUpdate(); });
$('#k-soc').addEventListener('input', kUpdate);
$('#k-consent').addEventListener('change', kUpdate);
$$('#kyc input[data-f]').forEach(inp => inp.addEventListener('change', () => {
  const file = inp.files[0] || null; K.f[inp.dataset.f] = file;
  const lab = inp.closest('.up'); lab.classList.toggle('done', !!file);
  $('span', lab).textContent = file ? '✔ ' + file.name.slice(0, 22) : $('span', lab).dataset.t; kUpdate();
}));
$('#kback').addEventListener('click', () => { if (K.s > 0) { K.s--; kUpdate(); } });
$('#knext').addEventListener('click', () => {
  if (K.s < 3) { K.s++; kUpdate(); return; }
  $('#kbody').hidden = true; $('#kfoot').hidden = true; $('#ksteps').hidden = true; $('#kdone').hidden = false;
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#kyc').hidden) kClose(); });

/* handover */
$$('#h1 input[data-p]').forEach(inp => inp.addEventListener('change', () => {
  const i = +inp.dataset.p, file = inp.files[0], lab = inp.closest('.slot');
  if (H.photos[i]) URL.revokeObjectURL(H.photos[i]);
  if (file) { H.photos[i] = URL.createObjectURL(file); lab.style.backgroundImage = `url("${H.photos[i]}")`; lab.classList.add('has'); }
  else { H.photos[i] = null; lab.style.backgroundImage = ''; lab.classList.remove('has'); }
  hReady();
}));
$('#hvid').addEventListener('change', e => {
  const f = e.target.files[0] || null; H.video = f; const lab = e.target.closest('.up');
  lab.classList.toggle('done', !!f); $('span', lab).textContent = f ? '✔ ' + f.name.slice(0, 28) : $('span', lab).dataset.t; hReady();
});
$('#hnext').addEventListener('click', () => hStep(true));
$('#hback').addEventListener('click', () => hStep(false));
$('#hnew').addEventListener('click', newPins);
['#h-r', '#h-o'].forEach(s => $(s).addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4); hCheck(); }));

/* dashboard */
$('#wbtn').addEventListener('click', () => {
  const n = +$('#wamt').value, msg = $('#wmsg');
  if (!n || n < 100) { msg.className = 'msg bad'; msg.textContent = 'Minimum withdrawal is ৳100.'; return; }
  if (n > bal) { msg.className = 'msg bad'; msg.textContent = 'Amount exceeds your balance.'; return; }
  bal -= n; $$('.bal').forEach(b => { b.textContent = taka(bal); });
  $('#wamt').value = ''; msg.className = 'msg good'; msg.textContent = `${taka(n)} sent to your ${method} account.`;
});
$('#wamt').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, ''); });
$('#cbook').addEventListener('change', cUpdate);
$('#ctext').addEventListener('input', cUpdate);
$('#cbtn').addEventListener('click', () => { $('#cform').hidden = true; $('#cdone').hidden = false; });
$('#bulk').addEventListener('change', e => {
  const f = e.target.files[0] || null, lab = e.target.closest('.up');
  lab.classList.toggle('done', !!f); $('span', lab).textContent = f ? `✔ ${f.name} ready to import` : $('span', lab).dataset.t;
});

/* ================= init ================= */
(function init() {
  $('#eitem').innerHTML = Object.keys(EARN).map(k => `<option>${k}</option>`).join('');
  const today = iso(new Date());
  $('#sdate').min = today; $('#bs').min = today; $('#bs').value = today; $('#be').value = addDays(today, 3);
  S.item = ITEMS[0];
  applyI18n(); renderHome(); renderProduct(); hReady(); kUpdate();
})();
