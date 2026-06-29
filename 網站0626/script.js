/* 繁花 BLOSSOM AGENT — Scripts */

(() => {
  // ---- 行動版導覽 ----
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  toggle?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav?.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    }
  });

  // ---- 滾動時 header 變色 ----
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- 滾動進場動畫 ----
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // ---- FAQ：開一個關其他 ----
  const faqItems = document.querySelectorAll(".faq details");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  // ---- 頁尾年份 ----
  // ---- Bloom calculator ----
  const HOURLY = 1440;
  const flowerBuds = document.querySelectorAll(".flower-bud");
  const hours = document.getElementById("hours");
  const hoursOutput = document.getElementById("hours-output");
  const bloomDays = document.getElementById("bloom-days");
  const bloomIcons = document.getElementById("bloom-icons");
  const resultHours = document.getElementById("result-hours");
  const hourlyRate = document.getElementById("hourly-rate");
  const weekIncome = document.getElementById("week-income");
  const monthIncome = document.getElementById("month-income");
  const emptyNote = document.getElementById("empty-note");

  const formatMoney = (value) => `NT$ ${value.toLocaleString()}`;
  const pulseNumber = (element) => {
    if (!element) return;
    element.classList.remove("is-updating");
    window.requestAnimationFrame(() => {
      element.classList.add("is-updating");
      window.setTimeout(() => element.classList.remove("is-updating"), 180);
    });
  };

  const updateBloomCalculator = () => {
    if (!hours) return;
    const days = document.querySelectorAll(".flower-bud.is-bloomed").length;
    const hourValue = Number(hours.value);
    const week = days * hourValue * HOURLY;
    const month = week * 4;

    const fillPct = ((hourValue - Number(hours.min)) / (Number(hours.max) - Number(hours.min))) * 100;
    hours.style.setProperty("--fill", `${fillPct}%`);

    if (hoursOutput) hoursOutput.textContent = `${hourValue} 小時`;
    if (bloomDays) bloomDays.textContent = days.toLocaleString();
    if (bloomIcons) bloomIcons.textContent = Array(days).fill("✿").join(" ");
    if (resultHours) resultHours.textContent = hourValue.toLocaleString();
    if (hourlyRate) hourlyRate.textContent = HOURLY.toLocaleString();
    if (weekIncome) weekIncome.textContent = formatMoney(week);
    if (monthIncome) monthIncome.textContent = formatMoney(month);
    if (emptyNote) emptyNote.classList.toggle("is-hidden", days > 0);

    pulseNumber(weekIncome);
    pulseNumber(monthIncome);
  };

  flowerBuds.forEach((button) => {
    button.addEventListener("click", () => {
      const isBloomed = button.classList.toggle("is-bloomed");
      button.setAttribute("aria-pressed", String(isBloomed));
      updateBloomCalculator();
    });
  });

  hours?.addEventListener("input", updateBloomCalculator);
  updateBloomCalculator();

  // ---- 六花選取盤 ----
  const FLOWERS = {
    peony: {
      num: "N° 01", name: "牡丹", en: "Peony",
      lang: "花語 — 富貴 · 雍容 · 儀態萬千",
      desc: "氣場女王，自帶光環。<br />不必開口，舉手投足皆是風景，<br />是一進門就會被回頭看的人。",
      color: "#a8232b",
    },
    sakura: {
      num: "N° 02", name: "櫻花", en: "Sakura",
      lang: "花語 — 純淨 · 浪漫 · 初識的悸動",
      desc: "溫柔系療癒派，笑容是最強武器。<br />能讓最疲憊的客人，<br />在妳身旁卸下整個世界的重量。",
      color: "#d97a8c",
    },
    rose: {
      num: "N° 03", name: "紅玫瑰", en: "Rose",
      lang: "花語 — 熱戀 · 勇敢 · 致命的吸引",
      desc: "火辣魅惑系，眼神就能勾人。<br />該收時收，該放時放，<br />把每一場酒局，過成自己的主場。",
      color: "#8a1f26",
    },
    jasmine: {
      num: "N° 04", name: "茉莉", en: "Jasmine",
      lang: "花語 — 清雅 · 樸實的溫柔 · 忠貞",
      desc: "鄰家系氣質美人，越相處越著迷。<br />不必張揚，香氣自己會說話，<br />是想守護一輩子的那種好。",
      color: "#a89865",
    },
    iris: {
      num: "N° 05", name: "鳶尾", en: "Iris",
      lang: "花語 — 信仰 · 明智 · 神秘的優雅",
      desc: "高冷個性派，自帶距離感的吸引。<br />不輕易笑，但一笑就讓人記住，<br />是越想懂、越想靠近的那種神秘。",
      color: "#604f8a",
    },
    sun: {
      num: "N° 06", name: "向日葵", en: "Sunflower",
      lang: "花語 — 忠誠 · 活力 · 堅定的愛",
      desc: "陽光開朗系，會發光的太陽。<br />能瞬間炒熱整桌氣氛，<br />是客人忙了一週、最想見到的那個人。",
      color: "#c7882a",
    },
  };

  const petalNodes = document.querySelectorAll(".petal-node");
  const display = document.getElementById("flower-display");
  if (petalNodes.length && display) {
    const hint = display.querySelector(".display-hint");
    const card = display.querySelector(".display-card");
    const fields = {
      num: card.querySelector(".display-num"),
      name: card.querySelector(".display-name"),
      en: card.querySelector(".display-en"),
      lang: card.querySelector(".display-lang"),
      desc: card.querySelector(".display-desc"),
    };

    const showFlower = (key) => {
      const data = FLOWERS[key];
      if (!data) return;
      fields.num.textContent = data.num;
      fields.name.textContent = data.name;
      fields.en.textContent = data.en;
      fields.lang.textContent = data.lang;
      fields.desc.innerHTML = data.desc;
      display.style.setProperty("--node-color", data.color);

      if (hint) hint.hidden = true;
      // 重新觸發進場動畫
      card.hidden = true;
      void card.offsetWidth;
      card.hidden = false;

      petalNodes.forEach((node) => {
        node.setAttribute("aria-selected", String(node.dataset.flower === key));
      });
    };

    petalNodes.forEach((node) => {
      node.addEventListener("click", () => showFlower(node.dataset.flower));
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Hero video moved to a horizontal carousel in the page; no JS-controlled hero-side carousel remains.

  // ---- Header quicklink and keyboard shortcut for video carousel ----
  const carouselLink = document.querySelector('.site-nav a.video-shortcut');
  const carousel = document.getElementById('video-carousel');
  const carouselTrack = document.querySelector('.video-carousel');
  const prevButton = document.querySelector('.carousel-control-prev');
  const nextButton = document.querySelector('.carousel-control-next');
  const slides = Array.from(document.querySelectorAll('.video-slide'));

  const focusCarousel = () => {
    if (!carousel) return;
    carousel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    carousel.setAttribute('tabindex', '-1');
    carousel.focus({ preventScroll: true });
  };

  const getActiveSlideIndex = () => {
    if (!carouselTrack || !slides.length) return 0;
    const trackRect = carouselTrack.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;
    return slides.reduce((best, slide, index) => {
      const rect = slide.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - trackCenter);
      if (best === null || distance < best.distance) {
        return { index, distance };
      }
      return best;
    }, null)?.index ?? 0;
  };

  const showSlide = (index) => {
    const slide = slides[index];
    if (!slide || !carouselTrack) return;
    slide.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  const scrollToPrevious = () => {
    const activeIndex = getActiveSlideIndex();
    showSlide(Math.max(0, activeIndex - 1));
  };

  const scrollToNext = () => {
    const activeIndex = getActiveSlideIndex();
    showSlide(Math.min(slides.length - 1, activeIndex + 1));
  };

  if (carouselLink && carousel) {
    carouselLink.addEventListener('click', (e) => {
      e.preventDefault();
      focusCarousel();
      history.replaceState(null, '', '#video-carousel');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'v' && (e.altKey || e.ctrlKey)) {
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;
        e.preventDefault();
        focusCarousel();
      }
    });
  }

  prevButton?.addEventListener('click', scrollToPrevious);
  nextButton?.addEventListener('click', scrollToNext);

  if (carouselTrack) {
    carouselTrack.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollToPrevious();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollToNext();
      }
    });
  }
})();

(() => {
  // ---- 常見問答手風琴（單開模式，與 faq-demo 一致） ----
  const items = document.querySelectorAll(".faq-item");

  items.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // 先收合全部，再展開點擊的這題（同一題則維持收合）
      items.forEach((other) => {
        other.classList.remove("open");
        other.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
})();
