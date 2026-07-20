/* ===================================================================
   骰檯 · 罰酒計量
   對戰標記兩側各放一只威士忌杯，輸一場倒六分之一杯。
   連輸三場或累計輸六場時，於下方顯示提醒。
   =================================================================== */
(function (global) {
  'use strict';

  const MAX = 6;                       // 六場倒滿一杯
  const STREAK_LIMIT = 3;              // 連輸三場
  const NOTES = {
    you: '喔不，妳好像喝酒的太快了，記得注意節奏，避免喝醉喔',
    cpu: '妳太強了，繁花跟客人都快被你灌醉了 ∑(✘Д✘๑ )',
  };

  const state = {
    you: { total: 0, streak: 0, warned: false },
    cpu: { total: 0, streak: 0, warned: false },
  };
  const els = {};

  function glass(side, label) {
    return `
      <div class="glass" data-side="${side}" role="img" aria-label="${label}">
        <div class="glass-body">
          <div class="glass-fill" id="glass-fill-${side}"></div>
          <span class="glass-shine" aria-hidden="true"></span>
        </div>
        <div class="glass-foot" aria-hidden="true"></div>
      </div>`;
  }

  /* 把兩只酒杯插到 .versus-mark 左右，並在對戰列下方準備提醒欄位 */
  function mount() {
    const mark = document.querySelector('.versus-mark');
    if (!mark) return;

    const wrap = document.createElement('div');
    wrap.className = 'drink-row';
    wrap.innerHTML = glass('you', '妳的酒杯') + '<span class="drink-mark-slot"></span>' + glass('cpu', '繁花的酒杯');
    mark.parentNode.insertBefore(wrap, mark);
    wrap.querySelector('.drink-mark-slot').replaceWith(mark);

    const note = document.createElement('p');
    note.className = 'drink-note';
    note.id = 'drink-note';
    const versus = document.querySelector('.versus');
    if (versus) versus.insertAdjacentElement('afterend', note);

    els.you = document.getElementById('glass-fill-you');
    els.cpu = document.getElementById('glass-fill-cpu');
    els.note = note;
    render();
  }

  function render() {
    ['you', 'cpu'].forEach((side) => {
      const fill = els[side];
      if (!fill) return;
      const level = Math.min(state[side].total, MAX);
      fill.style.height = (level / MAX * 100) + '%';
      fill.parentNode.parentNode.classList.toggle('is-full', level >= MAX);
    });
    if (!els.note) return;
    const lines = ['you', 'cpu'].filter((s) => state[s].warned).map((s) => `<span>${NOTES[s]}</span>`);
    els.note.innerHTML = lines.join('');
    els.note.classList.toggle('is-shown', lines.length > 0);
  }

  /* 記一場敗：side 是輸的那一方（'you' 或 'cpu'） */
  function loss(side) {
    const other = side === 'you' ? 'cpu' : 'you';
    if (!state[side]) return;
    state[side].total += 1;
    state[side].streak += 1;
    state[other].streak = 0;
    if (state[side].streak >= STREAK_LIMIT || state[side].total >= MAX) {
      state[side].warned = true;
    }
    render();
  }

  function reset() {
    ['you', 'cpu'].forEach((s) => { state[s] = { total: 0, streak: 0, warned: false }; });
    render();
  }

  global.DrinkMeter = { loss, reset, mount, state };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})(window);
