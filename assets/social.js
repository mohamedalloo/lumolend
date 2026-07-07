/* ============================================================
   LumoLend social proof — testimonials, self-contained widget.
   Injects its own styles; exposes:
     lumoProofStrip(elId, n)    — grid of n cards (mixed flows)
     lumoProofCard(flow)        — one full card matched to a flow
     lumoProofMini(flow)        — compact one-liner for modals
   EDIT THE QUOTES HERE — one array, nothing else to touch.
   ============================================================ */
'use strict';
(function () {
  /* ---- the roster: swap these for real client quotes ---- */
  var PROOF = [
    { flow: 'home', name: 'Sarah K.', loc: 'Gilbert, AZ', metric: 'CLOSED IN 21 DAYS',
      q: 'Priced it on my phone Sunday night, had Moh on the phone Monday, offer accepted that weekend. The letter matched our offer to the dollar — the listing agent called to check it was real.' },
    { flow: 'refi', name: 'Marcus T.', loc: 'Frisco, TX', metric: 'RATE LANDED IN BAND',
      q: 'I watched the band tighten as I confirmed my info. No document chase, no surprise at closing — the final rate landed inside the range the site showed me on day one.' },
    { flow: 'dscr', name: 'Dana R.', loc: 'Columbus, OH', metric: '1.31× DSCR · 18-DAY CLOSE',
      q: 'Third rental, first lender that never asked for my tax returns. Ran the coverage myself with their calculator, submitted, and the terms came back where the site said they would.' },
    { flow: 'str', name: 'Jenna M.', loc: 'Sevierville, TN', metric: 'CABIN FUNDED',
      q: 'Every bank wanted two years of Airbnb history I didn’t have. This desk knew exactly how the projection haircut works and routed me to a lender who counts it.' },
    { flow: 'bridge', name: 'Victor L.', loc: 'Phoenix, AZ', metric: 'TERM SHEET IN 48 HRS',
      q: 'Term sheet in two days, first draw released nine days after closing. They talk basis and ARV, not paperwork.' },
    { flow: 'heloc', name: 'Aisha B.', loc: 'Charlotte, NC', metric: 'LINE OPEN IN 6 DAYS',
      q: 'Kept my low first mortgage completely untouched and had the line open before my contractor’s deposit was due.' },
    { flow: 'home', name: 'Omar S.', loc: 'San Diego, CA', metric: 'SELF-EMPLOYED · APPROVED',
      q: 'My CPA does her job too well — my returns look broke. The run routed me to bank-statement lending in four questions. Deposits qualified me, nobody blinked.' }
  ];

  var STARS = '<span class="lp-stars" aria-label="5 out of 5">★★★★★</span>';

  var CSS = '' +
'.lp-wrap{position:relative;z-index:2;max-width:1080px;margin:0 auto;padding:44px clamp(18px,4vw,48px) 8px}' +
'.lp-label{font-family:var(--disp);font-size:9.5px;letter-spacing:.3em;color:var(--mut);margin-bottom:22px;display:flex;align-items:center;gap:14px;justify-content:center}' +
'.lp-label::before,.lp-label::after{content:"";width:44px;height:1px;background:linear-gradient(90deg,transparent,var(--cyan-dim));flex-shrink:0}' +
'.lp-label::after{background:linear-gradient(90deg,var(--cyan-dim),transparent)}' +
'.lp-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}' +
'.lp-card{position:relative;background:var(--panel);border:1px solid var(--edge);border-radius:10px;padding:22px 24px 18px;overflow:hidden;transition:.25s;display:flex;flex-direction:column;gap:12px}' +
'.lp-card::before{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--cyan);opacity:.55;box-shadow:0 0 12px var(--cyan)}' +
'.lp-card:hover{transform:translateY(-3px);border-color:var(--cyan-dim)}' +
'.lp-stars{font-size:12px;letter-spacing:.3em;color:var(--green);text-shadow:0 0 10px var(--green-glow)}' +
'.lp-q{font-size:13.5px;line-height:1.65;color:#C7D3D8;flex:1}' +
'.lp-q::before{content:"“";color:var(--cyan);font-family:var(--disp);margin-right:1px}' +
'.lp-q::after{content:"”";color:var(--cyan);font-family:var(--disp)}' +
'.lp-foot{display:flex;align-items:center;gap:10px;border-top:1px solid var(--edge);padding-top:13px}' +
'.lp-av{width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#16303c,#0a161d);border:1px solid var(--cyan-dim);display:flex;align-items:center;justify-content:center;font-family:var(--disp);font-size:10px;color:var(--cyan);flex-shrink:0}' +
'.lp-who{font-family:var(--disp);font-size:11.5px;letter-spacing:.04em;color:var(--txt);line-height:1.4}' +
'.lp-who small{display:block;color:var(--faint);font-size:9.5px;letter-spacing:.08em}' +
'.lp-metric{margin-left:auto;font-family:var(--disp);font-size:8px;letter-spacing:.14em;color:var(--green);border:1px solid rgba(0,230,122,.35);border-radius:2px;padding:3px 7px;white-space:nowrap}' +
'.lp-mini{display:flex;gap:10px;align-items:flex-start;background:var(--void);border:1px solid var(--edge);border-left:2px solid var(--cyan);border-radius:0 6px 6px 0;padding:12px 14px;margin-top:14px;text-align:left}' +
'.lp-mini .lp-stars{font-size:9px;letter-spacing:.2em}' +
'.lp-mini-q{font-size:11.5px;line-height:1.55;color:var(--mut)}' +
'.lp-mini-q b{color:#C7D3D8;font-weight:400}' +
'.lp-mini-who{font-family:var(--disp);font-size:9px;letter-spacing:.12em;color:var(--faint);margin-top:5px}' +
'.lp-note{text-align:center;font-size:9.5px;color:var(--faint);margin-top:14px;letter-spacing:.04em}' +
'@media(max-width:640px){.lp-grid{grid-template-columns:1fr}}';

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  function initials(name) { return name.split(' ').map(function (w) { return w[0]; }).join('').replace('.', ''); }

  function pick(flow) {
    var hit = PROOF.filter(function (p) { return p.flow === flow; });
    return (hit.length ? hit : PROOF)[0];
  }

  function card(p) {
    return '<div class="lp-card">' + STARS +
      '<div class="lp-q">' + p.q + '</div>' +
      '<div class="lp-foot"><div class="lp-av">' + initials(p.name) + '</div>' +
      '<div class="lp-who">' + p.name + '<small>' + p.loc + '</small></div>' +
      '<div class="lp-metric">' + p.metric + '</div></div></div>';
  }

  window.lumoProofCard = function (flow) { return card(pick(flow)); };

  window.lumoProofMini = function (flow) {
    var p = pick(flow);
    return '<div class="lp-mini"><div>' + STARS +
      '<div class="lp-mini-q"><b>“' + p.q + '”</b></div>' +
      '<div class="lp-mini-who">' + p.name.toUpperCase() + ' · ' + p.loc.toUpperCase() + ' · ' + p.metric + '</div>' +
      '</div></div>';
  };

  window.lumoProofStrip = function (elId, n) {
    var el = document.getElementById(elId);
    if (!el) return;
    var picks = PROOF.slice(0, n || 3);
    el.innerHTML = '<div class="lp-label">SIGNAL FROM THE DESK</div>' +
      '<div class="lp-grid">' + picks.map(card).join('') + '</div>';
  };
})();
