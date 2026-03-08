/**
 * ui.js
 * Menangani semua operasi DOM: render checklist,
 * update progress bar, animasi confetti, dan toggle collapse.
 */

/* --------------------------------------------------
   PROGRESS BAR
   -------------------------------------------------- */

function getTotals(state) {
  let total = 0, done = 0;
  state.forEach(cat =>
    cat.items.forEach(item => {
      total++;
      if (item.done) done++;
    })
  );
  return { total, done };
}

function updateProgress(state) {
  const { total, done } = getTotals(state);
  const pct = total ? Math.round((done / total) * 100) : 0;

  document.getElementById('mainBar').style.width = pct + '%';
  document.getElementById('countDisplay').innerHTML =
    `${done} <span>/ ${total} selesai</span>`;
  document.getElementById('doneCount').textContent = `${done} selesai`;
  document.getElementById('todoCount').textContent = `${total - done} tersisa`;
  document.getElementById('pctDisplay').textContent = pct + '%';

  const banner = document.getElementById('completeBanner');
  banner.classList.toggle('show', done === total && total > 0);
}

/* --------------------------------------------------
   CATEGORY PILL
   -------------------------------------------------- */

function updateCatPill(state, catIdx) {
  const cat = state[catIdx];
  const done = cat.items.filter(i => i.done).length;
  const total = cat.items.length;

  const pill = document.querySelector(`[data-cat="${catIdx}"] .cat-pill`);
  if (!pill) return;

  pill.textContent = `${done}/${total}`;
  pill.className = 'cat-pill ' +
    (done === total ? 'all-done' : done > 0 ? 'partial' : 'none');
}

/* --------------------------------------------------
   CONFETTI
   -------------------------------------------------- */

function spawnConfetti(x, y) {
  const colors = ['#22d37a', '#4f8ef7', '#7c5af5', '#f7c94f', '#f75f4f'];
  const burst = document.createElement('div');
  burst.className = 'confetti-burst';
  burst.style.left = x + 'px';
  burst.style.top  = y + 'px';

  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-particle';
    const angle = (i / 14) * 360;
    const dist  = 40 + Math.random() * 50;
    const tx    = Math.cos(angle * Math.PI / 180) * dist;
    const ty    = Math.sin(angle * Math.PI / 180) * dist;

    p.style.cssText = `
      background: ${colors[i % colors.length]};
      left: 0; top: 0;
      --tx: ${tx}px;
      --ty: ${ty}px;
      --tr: ${Math.random() * 360}deg;
    `;
    burst.appendChild(p);
  }

  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 900);
}

/* --------------------------------------------------
   RENDER CHECKLIST
   -------------------------------------------------- */

/**
 * Render seluruh checklist ke dalam #checklist.
 * @param {Array}    state    - State aktif
 * @param {Function} onToggle - Callback(catIdx, itemIdx) saat item di-klik
 */
function renderChecklist(state, onToggle) {
  const container = document.getElementById('checklist');
  container.innerHTML = '';

  state.forEach((cat, catIdx) => {
    const doneCat  = cat.items.filter(i => i.done).length;
    const totalCat = cat.items.length;
    const pillClass = doneCat === totalCat
      ? 'all-done'
      : doneCat > 0 ? 'partial' : 'none';

    const catEl = document.createElement('div');
    catEl.className = 'category' + (cat.collapsed ? ' collapsed' : '');
    catEl.dataset.cat = catIdx;
    catEl.style.animationDelay = (catIdx * 0.06) + 's';

    catEl.innerHTML = `
      <div class="cat-header">
        <span class="cat-number">${String(catIdx + 1).padStart(2, '0')}</span>
        <span class="cat-title">${cat.title}</span>
        <span class="cat-pill ${pillClass}">${doneCat}/${totalCat}</span>
        <span class="cat-arrow">▾</span>
      </div>
      <div class="items-container">
        ${cat.items.map((item, itemIdx) => `
          <div class="item ${item.done ? 'done' : ''}"
               data-cat="${catIdx}"
               data-item="${itemIdx}">
            <div class="cb"><span class="cb-check">✓</span></div>
            <div class="item-text">${item.text}</div>
          </div>
        `).join('')}
      </div>
    `;

    /* Toggle collapse */
    catEl.querySelector('.cat-header').addEventListener('click', () => {
      state[catIdx].collapsed = !state[catIdx].collapsed;
      catEl.classList.toggle('collapsed');
    });

    /* Item toggle */
    catEl.querySelectorAll('.item').forEach(itemEl => {
      itemEl.addEventListener('click', () => {
        const ci = +itemEl.dataset.cat;
        const ii = +itemEl.dataset.item;
        onToggle(ci, ii, itemEl);
      });
    });

    container.appendChild(catEl);
  });
}
