/* ===================================================================
   骰檯 · 核心規則引擎
   純函式：只負責骰子與牌型的判定，不碰 DOM。
   =================================================================== */
(function (global) {
  'use strict';

  /* ---------- 基本骰子 ---------- */

  function rollDie() { return 1 + Math.floor(Math.random() * 6); }
  function roll(n) { return Array.from({ length: n }, rollDie); }

  // 台灣骰子：一點與四點為紅，其餘為黑
  function isRed(v) { return v === 1 || v === 4; }

  function counts(dice) {
    const c = [0, 0, 0, 0, 0, 0, 0];
    dice.forEach((d) => { c[d] += 1; });
    return c;
  }

  function sum(dice) { return dice.reduce((a, b) => a + b, 0); }

  /* ---------- 紅黑單雙 ---------- */

  const CONDITIONS = [
    { key: 'red',   label: '紅的拿掉', hint: '一點、四點', test: (v) => isRed(v) },
    { key: 'black', label: '黑的拿掉', hint: '二三五六',   test: (v) => !isRed(v) },
    { key: 'odd',   label: '單的拿掉', hint: '一三五',     test: (v) => v % 2 === 1 },
    { key: 'even',  label: '雙的拿掉', hint: '二四六',     test: (v) => v % 2 === 0 },
    { key: 'big',   label: '大的拿掉', hint: '四五六',     test: (v) => v >= 4 },
    { key: 'small', label: '小的拿掉', hint: '一二三',     test: (v) => v <= 3 },
  ];

  // 每個條件在「未知骰子」上的命中機率，供電腦估算對手損失
  function conditionOdds(cond) {
    let hit = 0;
    for (let v = 1; v <= 6; v += 1) if (cond.test(v)) hit += 1;
    return hit / 6;
  }

  /* ---------- 吹牛 ---------- */

  /* 吹牛的點數大小：2 < 3 < 4 < 5 < 6 < 1（一點最大）
     LIAR_FACE_ORDER 由小到大，供選點器與「下一個更大的點」使用。 */
  const LIAR_FACE_ORDER = [2, 3, 4, 5, 6, 1];
  function liarFaceValue(v) { return v === 1 ? 7 : v; }
  function liarFaceRank(v) { return LIAR_FACE_ORDER.indexOf(v); }
  // 比 face 再大一級的點數；已經是最大（1）則回傳 null
  function liarNextFace(v) {
    const i = liarFaceRank(v);
    return (i < 0 || i >= LIAR_FACE_ORDER.length - 1) ? null : LIAR_FACE_ORDER[i + 1];
  }

  /* 手上有幾顆算作 face。
     onesWild = true（預設）→ 一點為萬用，但喊一點時一點只算一點
     onesWild = false       → 一點已經被喊過，從此只代表一點 */
  function liarCount(dice, face, onesWild) {
    const wild = onesWild !== false;
    return dice.reduce((n, d) => {
      if (d === face) return n + 1;
      if (wild && face !== 1 && d === 1) return n + 1;
      return n;
    }, 0);
  }

  // 未知骰子命中 face 的機率
  function liarUnknownP(face, onesWild) {
    if (onesWild === false) return 1 / 6;      // 一點不再萬用 → 只有自己那一面
    return face === 1 ? 1 / 6 : 2 / 6;
  }

  // 叫盤必須更大：先比數量，同數量再比點數（照 2<3<4<5<6<1）
  function bidGreater(bid, prev) {
    if (!prev) return true;
    if (bid.count > prev.count) return true;
    return bid.count === prev.count && liarFaceValue(bid.face) > liarFaceValue(prev.face);
  }

  /* 烏龍：五顆全不重複（例如 1 2 4 5 6、2 3 4 5 6）。
     沒有任何點數達到兩顆，依規則要重搖。 */
  function isLiarBust(dice) {
    const c = counts(dice);
    for (let v = 1; v <= 6; v += 1) if (c[v] >= 2) return false;
    return true;
  }

  // P(未知的 n 顆中，至少還有 k 顆命中)
  function atLeastP(n, k, p) {
    if (k <= 0) return 1;
    if (k > n) return 0;
    let acc = 0;
    for (let i = k; i <= n; i += 1) acc += binom(n, i) * Math.pow(p, i) * Math.pow(1 - p, n - i);
    return acc;
  }

  function binom(n, k) {
    if (k < 0 || k > n) return 0;
    let r = 1;
    for (let i = 1; i <= k; i += 1) r = (r * (n - k + i)) / i;
    return r;
  }

  /* ---------- 十八骰子（碗公） ---------- */
  /*
     四顆骰子，去掉一組對子，剩下兩顆相加即為點數。
     兩組對子時去掉較小的一組（點數才最大）：2244 → 去 22 → 4+4 = 8。
     四顆同號為「一色」，最大。
     三顆同號不成點（3335 → 0 點），無對子亦為烏龍，最多重骰三次。
  */
  function eval18(dice) {
    const c = counts(dice);
    const total = sum(dice);
    for (let v = 1; v <= 6; v += 1) {
      if (c[v] === 4) return { type: 'flush', name: '一色', face: v, points: null, dice: dice.slice() };
    }
    for (let v = 1; v <= 6; v += 1) {
      // 三顆同號不成點
      if (c[v] === 3) return { type: 'bust', name: '烏龍', points: 0, reason: 'triple', dice: dice.slice() };
    }
    let best = null;
    for (let v = 1; v <= 6; v += 1) {
      if (c[v] >= 2) {
        const points = total - 2 * v;
        if (!best || points > best.points) best = { pairFace: v, points };
      }
    }
    if (!best) return { type: 'bust', name: '烏龍', points: 0, dice: dice.slice() };
    const kept = [];
    const removed = [];
    let dropped = 0;
    dice.forEach((d) => {
      if (d === best.pairFace && dropped < 2) { removed.push(d); dropped += 1; }
      else kept.push(d);
    });
    return { type: 'points', name: best.points + ' 點', points: best.points, pairFace: best.pairFace, kept, removed, dice: dice.slice() };
  }

  // 一色 > 任何點數；同型比點數（一色比骰面）
  function rank18(r) {
    if (r.type === 'flush') return 1000 + r.face;
    return r.points || 0;
  }

  /* 依照玩法決定輸家：big=比大（最小輸）、small=比小（最大輸）、squeeze=夾殺（中間輸） */
  function judge18(results, mode) {
    const scored = results.map((r, i) => ({ i, score: rank18(r.hand), r }));
    if (mode === 'big') return pickExtreme(scored, false);
    if (mode === 'small') return pickExtreme(scored, true);
    return pickMiddle(scored);
  }

  function pickExtreme(scored, highestLoses) {
    const target = highestLoses
      ? Math.max(...scored.map((s) => s.score))
      : Math.min(...scored.map((s) => s.score));
    const losers = scored.filter((s) => s.score === target);
    if (losers.length === scored.length) return { draw: true, losers: [] };
    return { draw: false, losers: losers.map((s) => s.i) };
  }

  // 夾殺：取中間點數者輸；若兩人同分、一人不同，則「不同的那一位」輸
  function pickMiddle(scored) {
    const uniq = [...new Set(scored.map((s) => s.score))];
    if (uniq.length === 1) return { draw: true, losers: [] };
    if (scored.length >= 3 && uniq.length === 2) {
      const tally = {};
      scored.forEach((s) => { tally[s.score] = (tally[s.score] || 0) + 1; });
      const lone = uniq.find((v) => tally[v] === 1);
      if (lone !== undefined) return { draw: false, losers: scored.filter((s) => s.score === lone).map((s) => s.i), reason: '單獨一家' };
    }
    const sorted = [...scored].sort((a, b) => a.score - b.score);
    const mid = sorted[Math.floor((sorted.length - 1) / 2)];
    return { draw: false, losers: [mid.i], reason: '中間點數' };
  }

  /* ---------- 話呸（骰子牌型） ---------- */

  /* 牌型大小（大到小）：
       一色 > 鐵支 > 順子(23456) > 葫蘆 > 三條 > 兩對 > 一對 > 順子(12345) > 烏龍
     兩種順子分屬兩端：23456 是大順，12345 是小順，只比烏龍大。 */
  const POKER_RANKS = [
    { rank: 9, name: '一色' },
    { rank: 8, name: '鐵支' },
    { rank: 7, name: '順子', note: '23456' },
    { rank: 6, name: '葫蘆' },
    { rank: 5, name: '三條' },
    { rank: 4, name: '兩對' },
    { rank: 3, name: '一對' },
    { rank: 2, name: '順子', note: '12345' },
    { rank: 1, name: '烏龍' },
  ];

  // 話呸的點數大小：1 > 6 > 5 > 4 > 3 > 2（一點最大）
  function pokerFaceValue(v) { return v === 1 ? 7 : v; }

  function evalPoker(dice) {
    const c = counts(dice);
    const groups = [];
    for (let v = 1; v <= 6; v += 1) if (c[v]) groups.push({ face: v, n: c[v] });
    groups.sort((a, b) => (b.n - a.n) || (pokerFaceValue(b.face) - pokerFaceValue(a.face)));

    const key = groups.map((g) => g.n).join('');
    const faces = [...dice].sort((a, b) => pokerFaceValue(b) - pokerFaceValue(a));

    if (key === '5') return hand(9, '一色', [groups[0].face], dice);

    const set = new Set(dice);
    const isHigh = set.size === 5 && [2, 3, 4, 5, 6].every((v) => set.has(v));
    const isLow = set.size === 5 && [1, 2, 3, 4, 5].every((v) => set.has(v));
    if (isHigh) return hand(7, '順子', [6], dice);   // 大順：排在鐵支之下、葫蘆之上

    if (key === '41') return hand(8, '鐵支', [groups[0].face, groups[1].face], dice);
    if (key === '32') return hand(6, '葫蘆', [groups[0].face, groups[1].face], dice);
    if (key === '311') return hand(5, '三條', [groups[0].face, groups[1].face, groups[2].face], dice);
    if (key === '221') return hand(4, '兩對', [groups[0].face, groups[1].face, groups[2].face], dice);
    if (key === '2111') return hand(3, '一對', [groups[0].face, ...groups.slice(1).map((g) => g.face)], dice);
    if (isLow) return hand(2, '順子', [5], dice);    // 小順：只比烏龍大
    return hand(1, '烏龍', faces, dice);
  }

  function hand(rank, name, tiebreak, dice) {
    return { rank, name, tiebreak, dice: dice.slice() };
  }

  /* 真正組成這個牌型的骰子位置（供 UI 提亮）：
       一色／順子／葫蘆 → 五顆全算
       鐵支／三條／一對 → 同號的那幾顆
       兩對             → 兩組對子共四顆
       烏龍             → 最大的那一顆（比大小時就靠它） */
  function pokerMadeDice(h) {
    const d = h.dice;
    const t = h.tiebreak;
    const all = d.map((_, i) => i);
    switch (h.rank) {
      case 9: case 7: case 6: case 2:
        return all;
      case 8: case 5: case 3:
        return all.filter((i) => d[i] === t[0]);
      case 4:
        return all.filter((i) => d[i] === t[0] || d[i] === t[1]);
      default:
        return [all.reduce((best, i) =>
          (pokerFaceValue(d[i]) > pokerFaceValue(d[best]) ? i : best), 0)];
    }
  }

  /* 顯示用的排列順序：先牌型、再點數高低，回傳原陣列的索引。
       一對   6 5 3 2 2 → 2 2 6 5 3（對子在前，其餘照 1>6>5>4>3>2）
       葫蘆   5 2 5 2 5 → 5 5 5 2 2
       順子             → 照點數由小到大（12345 / 23456）
     tiebreak 本來就是「由重到輕的決勝點數」，照它展開即可。 */
  function pokerSortOrder(h) {
    const d = h.dice;
    const idx = d.map((_, i) => i);

    // 順子照數字順排，讀起來才是 1 2 3 4 5
    if (h.rank === 7 || h.rank === 2) return idx.sort((a, b) => d[a] - d[b]);

    const used = d.map(() => false);
    const order = [];
    h.tiebreak.forEach((face) => {
      for (let i = 0; i < d.length; i += 1) {
        if (!used[i] && d[i] === face) { used[i] = true; order.push(i); }
      }
    });
    // 保險：tiebreak 沒點到的骰子，照點數大小補在後面
    idx.filter((i) => !used[i])
      .sort((a, b) => pokerFaceValue(d[b]) - pokerFaceValue(d[a]))
      .forEach((i) => order.push(i));
    return order;
  }

  // 同牌型時依序比組成點數、再比殘餘骰子；點數大小為 1 > 6 > 5 > 4 > 3 > 2
  function comparePoker(a, b) {
    if (a.rank !== b.rank) return a.rank - b.rank;
    const n = Math.max(a.tiebreak.length, b.tiebreak.length);
    for (let i = 0; i < n; i += 1) {
      const x = a.tiebreak[i] ? pokerFaceValue(a.tiebreak[i]) : 0;
      const y = b.tiebreak[i] ? pokerFaceValue(b.tiebreak[i]) : 0;
      if (x !== y) return x - y;
    }
    return 0;
  }

  /* ---------- 妞妞 ---------- */
  /*
     五顆骰子中挑三顆加總剛好 10，剩下兩顆相加即為點數。
     兩顆加起來剛好 10 → 妞妞（最大）；超過 10 減 10；湊不出三顆為 0 點。
  */
  function evalNiu(dice) {
    let best = null;
    for (let i = 0; i < 5; i += 1) {
      for (let j = i + 1; j < 5; j += 1) {
        for (let k = j + 1; k < 5; k += 1) {
          if (dice[i] + dice[j] + dice[k] !== 10) continue;
          const rest = [];
          for (let m = 0; m < 5; m += 1) if (m !== i && m !== j && m !== k) rest.push(m);
          const s = dice[rest[0]] + dice[rest[1]];
          const isNiu = s === 10;
          const points = isNiu ? 10 : s % 10;
          const cand = { has: true, triple: [i, j, k], rest, raw: s, points, isNiu };
          if (!best || cand.points > best.points || (cand.isNiu && !best.isNiu)) best = cand;
        }
      }
    }
    if (!best) return { has: false, triple: [], rest: [0, 1, 2, 3, 4], raw: 0, points: 0, isNiu: false, name: '無妞（0 點）' };
    best.name = best.isNiu ? '妞妞' : best.points + ' 點';
    return best;
  }

  function rankNiu(r) { return r.isNiu ? 100 : r.points; }

  global.DiceCore = {
    rollDie, roll, isRed, counts, sum,
    CONDITIONS, conditionOdds,
    liarCount, liarUnknownP, bidGreater, atLeastP,
    LIAR_FACE_ORDER, liarFaceValue, liarFaceRank, liarNextFace, isLiarBust,
    eval18, rank18, judge18,
    evalPoker, comparePoker, pokerFaceValue, pokerMadeDice, pokerSortOrder, POKER_RANKS,
    evalNiu, rankNiu,
  };
})(window);
